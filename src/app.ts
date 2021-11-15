import { join, extname } from "path";
import { dialog, ipcMain } from "electron";
import {
  copySync,
  ensureDirSync,
  readFileSync,
  writeFile,
  writeFileSync,
} from "fs-extra";
import ejs from "ejs";

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Post } from "./lib/Post";

import { resolve } from "./lib/utils/url";

import importFrom from "import-from";

import { Settings } from "@/lib/interfaces/Store";
import {
  PostData,
  RendererData,
  PostRendererData,
  IndexRendererData,
} from "./lib/interfaces/rendererData";
import less from "less";

import markdown from "./lib/markdown";
import Renderer from "markdown-it/lib/renderer";

import { readdirSync, removeSync, copyFile, readdir, stat } from "fs-extra";
import { basename } from "path";
import moment from "moment";

// import { generateCss, generateIndex, generatePosts } from "@/lib/renderer";

declare const __static: string;
interface SettingsData {
  postsDir: string;
}

const domain = "aoike.azurice.com";
const siteName = "Aoike青池";

async function clearOutputFolder(outputDir: string): Promise<void> {
  const files = readdirSync(outputDir, { withFileTypes: true });
  const needClearPath = files
    .map((item) => item.name)
    .filter((name: string) => name !== ".git");

  try {
    needClearPath.forEach(async (name: string) => {
      removeSync(join(outputDir, name));
    });
  } catch (e) {
    console.log("Delete file error", e);
  }
}
export default class App {
  __dirname: string;
  settings: low.LowdbSync<any>;

  themeDir: string;
  themeTemplatesDir: string;
  themeAssetsDir: string;

  posts: Post[];
  constructor(__dirname: string) {
    console.log("Main: " + __static);
    console.log("Main: " + __dirname);
    this.__dirname = __dirname;
    this.themeDir = join(__static, "defaults", "themes", "aoikePure");
    this.themeTemplatesDir = join(this.themeDir, "templates");
    this.themeAssetsDir = join(this.themeDir, "assets");
    this.posts = [];

    this.settings = low(new FileSync(join(this.__dirname, "settings.json")));
    this.initDB();
    this.initIpcs();
  }
  initDB(): void {
    this.settings
      .defaults({ postsDir: "", outputDir: "" } as SettingsData)
      .write();
  }
  initIpcs(): void {
    // console.log("initIpcs");
    ipcMain.handle("getSettings", async () => {
      const settings = await this.settings.value();
      // console.log(settings);
      return settings;
    });

    ipcMain.handle("onSelectFolder", async () => {
      return await dialog.showOpenDialog({
        properties: ["openDirectory", "createDirectory"],
      });
    });

    ipcMain.handle("savePostsDir", async (event, postsDir = "") => {
      console.log("[ipcMain/setPostsDir]: ", postsDir);
      return await this.settings.set("postsDir", postsDir).write();
    });

    ipcMain.handle("saveOutputDir", async (event, outputDir = "") => {
      console.log("[ipcMain/saveOutputDir]: ", outputDir);
      return await this.settings.set("outputDir", outputDir).write();
    });

    ipcMain.handle(
      "saveSettings",
      async (event, settings = { postsDir: "", outputDir: "" }) => {
        console.log("[ipcMain/saveSettings]: ", settings);
        return await this.settings
          .set("outputDir", settings.outputDir)
          .set("postsDir", settings.postsDir)
          .write();
      }
    );

    ipcMain.handle("loadPosts", async (event, postsDir) => {
      const res = await (
        await readdir(postsDir)
      ).filter((fileName) => {
        return extname(fileName) == ".md";
      });
      this.posts = [];

      for (const fileName of res) {
        const fileDir = join(postsDir, fileName);
        const fileStat = await stat(fileDir);
        // console.log(fileStat.birthtime.toLocaleDateString());
        // console.log(fileStat.birthtime.toLocaleTimeString());
        // console.log(fileStat.birthtime.toLocaleString());
        this.posts.push({
          fileDir: fileDir,
          fileName: basename(join(postsDir, fileName), ".md"),
          title: fileName,
          createdTime: moment(fileStat.birthtime).format("YYYY-MM-DD hh:mm:ss"),
          modifiedTime: moment(fileStat.mtime).format("YYYY-MM-DD hh:mm:ss"),
        } as Post);
      }

      return this.posts;
    });

    ipcMain.on("test", (event) => {
      event.returnValue = __static;
    });

    ipcMain.handle(
      "generateSite",
      async (event, postsDir: string, outputDir: string) => {
        const domain = "https://aoike.azurice.com";
        const cssDir = join(outputDir, "styles");

        const postsData = this.posts.map((post) => {
          const res: PostData = {
            link: resolve(domain, "posts/" + post.fileName),
            fileName: post.fileName,
            title: post.title,
            createdTime: post.createdTime,
            modifiedTime: post.modifiedTime,
            content: "",
          };
          return res;
        });

        const rendererData: RendererData = {
          posts: postsData,
          domain: domain,
        };

        await clearOutputFolder(outputDir);

        copyFile(join(__static, "favicon.ico"), join(outputDir, "favicon.ico"));
        ensureDirSync(join(outputDir, "images"));
        copyFile(
          join(__static, "images", "avatar.jpg"),
          join(outputDir, "images", "avatar.jpg")
        );

        writeFileSync(join(outputDir, "CNAME"), "aoike.azurice.com");

        this.generateCss(cssDir);
        this.generateIndex(postsDir, outputDir, rendererData);

        return await this.generatePosts(postsDir, outputDir, rendererData);

        // TODO: Posts -> /build/posts/xxx.html (will add folder support in the future)
      }
    );
  }

  generateCss(cssDir: string) {
    const lessDir = join(this.themeAssetsDir, "styles");
    ensureDirSync(cssDir);
    const lessStr = readFileSync(join(lessDir, "main.less"), "utf-8");
    let css: string;
    less.render(lessStr, { paths: [lessDir] }, (err, res) => {
      if (!err) {
        // console.log(res!.css);
        css = res!.css;
        const cssOverride: any = importFrom(this.themeDir, "./style-override");
        // TODO: cssOverride
        css += cssOverride({ skin: "white" });
        // console.log(css);
        writeFileSync(join(cssDir, "main.css"), css);
        return true;
      } else {
        console.log(err);
        return false;
      }
    });
  }

  generatePosts(
    postsDir: string,
    outputDir: string,
    rendererData: RendererData
  ) {
    const templatePath = join(this.themeTemplatesDir, "post.ejs");
    ensureDirSync(join(outputDir, "posts"));
    for (const post of rendererData.posts) {
      const outputPath = join(outputDir, "posts", post.fileName + ".html");
      post.content = readFileSync(
        join(postsDir, post.fileName + ".md"),
        "utf-8"
      );

      post.content = markdown.render(post.content);

      const postRendererData: PostRendererData = {
        post: post,
        siteName: siteName,
        ...rendererData,
      };

      let html = "";
      ejs.renderFile(templatePath, postRendererData, (err: any, str) => {
        if (err) {
          return err;
          console.log(err);
        } else {
          html = str;
          writeFileSync(outputPath, html);
        }
      });
    }
  }

  async generateIndex(
    postsDir: string,
    outputDir: string,
    rendererData: RendererData
  ) {
    const outputPath = join(outputDir, "index.html");
    const templatePath = join(this.themeTemplatesDir, "index.ejs");

    const indexRendererData: IndexRendererData = {
      siteName,
      ...rendererData,
    };

    let html = "";
    await ejs.renderFile(
      templatePath,
      indexRendererData,
      async (err: any, str) => {
        if (err) {
          console.log(err);
        } else {
          html = str;
        }
      }
    );
    return await writeFile(outputPath, html);
  }
}

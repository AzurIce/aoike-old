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

import { RendererData, PostRendererData } from "./lib/interfaces/rendererData";
import less from "less";

import markdown from "./lib/markdown";
import Renderer from "markdown-it/lib/renderer";

// import gulp from "gulp";
// import less from "gulp-less";

declare const __static: string;
interface SettingsData {
  postsDir: string;
}

const domain = "aoike.azurice.com";

export default class App {
  __dirname: string;
  settings: low.LowdbSync<any>;

  themeDir: string;
  themeTemplatesDir: string;
  themeAssetsDir: string;
  constructor(__dirname: string) {
    console.log("Main: " + __static);
    console.log("Main: " + __dirname);
    this.__dirname = __dirname;
    this.themeDir = join(__static, "defaults", "themes", "aoikeNotes");
    this.themeTemplatesDir = join(this.themeDir, "templates");
    this.themeAssetsDir = join(this.themeDir, "assets");

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

    ipcMain.on("generateCSS", (event, cssDir: string) => {
      const lessDir = join(this.themeAssetsDir, "styles");
      ensureDirSync(cssDir);
      const lessStr = readFileSync(join(lessDir, "main.less"), "utf-8");
      less.render(lessStr, { paths: [lessDir] }, (err, res) => {
        if (!err) {
          // console.log(res!.css);
          writeFileSync(join(cssDir, "main.css"), res!.css);
          event.returnValue = true;
        } else {
          console.log(err);
          event.returnValue = false;
        }
      });
    });

    ipcMain.on(
      "generatePosts",
      (
        event,
        postsDir: string,
        outputDir: string,
        rendererData: RendererData
      ) => {
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
            domain: rendererData.domain,
          };

          let html = "";
          ejs.renderFile(templatePath, postRendererData, (err: any, str) => {
            if (err) {
              event.returnValue = err;
              console.log(err);
            } else {
              html = str;
              writeFileSync(outputPath, html);
            }
          });
        }
        event.returnValue = true;
      }
    );

    ipcMain.handle(
      "generateIndex",
      async (event, outputDir: string, rendererData: RendererData) => {
        const outputPath = join(outputDir, "index.html");
        const templatePath = join(this.themeTemplatesDir, "index.ejs");

        let html = "";
        await ejs.renderFile(
          templatePath,
          rendererData,
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
    );

    /*
    ipcMain.handle(
      "generateSite",
      async (event, postsDir: string, outputDir: string, posts: Post[]) => {
        const domain = "https://aoike.azurice.com";
        let html = "";
        const renderPath = join(outputDir, "index.html");
        const templatePath = join(__static, "defaults", "notes", "index.ejs");
        let postsData = [];

        postsData = posts.map((post) => {
          const res: PostData = {
            fileName: post.fileName,
            title: post.title,
            link: resolve(domain, post.fileName),
            createdTime: post.createdTime,
            modifiedTime: post.modifiedTime,
          };
          return res;
        });
        await ejs.renderFile(templatePath, postsData, async (err:any, str) => {
          html = str;
        });
        return html;

        // TODO: Main Page -> /build/index.html
        // TODO: Posts -> /build/posts/xxx.html (will add folder support in the future)
      }
    );
    */
  }
}

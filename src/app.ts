import { join, extname } from "path";
import { dialog, ipcMain } from "electron";
import { readdir } from "fs/promises";
import { readFileSync, writeFileSync } from "fs-extra";
import ejs from "ejs";

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Post } from "./lib/Post";

import { resolve } from "./lib/utils/url";

import { RendererData } from "./lib/interfaces/rendererData";
import less from "less";

// import gulp from "gulp";
// import less from "gulp-less";

declare const __static: string;
interface SettingsData {
  postsDir: string;
}

export default class App {
  __dirname: string;
  settings: low.LowdbSync<any>;
  constructor(__dirname: string) {
    this.__dirname = __dirname;
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

    ipcMain.on("generateCSS", (event, lessDir: string, cssDir: string) => {
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

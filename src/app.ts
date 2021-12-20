import { join, extname, dirname } from "path";
import { dialog, ipcMain } from "electron";

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Post } from "./lib/Post";

import { readdirSync, removeSync, copyFile, readdir, stat } from "fs-extra";
import { basename } from "path";
import moment from "moment";

import { generateSite } from "@/lib/renderer";
import { Theme } from "./lib/config";
import { getMdFiles } from "./lib/utils/file";

declare const __static: string;
interface SettingsData {
  postsDir: string;
}
export default class App {
  __dirname: string;
  settings: low.LowdbSync<any>;

  theme: Theme;

  posts: Post[];
  constructor(__dirname: string) {
    const themeDir = join(__static, "defaults", "themes", "aoikePure");
    this.__dirname = __dirname;
    this.theme = new Theme(themeDir);

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

    ipcMain.handle("loadPosts", async (event, postsDir: string) => {
      const mdFileList = getMdFiles(postsDir);
      console.log(mdFileList);
      this.posts = [];

      for (const filepath of mdFileList) {
        const fileStat = await stat(filepath);
        const filename = basename(filepath);
        // console.log(fileStat.birthtime.toLocaleDateString());
        // console.log(fileStat.birthtime.toLocaleTimeString());
        // console.log(fileStat.birthtime.toLocaleString());
        // console.log(dirname(filepath));
        // console.log(dirname(filepath).slice(postsDir.length));
        this.posts.push({
          filepath: filepath,
          fileName: basename(filename, ".md"),
          title: filename,
          createdTime: moment(fileStat.birthtime).format("YYYY-MM-DD hh:mm:ss"),
          modifiedTime: moment(fileStat.mtime).format("YYYY-MM-DD hh:mm:ss"),
          category: dirname(filepath).slice(postsDir.length + 1),
        } as Post);
      }

      return this.posts;
    });

    // ipcMain.on("test", (event) => {
    //   event.returnValue = __static;
    // });

    // Generate site
    ipcMain.handle(
      "generateSite",
      async (event, postsDir: string, outputDir: string) => {
        return generateSite(postsDir, outputDir, this.posts, this.theme);
      }
    );
  }
}

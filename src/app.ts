import { join } from "path";
import { dialog, ipcMain } from "electron";

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

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
    this.settings.defaults({ postsDir: "", a: "" } as SettingsData).write();
  }
  initIpcs(): void {
    // console.log("initIpcs");
    ipcMain.handle("getSettings", async () => {
      const settings = await this.settings.value();
      console.log(settings);
      return settings;
    });

    ipcMain.handle("onSelectFolder", async () => {
      return await dialog.showOpenDialog({
        properties: ["openDirectory", "createDirectory"],
      });
    });

    ipcMain.handle("setPostsDir", async (event, postsDir = "") => {
      console.log("[ipcMain/setPostsDir]: ", postsDir);
      return await this.settings.set("postsDir", postsDir).write();
    });
  }
}

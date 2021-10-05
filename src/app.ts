// import { join } from "path";
import { dialog, ipcMain } from "electron";

// import { Low, JSONFile } from "lowdb";

// interface SettingsData {
//   postsDir: string;
// }

export default class App {
  __dirname: string;
  // settings: Low;
  // settings = new Low(new JSONFile(join(__dirname, "settings.json")));
  constructor(__dirname: string) {
    // setInterval(() => {
    //   console.log("!");
    // }, 1000);
    this.__dirname = __dirname;
    // this.settings.read().then(() => {
    this.initDB();
    this.initIpcs();
    // });
    console.log("?");
  }
  initDB(): void {
    // const settingsAdapter = new JSONFile<SettingsData>(
    //   join(this.__dirname, "settings.json")
    // );
    // const settings = new Low<SettingsData>(settingsAdapter);
  }
  initIpcs(): void {
    // console.log("initIpcs");
    ipcMain.handle("onSelectFolder", async () => {
      return await dialog.showOpenDialog({
        properties: ["openDirectory", "createDirectory"],
      });
    });

    ipcMain.handle("setPostsDir", () => {
      // TODO: Save to File
      // this.settings.data.postsDir =
    });
  }
}

import { ipcRenderer } from "electron";
import { createStore } from "vuex";

import { State, Settings } from "../lib/interfaces/Store";

export default createStore({
  state(): State {
    return {
      settings: {
        postsDir: "",
        outputDir: "",
      },
    };
  },
  mutations: {
    loadSettings(state: State) {
      ipcRenderer.invoke("getSettings").then((res: Settings) => {
        state.settings = res;
      });
    },
    // setSettings(state: any, settings: string) {
    //   state.settings = settings;
    // },
    setPostsDir(state: State, postsDir: string) {
      ipcRenderer.invoke("savePostsDir", postsDir).then(() => {
        state.settings.postsDir = postsDir;
      });
    },
    setOutputDir(state: State, outputDir: string) {
      ipcRenderer.invoke("saveOutputDir", outputDir).then(() => {
        state.settings.outputDir = outputDir;
      });
    },
    setSettings(state: State, settings: Settings) {
      console.log(settings);
      ipcRenderer.invoke("saveSettings", settings).then(() => {
        state.settings = settings;
      });
    },
  },
  actions: {
    // saveSettings(context, postsDir: string) {
    //   context.commit("setPostsDir", postsDir);
    // },
  },
});

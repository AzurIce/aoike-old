import { ipcRenderer } from "electron";
import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      settings: {
        postsDir: "",
        outputDir: "",
      },
    };
  },
  mutations: {
    loadSettings(state: any) {
      ipcRenderer.invoke("getSettings").then((res) => {
        state.settings = res;
      });
    },
    // setSettings(state: any, settings: string) {
    //   state.settings = settings;
    // },
    setPostsDir(state: any, postsDir: string) {
      ipcRenderer.invoke("savePostsDir", postsDir).then(() => {
        state.settings.postsDir = postsDir;
      });
    },
    setOutputDir(state: any, outputDir: string) {
      ipcRenderer.invoke("saveOutputDir", outputDir).then(() => {
        state.settings.outputDir = outputDir;
      });
    },
    setSettings(state: any, settings: any) {
      console.log(settings)
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

import { ipcRenderer } from "electron";
import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      settings: {
        postsDir: "",
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
  },
  actions: {
    // saveSettings(context, postsDir: string) {
    //   context.commit("setPostsDir", postsDir);
    // },
  },
});

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
    setSettings(state: any, settings: string) {
      state.settings = settings;
    },
    setPostsDir(state: any, postsDir: string) {
      ipcRenderer.invoke("setPostsDir").then(() => {
        state.settings.postsDir = postsDir;
      });
    },
  },
  actions: {
    saveSettings(context, postsDir: string) {
      context.commit("setPostsDir", postsDir);
    },
  },
});

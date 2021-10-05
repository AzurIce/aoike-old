import { ipcRenderer } from "electron";
import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      postsDir: "",
    };
  },
  mutations: {
    setPostsDir(state: any, postsDir: string) {
      ipcRenderer.invoke("setPostsDir").then(() => {
        state.postsDir = postsDir;
      });
    },
  },
  actions: {
    saveSettings(context, postsDir: string) {
      context.commit("setPostsDir", postsDir);
    },
  },
});

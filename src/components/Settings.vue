<template>
  <a-form>
    <a-form-item label="postsDir">
      <a-input :value="currentPostsDir">
        <template #suffix>
          <FolderOutlined @click="onSelectFolder" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="savePostsFolder">Save</a-button>
    </a-form-item>
  </a-form>
  {{ this.settings }}
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { State, Mutation } from "vuex-class";
import { FolderOutlined } from "@ant-design/icons-vue";

import { ipcRenderer } from "electron";

@Options({
  components: { FolderOutlined },
})
export default class Settings extends Vue {
  @State("settings") settings: any;
  @Mutation setPostsDir: any;

  currentPostsDir = "";
  mounted(): void {
    // console.log(this.settings.postsDir)
    this.currentPostsDir = this.settings.postsDir;
  }
  async onSelectFolder(): Promise<void> {
    const res = await ipcRenderer.invoke("onSelectFolder");
    if (res.filePaths.length > 0) {
      this.currentPostsDir = res.filePaths[0].replace(/\\/g, "/");
    }
  }
  async savePostsFolder(): Promise<void> {
    await ipcRenderer.invoke("setPostsDir", this.currentPostsDir);
  }
}
</script>

<style></style>

<template>
  <a-form :layout="horizontal">
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
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { State } from "vuex-class";
import { FolderOutlined } from "@ant-design/icons-vue";

import { ipcRenderer } from "electron";

@Options({
  components: { FolderOutlined },
})
export default class Settings extends Vue {
  @State("postsDir") postsDir: any;

  currentPostsDir = "";
  async onSelectFolder(): Promise<void> {
    const res = await ipcRenderer.invoke("onSelectFolder");
    if (res.filePaths.length > 0) {
      this.currentPostsDir = res.filePaths[0].replace(/\\/g, "/");
    }
  }
  savePostsFolder(): void {
    console.log(this.postsDir);
  }
}
</script>

<style></style>

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
import { FolderOutlined } from "@ant-design/icons-vue";

import { ipcRenderer } from "electron";
import { defineComponent } from "@vue/runtime-core";
import { mapMutations, mapState } from "vuex";

export default defineComponent({
  name: "Settings",
  components: { FolderOutlined },
  computed: {
    ...mapState(["settings"]),
  },
  watch: {
    settings(newSettings) {
      this.currentPostsDir = newSettings.postsDir;
    },
  },
  data() {
    return {
      currentPostsDir: "",
    };
  },
  mounted(): void {
    // console.log(this.settings.postsDir);
    this.currentPostsDir = this.settings.postsDir;
  },
  methods: {
    ...mapMutations(["setPostsDir"]),
    async onSelectFolder(): Promise<void> {
      const res = await ipcRenderer.invoke("onSelectFolder");
      if (res.filePaths.length > 0) {
        this.currentPostsDir = res.filePaths[0].replace(/\\/g, "/");
      }
    },
    savePostsFolder(): void {
      this.setPostsDir(this.currentPostsDir);
    },
  },
});
</script>

<style></style>

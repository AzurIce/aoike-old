<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); background: #fff"
      title="Settings"
      sub-title="Just settings"
    >
      <template #extra>
        <a-button type="primary" key="deploy" @click="saveSettings"
          >Save all</a-button
        >
      </template>
    </a-page-header>
    <div
      style="
        border: 1px solid rgb(235, 237, 240);
        background: #fff;
        flex-grow: 1;
        margin: 3px 0px;
        padding: 20px;
      "
    >
      <a-form>
        <a-form-item label="postsDir">
          <a-input :value="currentPostsDir">
            <template #suffix>
              <FolderOutlined @click="onSelectPostsFolder" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="savePostsFolder">Save</a-button>
        </a-form-item>
        <a-form-item label="outputDir">
          <a-input :value="currentOutputDir">
            <template #suffix>
              <FolderOutlined @click="onSelectOutputFolder" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="saveOutputFolder">Save</a-button>
        </a-form-item>
      </a-form>
      Just for debuging: {{ this.settings }}
    </div>
  </div>
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
      this.currentOutputDir = newSettings.outputDir;
    },
  },
  data() {
    return {
      currentPostsDir: "",
      currentOutputDir: "",
    };
  },
  mounted(): void {
    // console.log(this.settings.postsDir);
    this.currentPostsDir = this.settings.postsDir;
    this.currentOutputDir = this.settings.outputDir;
  },
  methods: {
    ...mapMutations(["setPostsDir", "setOutputDir", "setSettings"]),
    async onSelectPostsFolder(): Promise<void> {
      const res = await ipcRenderer.invoke("onSelectFolder");
      if (res.filePaths.length > 0) {
        this.currentPostsDir = res.filePaths[0].replace(/\\/g, "/");
      }
    },
    async onSelectOutputFolder(): Promise<void> {
      const res = await ipcRenderer.invoke("onSelectFolder");
      if (res.filePaths.length > 0) {
        this.currentOutputDir = res.filePaths[0].replace(/\\/g, "/");
      }
    },
    savePostsFolder(): void {
      this.setPostsDir(this.currentPostsDir);
    },
    saveOutputFolder(): void {
      this.setOutputDir(this.currentOutputDir);
    },
    saveSettings(): void {
      this.setSettings({
        postsDir: this.currentPostsDir,
        outputDir: this.currentOutputDir,
      });
    },
  },
});
</script>

<style></style>

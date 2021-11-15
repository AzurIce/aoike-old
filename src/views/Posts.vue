<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); background: #fff"
      title="Posts"
      sub-title="Your intelligent crystals"
    >
      <template #extra>
        <a-button
          type="primary"
          key="deploy"
          :loading="loading"
          @click="onDeploy"
        >
          Generate /*& Publish*/
        </a-button>
        <a-button type="primary" @click="onTest">Test</a-button>
      </template>
    </a-page-header>
    <div style="overflow-y: auto; flex-grow: 1">
      <template v-for="(post, index) in posts" :key="index">
        <PostCard :post="post" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
import PostCard from "../components/PostCard.vue";

import { Post } from "../lib/Post";

export default defineComponent({
  name: "Posts",
  components: {
    PostCard,
  },
  data(): any {
    return {
      posts: [] as Post[],
      loading: false,
    };
  },
  computed: {
    ...mapState({
      postsDir: (state: any) => state.settings.postsDir,
      outputDir: (state: any) => state.settings.outputDir,
    }),
  },
  watch: {
    postsDir(): void {
      this.loadPosts();
    },
  },
  mounted(): void {
    if (this.postsDir) {
      this.loadPosts();
    }
  },
  methods: {
    onTest() {
      const res = ipcRenderer.sendSync("test");
      console.log(res);
    },
    loadPosts() {
      ipcRenderer.invoke("loadPosts", this.postsDir).then((res) => {
        // console.log(res);
        this.posts = res;
      });
    },
    onDeploy() {
      this.loading = true;
      this.$message.loading({ content: "Generating...", key: "toast" });
      console.log("[onDeploy]");
      ipcRenderer
        .invoke("generateSite", this.postsDir, this.outputDir)
        .then((res) => {
          this.$message
            .success({
              content: "Success!",
              key: "toast",
              duration: 1,
            })
            .then(() => {
              this.loading = false;
            });
        });
    },
  },
});
</script>

<style></style>

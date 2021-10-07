<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); background: #fff"
      title="Posts"
      sub-title="Your intelligent crystals"
    >
      <template #extra>
        <a-button type="primary" key="deploy" @click="onDeploy">
          Generate /*& Publish*/
        </a-button>
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
import { readdir } from "fs/promises";
import { join, extname, basename } from "path";
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
    };
  },
  computed: {
    ...mapState({
      postsDir: (state: any) => state.settings.postsDir,
      outputDir: (state: any) => state.settinfs.outputDir,
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
    // console.log(this.postsDir)
  },
  methods: {
    async loadPosts(): Promise<void> {
      const res = await readdir(this.postsDir);
      let posts: Post[] = [];
      res.forEach((name) => {
        if (extname(name) == ".md") {
          // console.log(join(this.postsDir, name));
          // console.log(basename(join(this.postsDir, name), ".md"));
          posts.push({
            fileDir: join(this.postsDir, name),
            title: basename(join(this.postsDir, name), ".md"),
          } as Post);
        }
      });
      this.posts = posts;
    },
  },
  async onDeploy() {
    const res = await ipcRenderer.invoke(
      "generateSite",
      this.postsDir,
      this.outputDir,
      this.posts
    );
    console.log(res);
  },
});
</script>

<style></style>

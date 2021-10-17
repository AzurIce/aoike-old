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
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import { mapState } from "vuex";
import PostCard from "../components/PostCard.vue";

import { Post } from "../lib/Post";
import moment from "moment";

import { generateSite } from "../lib/renderer";

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
    // console.log(this.postsDir)
  },
  methods: {
    async loadPosts(): Promise<void> {
      const res = await (
        await readdir(this.postsDir)
      ).filter((fileName) => {
        return extname(fileName) == ".md";
      });
      let posts: Post[] = [];

      for (let fileName of res) {
        const fileDir = join(this.postsDir, fileName);
        const fileStat = await stat(fileDir);
        // console.log(fileStat.birthtime.toLocaleDateString());
        // console.log(fileStat.birthtime.toLocaleTimeString());
        // console.log(fileStat.birthtime.toLocaleString());
        posts.push({
          fileDir: fileDir,
          fileName: basename(join(this.postsDir, fileName), ".md"),
          title: fileName,
          createdTime: moment(fileStat.birthtime).format("YYYY-MM-DD hh:mm:ss"),
          modifiedTime: moment(fileStat.mtime).format("YYYY-MM-DD hh:mm:ss"),
        } as Post);
      }
      this.posts = posts;
    },
    async onDeploy() {
      console.log("[onDeploy]");
      await generateSite(this.postsDir, this.outputDir, this.posts);
      // const res = await ipcRenderer.invoke(
      //   "generateSite",
      //   this.postsDir,
      //   this.outputDir,
      //   posts
      // );
      // console.log(res);
    },
  },
});
</script>

<style></style>

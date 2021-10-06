<template>
  <div v-for="(post, index) in posts" :key="index">
    <PostCard :title="post" />
  </div>
</template>

<script lang="ts">
import { readdir } from "fs/promises";
import { extname } from "path";
import { mapState } from "vuex";
import PostCard from "../components/PostCard.vue";

export default {
  name: "Posts",
  components: {
    PostCard,
  },
  data() {
    return {
      posts: [] as string[],
    };
  },
  computed: {
    ...mapState({
      postsDir: (state: any) => state.settings.postsDir,
    }),
  },
  watch: {
    postsDir(): void {
      this.loadPosts();
    },
  },
  mounted(): void {
    this.loadPosts();
  },
  methods: {
    async loadPosts(): Promise<void> {
      const res = await readdir(this.postsDir);
      let posts: string[] = [];
      res.forEach((name) => {
        if (extname(name) == ".md") {
          posts.push(name);
        }
      });
      this.posts = posts;
      console.log(res);
    },
  },
};
</script>

<style></style>

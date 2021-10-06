<template>
  <div class="post-card">
    <a-card :title="post.title">
      {{ post.fileDir }}
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
// import { Post } from "../lib/Post";

export default defineComponent({
  name: "PostCard",
  props: {
    post: Object,
  },
});
</script>

<style>
.post-card {
  margin: 3px 0px;
}
</style>

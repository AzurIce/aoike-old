<template>
  <div class="post-card">
    <a-card :title="title"> </a-card>
  </div>
</template>

<script>
export default {
  name: "PostCard",
  props: {
    title: String,
  },
};
</script>

<style>
.post-card {
  margin: 3px 0px;
}
</style>

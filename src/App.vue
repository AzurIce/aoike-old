<template>
  {{ settings }}
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
  <settings />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";
// import HelloWorld from "./components/HelloWorld.vue";
import Settings from "./components/Settings.vue";
import { mapState, mapMutations } from "vuex";

export default defineComponent({
  name: "App",
  components: {
    // HelloWorld,
    Settings,
  },
  computed: {
    ...mapState(["settings"]),
  },
  mounted(): void {
    // console.log("[Renderer/mounted]");
    this.loadSettings();
  },
  methods: {
    ...mapMutations(["setSettings", "loadSettings"]),
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <!-- {{ settings }} -->
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
  <a-layout style="height: 100%">
    <a-layout-sider style="background: #fff">
      <a-menu mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="Posts">
          <router-link to="/posts">Posts</router-link>
        </a-menu-item>
        <a-menu-item key="Settings">
          <router-link to="/settings"><SettingOutlined /></router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <!-- <a-layout-header></a-layout-header> -->
    <a-layout-content style="padding: 7px">
      <router-view />
    </a-layout-content>
    <!-- <a-layout-footer></a-layout-footer> -->
  </a-layout>
  <!-- <settings /> -->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { ipcRenderer } from "electron";
// import HelloWorld from "./components/HelloWorld.vue";
// import Settings from "./components/Settings.vue";
import { mapState, mapMutations } from "vuex";
import { SettingOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "App",
  components: {
    // HelloWorld,
    // Settings,
    SettingOutlined,
  },
  setup() {
    const selectedKeys = ref<string[]>(["Settings"]);
    return {
      selectedKeys,
    };
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
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>

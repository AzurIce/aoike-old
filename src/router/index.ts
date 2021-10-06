import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Settings from "../views/Settings.vue";
import Posts from "../views/Posts.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/posts",
    name: "Posts",
    component: Posts,
  },
  //   {
  //     path: "/about",
  //     name: "About",
  //     // route level code-splitting
  //     // this generates a separate chunk (about.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () =>
  //       import(/* webpackChunkName: "about" */ "../views/About.vue"),
  //   },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

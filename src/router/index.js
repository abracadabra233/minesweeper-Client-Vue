// router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import GameOverPage from "../components/GameOverPage.vue";
import GamePage from "../components/GamePage.vue";
import HomePage from "../components/HomePage.vue";
import WaitingRoom from "../components/WaitingRoom.vue";

// 创建并导出路由器实例
const router = createRouter({
  history: createWebHashHistory(), // 使用 HTML5 History 模式
  routes: [
    { path: "/", component: HomePage, name: "home", props: true },
    { path: "/GamePage", component: GamePage, name: "GamePage", props: true },
    {
      path: "/WaitingRoom",
      component: WaitingRoom,
      name: "WaitingRoom",
      props: true,
    },
    {
      path: "/GameOver",
      component: GameOverPage,
      name: "GameOver",
      props: true,
    },
  ],
});

export default router;

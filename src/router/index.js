// router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import GameOverPage from "../components/GameOverPage.vue";
import GamePage from "../components/GamePage.vue";
import HomePage from "../components/HomePage.vue";
import WaitingRoom from "../components/WaitingRoom.vue";
import store from '../store';

// 创建并导出路由器实例
const router = createRouter({
  history: createWebHashHistory(), // 使用 HTML5 History 模式
  // history: createWebHistory(),
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

router.beforeEach((to, from, next) => {
  if (!store.state.ws) {
    if (to.name !== 'home') { // 假设首页路由的名字是'homepage'
      next({ name: 'home' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

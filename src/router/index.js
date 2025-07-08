import { createRouter, createWebHashHistory } from "vue-router";
import { useGameStore } from "@/stores/game";
import GamePage from "@/components/GamePage.vue";
import HomePage from "@/components/HomePage.vue";
import WaitingRoom from "@/components/WaitingRoom.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: HomePage,
    meta: {
      title: "扫雷游戏 - 首页",
      requiresAuth: false,
    },
  },
  {
    path: "/game",
    name: "game",
    component: GamePage,
    meta: {
      title: "扫雷游戏 - 游戏",
      requiresAuth: true,
    },
  },
  {
    path: "/wait",
    name: "wait",
    component: WaitingRoom,
    meta: {
      title: "扫雷游戏 - 等待室",
      requiresAuth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const gameStore = useGameStore();

  if (to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.meta.requiresAuth && !gameStore.isConnected) {
    next({ name: "home" });
    return;
  }

  next();
});

router.onError((error) => {
  console.error("Router error:", error);
});

export default router;

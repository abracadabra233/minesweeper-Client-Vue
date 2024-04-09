import { createRouter, createWebHashHistory } from "vue-router";
import GamePage from "@/components/GamePage.vue";
import HomePage from "@/components/HomePage.vue";
import WaitingRoom from "@/components/WaitingRoom.vue";
import store from "@/store";

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(),
  routes: [
    { path: "/home", component: HomePage, name: "home", props: true },
    { path: "/game", component: GamePage, name: "game", props: true },
    { path: "/wait", component: WaitingRoom, name: "wait", props: true },
  ],
});

router.beforeEach((to, from, next) => {
  if (!store.state.ws) {
    if (to.name !== "home") {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

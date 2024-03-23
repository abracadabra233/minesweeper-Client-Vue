// main.js
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';


import { createApp } from "vue";
import App from "@/App.vue";
import store from "@/store"; // 确保导入了store
import router from "@/router"; // 从router/index.js导入路由配置

const app = createApp(App);

app.use(router); // 使用路由
app.use(store); //
app.mount("#app"); // 挂载Vue应用

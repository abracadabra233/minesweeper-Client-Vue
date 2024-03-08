// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 从router/index.js导入路由配置
import store from './store'; // 确保导入了store
const app = createApp(App);

app.use(router); // 使用路由
app.use(store); // 
app.mount('#app'); // 挂载Vue应用

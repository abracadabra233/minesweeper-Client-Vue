const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 15436,
    allowedHosts: "all",
    // proxy: {
    //   "^/ws": {
    //     // target: "ws://localhost:15437",
    //     target: "ws://10.4.208.55:30081",
    //     // const ws = new WebSocket("wss://lvpy.chailab.cn:33000/ws/mpm/ws");
    //     // const ws = new WebSocket("ws://10.4.208.55:15436/ws");
    //     ws: true,
    //     changeOrigin: true,
    //   },
    // },
    webSocketServer: false,
  },
  // cargo tauri build  时需要将publicPath注释；发布到github page需要这个
  publicPath:
    process.env.TAURI_BUILD ? '/' : (process.env.NODE_ENV === 'production' ? '/minesweeper-Client-Vue/' : '/'),
});

import { defineConfig } from "@vue/cli-service";
export default defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 15436,
    allowedHosts: "all",
    proxy: {
      "^/ws": {
        target: "ws://127.0.0.1:15437",
        ws: true,
        changeOrigin: true,
      },
    },
    webSocketServer: false,
  },
  publicPath:
    process.env.NODE_ENV === "production" ? "/minesweeper-Client-Vue/" : "/",
});

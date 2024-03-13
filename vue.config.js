const { defineConfig } =  require("@vue/cli-service");
module.exports=defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 15436,
    allowedHosts: "all",
    proxy: {
      "^/ws": {
        target: "ws://localhost:15437",
        ws: true,
        changeOrigin: true,
      },
    },
    webSocketServer: false,
  },
  publicPath:
    process.env.NODE_ENV === "production" ? "/minesweeper-Client-Vue/" : "/",
});

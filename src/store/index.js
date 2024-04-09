import { createStore } from "vuex";
import websocket from "@/store/modules/websocket";

export default createStore({
  modules: { websocket },
  state: { ws: null },
  actions: {
    initWebSocket({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.ws && state.ws.readyState === WebSocket.OPEN) {
          resolve();
        } else {
          const url = process.env.VUE_APP_WEBSOCKET_URL;
          const ws = new WebSocket(url);
          ws.onopen = () => {
            console.log("WebSocket connection established, setWebSocketConnection");
            commit("setWebSocketConnection", ws);
            resolve();
          };
          ws.onerror = (error) => {
            console.error("WebSocket connection error:", error);
            reject(error);
          };
          ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message && message.type) {
              console.log(`Recv message | ${message.type} |`, message);
              this.dispatch(`websocket/${message.type}`, message);
            }
          };
          ws.onclose = (event) => {
            console.log("WebSocket closed by server, clearWebSocketConnection", event);
            commit("clearWebSocketConnection");
            // Here you could add reconnection logic or other handling
          };
        }
      });
    },
    sendMessage({ dispatch, state }, message) {
      console.log(`Send message | ${message.type} |`, message);
      dispatch('initWebSocket').then(() => {
        state.ws.send(JSON.stringify(message));
      }).catch(error => {
        console.error("Failed to initialize WebSocket:", error);
      });
    },
  },
  mutations: {
    setWebSocketConnection(state, ws) {
      state.ws = ws;
    },
    clearWebSocketConnection(state) {
      state.ws = null;
    },
  },
});

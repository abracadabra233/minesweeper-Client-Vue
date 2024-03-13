import { adventurerNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { createStore } from "vuex";

function generateRandomId() {
  return Math.floor(Math.random() * 10000).toString();
}

function generateRandomName() {
  const names = ["Alice", "Bob", "Charlie", "Dana", "Eli", "Fiona"];
  return names[Math.floor(Math.random() * names.length)];
}

// Vuex 4 store definition compatible with Vue 3
export default createStore({
  state() {
    return {
      ws: null, // 用于存储WebSocket连接
      roomInfo: {
        players: [],
        room_id: "",
      },
      player: {
        id: generateRandomId(),
        name: generateRandomName(),
        icon: createAvatar(adventurerNeutral, {
          seed: generateRandomId(),
        }).toString(),
      },
      gameConfig: null,
      gameBoard: [],
    };
  },
  mutations: {
    // 设置WebSocket连接
    setWebSocket(state, ws) {
      state.ws = ws;
    },
    setRoomInfo(state, roomInfo) {
      state.roomInfo = roomInfo;
      state.roomInfo.players.push(state.player);
    },
    addPlayerToRoom(state, player) {
      state.roomInfo.players.push(player);
    },
    removePlayerFromRoom(state, player_id) {
      state.roomInfo.players = state.roomInfo.players.filter(
        (player) => player.id !== player_id
      );
    },
    setGameConfig(state, config) {
      state.gameConfig = config;
      state.gameBoard = Array.from({ length: config.rows }, () =>
        Array.from({ length: config.cols }, () => ({
          status: "Closed",
          a_mines: 0,
        }))
      );
      console.log('游戏开始', state.gameBoard );
    },
    updateCellStatus(state, { x, y, status }) {
      console.log(`Updating cell at (${x}, ${y}): ${status}`);
      const cell = state.gameBoard[x][y];
      if (status.Opened) {
        cell.a_mines = status.Opened.a_mines;
        cell.status = "Opened";
      } else if (status == "Closed") {
        cell.status = "Closed";
      } else if (status == "Flagged") {
        cell.status = "Flagged";
      }
    },
  },
  actions: {
    initWebSocket({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 如果WebSocket已经初始化且处于打开状态，直接解决Promise
        if (state.ws && state.ws.readyState === WebSocket.OPEN) {
          resolve(state.ws);
        } else {
          const ws = new WebSocket("ws://localhost:15436/ws");
          ws.close = () => {
            console.log("WebSocket断开");
          };
          ws.onopen = () => {
            console.log("WebSocket连接成功");
            commit("setWebSocket", ws);
            resolve(ws); // 连接成功，解决Promise
          };
          ws.onerror = (error) => {
            console.error("WebSocket连接错误", error);
            reject(error); // 连接错误，拒绝Promise
          };
          ws.onmessage = (event) => {
            console.log("WebSocket Response", event.data);
            const data = JSON.parse(event.data);
            switch (data.type) {
              case "JoinSuccess":
                commit("setRoomInfo", {
                  players: data.players,
                  room_id: data.room_id,
                });
                break;
              case "PlayerJoin":
                commit("addPlayerToRoom", data.player);
                break;
              case "PlayerLeave":
                commit("removePlayerFromRoom", data.player_id);
                break;
              case "GameStart":
                commit("setGameConfig", data.config);
                break;
              case "GameOpRes":
                if (data.op_res.Ok) {
                  console.log("handleGameops Ok",data.op_res.Ok.cells);
                  data.op_res.Ok.cells.forEach(({ x, y, status }) => {
                    commit("updateCellStatus", { x, y, status });
                  });
                } else if (data.op_res.Over) {
                  console.log("WebSocket连接成功");
                  alert("handleGameOver");
                  break;
                } else if (data.op_res.Win) {
                  console.log("WebSocket连接成功");
                  alert("handleGameWon");
                  break;
                }
            }
          };

          // 根据需要添加其他事件处理器
        }
      });
    },
  },
});

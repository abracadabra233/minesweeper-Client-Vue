import { adventurerNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

function generateRandomId() {
  return Math.floor(Math.random() * 10000).toString();
}

function generateRandomName() {
  const names = ["Alice", "Bob", "Charlie", "Dana", "Eli", "Fiona"];
  return names[Math.floor(Math.random() * names.length)];
}

function getCurPlayer() {
  let curPlayer = {
    id: generateRandomId(),
    name: generateRandomName(),
    icon: createAvatar(adventurerNeutral, { seed: generateRandomId() }).toString(),
    is_ready: false,
  };
  return curPlayer;
}

export default {
  namespaced: true,
  state: () => ({
    // static data
    roomInfo: { players: {}, room_id: "" },
    curPlayer: getCurPlayer(),
    gameConfig: null,
    // dynamic data
    flagCount: 0,
    gameBoard: [],
    gameStatus: "None", // Waiting ,Gameing 
    gameEndFalg: 'None',// Gamewin ,GameOver
    winInfo: null,

  }),
  mutations: {
    JoinSuccess(state, { players, room_id }) {
      state.roomInfo.room_id = room_id;
      players.forEach((player) => {
        state.roomInfo.players[player.id] = player;
      });
      state.roomInfo.players[state.curPlayer.id] = state.curPlayer;
      state.gameStatus = "Waiting";
    },
    PlayerJoin(state, { player }) {
      state.roomInfo.players[player.id] = player;
    },
    PlayerLeft(state, { player_id }) {
      delete state.roomInfo.players[player_id];
    },
    PlayerStatusSet(state, { player_id, is_ready }) {
      if (state.roomInfo.players[player_id]) {
        state.roomInfo.players[player_id].is_ready = is_ready;
      }
      if (player_id === state.curPlayer.id) {
        state.curPlayer.is_ready = is_ready;
      }
    },
    GameStart(state, { config }) {
      state.gameConfig = config;
      state.gameBoard = Array.from({ length: config.rows }, () =>
        Array.from({ length: config.cols }, () => ({ status: "Closed", a_mines: 0 }))
      );
      state.gameStatus = "Gameing";
      state.flagCount = 0;
      state.gameEndFalg = 'None';
    },
    GameOpRes(state, { player_id, op_res }) {
      console.log(`${player_id} 操作`);
      if (op_res.OpSuccess) {
        let cells = op_res.OpSuccess.cells;
        cells.forEach(({ x, y, status }) => {
          const cell = state.gameBoard[x][y];
          if (status.Opened) {
            cell.a_mines = status.Opened.a_mines;
            cell.status = "Opened";
          } else if (status === "Closed") {
            cell.status = status;
            state.flagCount -= 1;
          }
          else if (status === "Flagged") {
            cell.status = status;
            state.flagCount += 1;
          }
        });
      } else if (op_res.GameOver) {
        let { mines, mine } = op_res.GameOver;
        state.gameEndFalg = "GameOver";
        mines.forEach(({ x, y }) => {
          const cell = state.gameBoard[x][y];
          if (cell.status === "Flagged") {
            cell.status = "Cor-Flagged";
          } else {
            cell.status = "Boom";
          }
        });
        state.gameBoard[mine.x][mine.y].status = "Origin-Boom";
      } else if (op_res.GameWin) {
        let mines = op_res.GameWin.win_info.mines;
        let cells = op_res.GameWin.win_info.cells;
        state.gameEndFalg = "GameWin";
        state.winInfo = op_res.GameWin.win_info;
        // 显示所有需要打开的
        cells.forEach(({ x, y, status }) => {
          const cell = state.gameBoard[x][y];
          if (status.Opened) {
            cell.a_mines = status.Opened.a_mines;
            cell.status = "Opened";
          } else if (status === "Closed" || status === "Flagged") {
            cell.status = status;
          }
        });
        // 显示所有需要标记的
        mines.forEach(({ x, y }) => {
          const cell = state.gameBoard[x][y];
          cell.status = "Flagged";
        });
        // 排行页面：duration，steps，队伍；展开显示：id2steps, id2flags, id2opens
      }
      if (op_res.GameOver || op_res.GameWin) {
        for (const key in state.roomInfo.players) {
          state.roomInfo.players[key].is_ready = false;
        }
        state.curPlayer.is_ready = false;
        state.gameStatus = "Waiting";
      }
    },
  },

  actions: {
    JoinSuccess({ commit }, message) {
      commit("JoinSuccess", { players: message.players, room_id: message.room_id });
    },
    PlayerJoin({ commit }, message) {
      commit("PlayerJoin", { player: message.player });
    },
    PlayerLeft({ commit }, message) {
      commit("PlayerLeft", { player_id: message.player_id });
    },
    PlayerStatusSet({ commit }, message) {
      commit("PlayerStatusSet", { player_id: message.player_id, is_ready: message.is_ready });
    },
    GameStart({ commit }, message) {
      commit("GameStart", { config: message.config });
    },
    GameOpRes({ commit }, message) {
      commit("GameOpRes", { player_id: message.player_id, op_res: message.op_res });
    },
    InvalidRequest(message) {
      console.error("InvalidRequest:", message.error);
    },
  },
};

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
        roomInfo: { players: {}, room_id: "" },
        curPlayer: getCurPlayer(),
        gameConfig: null,
        gameBoard: [],
        gameStatus: "None", // Waiting, Gameing, GameOver, GameWin
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
                    } else if (status === "Closed" || status === "Flagged") {
                        cell.status = status;
                    }
                });
            } else if (op_res.GameOver) {
                let { all_mines, err_mine } = op_res.GameOver;
                console.log("GameOver", all_mines, err_mine);
                state.gameStatus = "GameOver";
                alert("handleGameOver");
            } else if (op_res.GameWin) {
                let { win_info } = op_res.GameWin;
                console.log("GameWin", win_info);
                state.gameStatus = "GameWin";
                alert("handleGameWon");
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

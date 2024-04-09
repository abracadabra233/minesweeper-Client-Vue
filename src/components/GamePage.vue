<template>
  <div class="container-fluid p-3">
    <div class="row">
      <div class="col-12 col-lg-9">
        <!-- 将状态显示区域提到 game-board 外部，并使用 d-flex 和 justify-content-between 来布局 -->
        <div class="d-flex justify-content-between mb-2 game-status-bar">
          <div class="badge bg-primary">
            🚩 {{ flagCount }}
          </div>
          <div class="badge bg-success">
            ⏱ {{ timePassed }}
          </div>
        </div>
        <div class="game-board d-flex flex-wrap" style="gap: 2px;">
          <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex" class="d-flex flex-nowrap">
            <div v-for="(cell, colIndex) in row" :key="colIndex"
              class="cell d-flex justify-content-center align-items-center"
              :class="gameStatus === 'GameOver' && cell.status === 'Flagged' ? 'err-flagged' : cell.status.toLowerCase()"
              :data-mine="cell.status === 'Opened' ? cell.a_mines : ''"
              v-longpress="() => gameStatus === 'Gameing' ? handleCellClick(rowIndex, colIndex, true) : () => { }"
              @click="gameStatus === 'Gameing' ? handleCellClick(rowIndex, colIndex, false) : () => { }"
              @contextmenu.prevent="gameStatus === 'Gameing' ? handleCellClick(rowIndex, colIndex, true) : () => { }">
              <template v-if="cell.status === 'Opened'">
                {{ cell.a_mines > 0 ? cell.a_mines : '' }}
              </template>
              <template
                v-else-if="cell.status === 'Flagged' || cell.status === 'Err-Flagged' || cell.status === 'Cor-Flagged'">
                🚩
              </template>
              <template v-else-if="cell.status === 'Boom' || cell.status === 'Origin-Boom'">
                💣
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-3">
        <button class="btn btn-primary mt-3 d-lg-none" type="button" data-bs-toggle="collapse"
          data-bs-target="#gameControls" aria-expanded="false" aria-controls="gameControls">
          控制面板
        </button>
        <div class="collapse d-lg-block" id="gameControls">
          <div class="card card-body">
            <button class="btn btn-info" @click="changeDifficulty">改变难度</button>
            <button class="btn btn-success" @click="restartGame">再来一局</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <RankingModal ref="rankingModal" />
</template>

<script>
import '@/styles/cell1.css';
import { mapState } from "vuex";
import RankingModal from "@/components/modals/RankingModal.vue";
import longpressDirective from '@/directives/LongPressDirective.js';
export default {
  components: { RankingModal },
  directives: { 'longpress': longpressDirective },
  computed: { ...mapState("websocket", ["roomInfo", "winInfo", "gameStatus", "gameBoard"]) },
  watch: {
    gameStatus(newVal) {
      // TODO: 游戏结束，整理游戏结束逻辑，增加再来一局逻辑
      if (newVal == "GameWin") {
        let winInfos = [];
        winInfos.push(this.winInfo);
        this.$refs.rankingModal.openModal(winInfos);
      } else if (newVal == "GameOver") {
        console.log("GameOver");
      }
    },
  },
  data() { return { touchTimeout: null, } },
  methods: {
    changeDifficulty() {
      let winInfos = [];
      const winInfo = { id2steps: {}, id2flags: {}, id2opens: {}, duration: 60, steps: 230 };
      Object.entries(this.roomInfo.players).forEach(([, player]) => {
        winInfo.id2steps[player.id] = 10;
        winInfo.id2flags[player.id] = 3;
        winInfo.id2opens[player.id] = 80;
      });
      winInfos.push(winInfo);
      this.$refs.rankingModal.openModal(winInfos);
    },

    restartGame() {
      this.$refs.rankingModal.openModal();
    },

    getAdjacentCloseCount(rowIndex, colIndex) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      let closeCount = 0;

      directions.forEach(([dx, dy]) => {
        const newX = rowIndex + dx;
        const newY = colIndex + dy;
        if (newX >= 0 && newX < this.gameBoard.length &&
          newY >= 0 && newY < this.gameBoard[0].length &&
          this.gameBoard[newX][newY].status === 'Closed') {
          closeCount++;
        }
      });
      return closeCount;
    },

    getAdjacentFlagsCount(rowIndex, colIndex) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      let flagsCount = 0;

      directions.forEach(([dx, dy]) => {
        const newX = rowIndex + dx;
        const newY = colIndex + dy;
        if (newX >= 0 && newX < this.gameBoard.length &&
          newY >= 0 && newY < this.gameBoard[0].length &&
          this.gameBoard[newX][newY].status === 'Flagged') {
          flagsCount++;
        }
      });
      return flagsCount;
    },

    canCellBeClicked(rowIndex, colIndex, f) {
      const status = this.gameBoard[rowIndex][colIndex].status;
      if (status === 'Opened') {
        const a_mines = this.gameBoard[rowIndex][colIndex].a_mines;
        const a_flags = this.getAdjacentFlagsCount(rowIndex, colIndex);
        const a_close = this.getAdjacentCloseCount(rowIndex, colIndex);
        return !(a_mines === 0 ||
          a_mines !== 0 && (a_flags !== a_mines || (a_flags === a_mines && a_close === 0)))
      } else if (status === 'Closed') {
        return true
      } else if (status === 'Flagged') {
        return !f
      }
      return true;
    },

    handleCellClick(rowIndex, colIndex, flag) {
      // e.preventDefault();
      // if (!flag) {
      //   flag = e.type === "contextmenu" || e.button === 2;
      // }
      // const
      if (this.canCellBeClicked(rowIndex, colIndex, flag)) {
        const message = {
          type: "PlayerOperation",
          action: { x: rowIndex, y: colIndex, f: flag },
        };
        this.$store.dispatch("sendMessage", message);
        if ('vibrate' in navigator && flag) {
          navigator.vibrate([100]);
        }
      } else {
        console.log("cannotCellBeClicked", rowIndex, colIndex);
      }
    },
  },
};
</script>

<style scoped>
.game-board {
  max-height: 80vh;
  overflow: auto;
  position: relative;
}

.game-status-bar {
  position: relative;
  /* 允许绝对定位的子元素相对于此定位 */
  width: 100%;
  /* 使状态栏宽度与 game-board 一致 */
}


/* 响应式隐藏和显示控制面板按钮 */
@media (max-width: 991.98px) {
  .control-panel-arrow {
    display: none;
    /* 默认隐藏 */
  }
}

/* 控制面板显示时的箭头样式 */
.control-panel-arrow.show {
  display: block;
  position: fixed;
  right: 0;
  bottom: 50%;
  /* 调整到合适的位置 */
  z-index: 1030;
  /* 确保箭头在游戏板之上 */
}

/* 旗子和计时器样式 */
.badge {
  font-size: 1.2rem;
  padding: 0.5em 1em;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.game-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 80vw;
  height: 80vh;
  overflow: auto;
}

.board-row {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>

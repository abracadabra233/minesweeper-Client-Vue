<template>
  <div class="game-board">
    <div v-if="validGameBoard">
      <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex" class="board-row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell" :class="cellClass(cell)"
          :style="cellStyle(cell)" @click="($event) => handleCellClick($event, rowIndex, colIndex)"
          @touchstart="(event) => handleTouchStart(event, row, col)" @touchend="handleTouchEnd"
          @touchmove="handleTouchMove" @contextmenu.prevent="($event) => handleCellClick($event, rowIndex, colIndex)
      ">
          <template v-if="cell.status === 'Opened'">
            {{ cell.a_mines > 0 ? cell.a_mines : "" }}
          </template>
          <template v-else-if="cell.status === 'Flagged'"> 🚩 </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["ws", "roomInfo", "gameBoard", "gameConfig"]),
    validGameBoard() {
      return this.gameBoard && this.gameBoard.length > 0 && this.gameBoard.every(row => row.length > 0);
    },
  },
  data() {
    return {
      pressTimer: null,
      touchStartX: 0,
      touchStartY: 0,
      mineColors: [
        "", // index 0, 不使用
        "blue", // 1个雷
        "green", // 2个雷
        "red", // 3个雷
      ],
    };
  },
  methods: {
    cellClass(cell) {
      let classes = [];
      if (cell.status === "Opened") {
        classes.push("opened");
        if (cell.a_mines > 0) {
          classes.push(`mines-${cell.a_mines}`); // 动态添加基于a_mines值的类
        }
      } else if (cell.status === "Flagged") {
        classes.push("Flagged");
      }
      return classes;
    },
    cellStyle(cell) {
      if (cell.status === "Opened" && cell.a_mines > 0) {
        const color = this.mineColors[cell.a_mines];
        return { color };
      }
      return {};
    },
    handleCellClick(e, x, y) {
      e.preventDefault();
      let flag = false;
      if (e.type === "contextmenu" || e.button === 2) {
        flag = true;
      }
      console.log("send GAction", x, y, flag);
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            type: "GAction",
            action: { x, y, f: flag },
          })
        );
      }
    },
    handleTouchStart(event, x, y) {
      if (event.touches.length === 1) {
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
        this.pressTimer = setTimeout(
          () => this.handleCellAction(x, y, true),
          800
        ); // Trigger flag action on long press
      }
    },
    handleTouchEnd() {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    },
    handleTouchMove(event) {
      // Cancel the long press action if the finger moves
      if (
        Math.abs(event.touches[0].clientX - this.touchStartX) > 10 ||
        Math.abs(event.touches[0].clientY - this.touchStartY) > 10
      ) {
        clearTimeout(this.pressTimer);
        this.pressTimer = null;
      }
    },
  },
};
</script>

<style>
.game-board {
  display: flex;
  flex-direction: column;
}

.board-row {
  display: flex;
}

.cell {
  width: 30px;
  /* Adjust based on your design */
  height: 30px;
  /* Adjust based on your design */
  border: 1px solid #666;
  box-sizing: border-box;
}
</style>

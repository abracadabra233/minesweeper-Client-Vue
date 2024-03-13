<template>
  <div class="container">
    <div class="game-board">
      <div v-for="(row, rowIndex) in  gameBoard " :key="rowIndex" class="board-row">
        <div v-for="(cell, colIndex) in  row " :key="colIndex" class="cell"
          :class="{ closed: cell.status === 'Closed', flagged: cell.status === 'Flagged', opened: cell.status === 'Opened' }"
          :data-mine="cell.status === 'Opened' ? cell.a_mines : ''"
          @click="($event) => handleCellClick($event, rowIndex, colIndex)"
          @touchstart="(event) => handleTouchStart(event, row, colIndex)" @touchend="handleTouchEnd">
          <template v-if="cell.status === 'Opened'">
            {{ cell.a_mines > 0 ? cell.a_mines : "" }}
          </template>
          <template v-else-if="cell.status === 'Flagged'">
            🚩
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- @touchmove="handleTouchMove" @contextmenu.prevent="($event) => handleCellClick($event, rowIndex, colIndex)" -->
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["ws", "roomInfo", "gameBoard", "gameConfig"]),
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

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* 视窗高度 */
  width: 100vw;
  /* 视窗宽度 */
  overflow: hidden;
  /* 防止溢出 */
}

.game-board {
  display: grid;
  max-width: 80vw;
  /* 最大宽度为视窗宽度的 80% */
  max-height: 80vh;
  /* 最大高度为视窗高度的 80% */
  width: auto;
  /* 宽度自适应内容 */
  height: auto;
  /* 高度自适应内容 */
  margin: auto;
  /* 居中 game-board */
  overflow: auto;
  /* 超出内容时显示滚动条 */
  grid-template-columns: 1fr;
  /* grid-template-columns: repeat(auto-fit, minmax(30px, 1fr)); */
  /* 动态定义列数，使其填满可用空间，且每个 cell 最小宽度为 30px */
  gap: 2px;
  /* 单元格之间的间隙 */
}

.board-row {
  display: flex;
  /* 使用flex布局使得.row内的元素可以水平排列 */
  width: 100%;
  /* 确保.row占满父容器的宽度 */
}


.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: inset 0 0 5px #ddd;
  transition: all 0.3s ease;
  user-select: none;
  min-width: 30px;
  /* 单元格最小宽度为 30px */
  min-height: 30px;
  /* 单元格最小高度为 30px */
}

/* 省略了 .cell 伪元素和其他样式 */

.cell::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 在这个伪元素上应用你所有的内容和样式 */
}

.cell::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Your styles for the content go here */
}

/* 鼠标悬停时的效果 */
.cell:hover {
  box-shadow: inset 0 0 7px #bbb;
}

/* 默认状态（Closed） */
.cell.closed {
  background: linear-gradient(to bottom right, #f9f9f9, #e0e0e0);
  /* 线性渐变背景 */
}

/* 插旗状态（Flagged） */
.cell.flagged {
  background: linear-gradient(to bottom right, #f9f9f9, #e0e0e0);
  /* 线性渐变背景 */
  content: "🚩";
  font-size: 18px;
  /* 调整旗子大小 */
}

/* 打开状态（Opened）- 显示数字并根据数字变化背景色 */
.cell.opened {
  justify-content: center;
  align-items: center;
  color: #333;
  font-weight: bold;
}

/* 根据不同的数字显示不同的背景色 */
.cell[data-mine="1"] {
  background-color: #e0f8e0;
}

.cell[data-mine="2"] {
  background-color: #d0f0c0;
}

.cell[data-mine="3"] {
  background-color: #c0e8a0;
}

.cell[data-mine="4"] {
  background-color: #b0e090;
}

.cell[data-mine="5"] {
  background-color: #a0d880;
}

.cell[data-mine="6"] {
  background-color: #90d070;
}

.cell[data-mine="7"] {
  background-color: #80c860;
}

.cell[data-mine="8"] {
  background-color: #70c050;
}
</style>

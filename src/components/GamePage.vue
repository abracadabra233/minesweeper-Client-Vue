<template>
  <div class="container">
    <div class="game-board">
      <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex" class="board-row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
          :class="{ 'closed': cell.status === 'Closed', 'flagged': cell.status === 'Flagged', 'opened': cell.status === 'Opened' }"
          :data-mine="cell.status === 'Opened' ? cell.a_mines : ''"
          v-on="cell.status !== 'Opened' || cell.a_mines !== 0 ? { click: ($event) => handleCellClick($event, rowIndex, colIndex), contextmenu: ($event) => handleCellClick($event, rowIndex, colIndex) } : {}">
          <template v-if="cell.status === 'Opened'">
            {{ cell.a_mines > 0 ? cell.a_mines : '' }}
          </template>
          <template v-else-if="cell.status === 'Flagged'">
            🚩
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- @click="($event) => handleCellClick($event, rowIndex, colIndex)"
          @contextmenu.prevent="($event) => handleCellClick($event, rowIndex, colIndex)" -->
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["ws", "roomInfo", "gameBoard", "gameConfig"]),
  },
  methods: {
    handleCellClick(e, rowIndex, colIndex) {
      e.preventDefault();
      const flag = e.type === "contextmenu" || e.button === 2;
      console.log("send GAction", rowIndex, colIndex, flag);
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: "GAction",
          action: { x: rowIndex, y: colIndex, f: flag },
        }));
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

.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: inset 0 0 5px #e6cdcd;
  transition: all 0.3s ease;
  user-select: none;
  width: 30px;
  /* 定宽保持布局整齐 */
  height: 30px;
  /* 定高保持布局整齐 */
  margin: 1px;
  /* 略微分隔单元格 */
}


/* 鼠标悬停时的效果 */
.cell:hover:not(data-mine="0") {
  box-shadow: inset 0 0 7px #f7eeee;
}

/* 默认状态（Closed） */
.cell.closed {
  background: linear-gradient(to bottom right, #f7f1f1, #f7eeeefe);
  /* 线性渐变背景 */
}

/* 插旗状态（Flagged） */
.cell.flagged {
  background: linear-gradient(to bottom right, #f7f1f1, #f8eeee);
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

.cell[data-mine="0"] {
  background-color: #ffffff;
  cursor: default;
}

.cell[data-mine="1"] {
  background-color: #7ff19b;
}

/* 浅绿色 */
.cell[data-mine="2"] {
  background-color: #57dacf;
}

/* 深绿色 */
.cell[data-mine="3"] {
  background-color: #e5cc8d;
}

/* 浅黄色 */
.cell[data-mine="4"] {
  background-color: #f4a261;
}

/* 橙色 */
.cell[data-mine="5"] {
  background-color: #e76f51;
}

/* 粉红色 */
.cell[data-mine="6"] {
  background-color: #9b5de5;
}

/* 紫色 */
.cell[data-mine="7"] {
  background-color: #f15bb5;
}

/* 红色 */
.cell[data-mine="8"] {
  background-color: #d00000;
}

/* 深红色 */
</style>

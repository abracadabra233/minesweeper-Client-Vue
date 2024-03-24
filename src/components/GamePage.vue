<template>
  <div class="container-fluid p-3">
    <div class="row">
      <div class="col-12 col-lg-9">
        <div class="d-flex justify-content-between mb-2">
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
              :class="{ 'bg-secondary': cell.status === 'Closed', 'bg-warning': cell.status === 'Flagged', 'bg-light': cell.status === 'Opened' }"
              :data-mine="cell.status === 'Opened' ? cell.a_mines : ''"
              @click="handleCellClick($event, rowIndex, colIndex)"
              @contextmenu.prevent="handleCellClick($event, rowIndex, colIndex)">
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
</template>



<script>
import { mapState } from "vuex";

export default {
  computed: { ...mapState("websocket", ["roomInfo", "gameBoard"]) },
  methods: {
    handleCellClick(e, rowIndex, colIndex) {
      e.preventDefault();
      const flag = e.type === "contextmenu" || e.button === 2;
      const message = {
        type: "PlayerOperation",
        action: { x: rowIndex, y: colIndex, f: flag },
      };
      this.$store.dispatch("sendMessage", message);
    },
  },
};
</script>

<style scoped>
.game-board {
  max-height: 80vh;
  overflow: auto;
}

.cell {
  width: 40px;
  /* 根据你的需求调整 */
  height: 40px;
  /* 保持宽高一致 */
  cursor: pointer;
  user-select: none;
  position: relative;
  /* 内部内容的绝对定位 */
}

.cell-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
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

/* 以下是示例样式，你可以根据需要调整 */
/* 添加自定义颜色和背景 */
.bg-secondary {
  background-color: #6c757d !important;
  /* 关闭的cell */
}

.bg-warning {
  background-color: #ffc107 !important;
  /* 标记旗帜的cell */
}

.bg-light {
  background-color: #f8f9fa !important;
  /* 打开的cell */
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

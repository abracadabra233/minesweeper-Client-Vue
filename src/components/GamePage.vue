<template>
  <div class="game-page-layout">
    <main class="main-area">
      <div class="game-status-bar">
        <div class="badge bg-primary fs-6">
          🚩 {{ flagCount }} / {{ gameConfig?.mines || 0 }}
        </div>
        <GameClock ref="gameClockRef" />
      </div>
      <div class="game-board-container">
        <div class="game-board" :style="{
          gridTemplateRows: `repeat(${gameConfig?.rows || 8}, 1fr)`,
          gridTemplateColumns: `repeat(${gameConfig?.cols || 8}, 1fr)`
        }">
          <template v-for="(row, rowIndex) in gameBoard" :key="rowIndex">
            <template v-for="(cell, colIndex) in row" :key="colIndex">
              <div class="cell" :class="getCellClass(cell)" :data-mine="cell.status === 'Opened' ? cell.a_mines : ''"
                @click="handleCellClick(rowIndex, colIndex, false)"
                @contextmenu.prevent="handleCellClick(rowIndex, colIndex, true)"
                v-longpress="() => handleCellClick(rowIndex, colIndex, true)">
                <template v-if="cell.status === 'Opened'">
                  <span :class="`mine-num mine-num-${cell.a_mines}`">
                    {{ cell.a_mines > 0 ? cell.a_mines : '' }}
                  </span>
                </template>
                <template
                  v-else-if="cell.status === 'Flagged' || cell.status === 'Err-Flagged' || cell.status === 'Cor-Flagged'">
                  🚩
                </template>
                <template v-else-if="cell.status === 'Boom' || cell.status === 'Origin-Boom'">
                  💣
                </template>
              </div>
            </template>
          </template>
        </div>
      </div>
    </main>
    <!-- 悬浮菜单按钮 -->
    <div class="menu-fab" :class="{ active: showMenu }" @mouseenter="desktopMenuHover(true)"
      @mouseleave="desktopMenuHover(false)" @click="toggleMenu">
      <i class="bi bi-list"></i>
    </div>
    <!-- 悬浮菜单内容 -->
    <transition name="slide-menu">
      <aside v-if="showMenu" class="side-panel-float" @mouseleave="desktopMenuHover(false)" @touchstart.stop>
        <div class="card menu-card">
          <div class="card-body">
            <h5 class="card-title mb-4 text-center">游戏控制</h5>
            <div class="d-grid gap-3 mb-4">
              <button class="btn btn-outline-primary btn-lg" @click="changeDifficulty">改变难度</button>
              <button class="btn btn-outline-warning btn-lg" @click="showRanking">排行榜</button>
              <button class="btn btn-success btn-lg" @click="restartGame">再来一局</button>
            </div>
            <div class="game-info">
              <div><strong>棋盘：</strong>{{ gameConfig?.rows }} × {{ gameConfig?.cols }}</div>
              <div><strong>地雷：</strong>{{ gameConfig?.mines }}</div>
              <div><strong>玩家：</strong>{{ gameConfig?.n_player }}</div>
            </div>
          </div>
        </div>
      </aside>
    </transition>
    <RankingModal ref="rankingModal" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import GameClock from '@/components/common/GameClock.vue'
import RankingModal from '@/components/modals/RankingModal.vue'
import longpressDirective from '@/directives/LongPressDirective.js'
import '@/styles/cell1.css'

const router = useRouter()
const gameStore = useGameStore()
const gameClockRef = ref(null)
const rankingModal = ref(null)

const gameBoard = computed(() => gameStore.gameBoard)
const gameConfig = computed(() => gameStore.gameConfig)
const flagCount = computed(() => gameStore.flagCount)
const gameStatus = computed(() => gameStore.gameStatus)
const gameEndFlag = computed(() => gameStore.gameEndFlag)
const winInfo = computed(() => gameStore.winInfo)
const isGameActive = computed(() => gameStore.isGameActive)

// 菜单交互
const showMenu = ref(false)
let menuHoverTimer = null
const toggleMenu = () => {
  if (isMobile()) {
    showMenu.value = !showMenu.value
  }
}
const desktopMenuHover = (enter) => {
  if (isMobile()) return
  clearTimeout(menuHoverTimer)
  if (enter) {
    showMenu.value = true
  } else {
    menuHoverTimer = setTimeout(() => { showMenu.value = false }, 300)
  }
}
function isMobile() {
  return window.innerWidth <= 600
}

watch(gameEndFlag, (newFlag) => {
  if (newFlag === 'GameWin') {
    gameClockRef.value?.stop()
    rankingModal.value?.openModal([winInfo.value])
  } else if (newFlag === 'GameOver') {
    gameClockRef.value?.stop()
  }
})

watch(gameStatus, (newStatus) => {
  if (newStatus === 'Gaming') {
    gameClockRef.value?.start()
  }
})

const getCellClass = (cell) => {
  const baseClass = cell.status.toLowerCase()
  if (gameEndFlag.value === 'GameOver' && cell.status === 'Flagged') {
    return 'err-flagged'
  }
  return baseClass
}

const changeDifficulty = () => { }
const showRanking = () => {
  if (winInfo.value) rankingModal.value?.openModal([winInfo.value])
}
const restartGame = () => {
  if (gameConfig.value?.n_player !== 1 && gameStatus.value === 'Waiting') {
    router.push({ name: 'wait' })
  }
  gameStore.sendMessage({ type: 'GameAgain' })
}
const getAdjacentCloseCount = (rowIndex, colIndex) => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ]
  let closeCount = 0
  directions.forEach(([dx, dy]) => {
    const newX = rowIndex + dx
    const newY = colIndex + dy
    if (newX >= 0 && newX < gameBoard.value.length &&
      newY >= 0 && newY < gameBoard.value[0].length &&
      gameBoard.value[newX][newY].status === 'Closed') {
      closeCount++
    }
  })
  return closeCount
}
const getAdjacentFlagsCount = (rowIndex, colIndex) => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ]
  let flagsCount = 0
  directions.forEach(([dx, dy]) => {
    const newX = rowIndex + dx
    const newY = colIndex + dy
    if (newX >= 0 && newX < gameBoard.value.length &&
      newY >= 0 && newY < gameBoard.value[0].length &&
      gameBoard.value[newX][newY].status === 'Flagged') {
      flagsCount++
    }
  })
  return flagsCount
}
const canCellBeClicked = (rowIndex, colIndex, flag) => {
  const status = gameBoard.value[rowIndex][colIndex].status
  if (status === 'Opened') {
    const a_mines = gameBoard.value[rowIndex][colIndex].a_mines
    const a_flags = getAdjacentFlagsCount(rowIndex, colIndex)
    const a_close = getAdjacentCloseCount(rowIndex, colIndex)
    return !(a_mines === 0 ||
      a_mines !== 0 && (a_flags !== a_mines || (a_flags === a_mines && a_close === 0)))
  } else if (status === 'Closed') {
    return true
  } else if (status === 'Flagged') {
    return !flag
  }
  return true
}
const handleCellClick = (rowIndex, colIndex, flag) => {
  if (!isGameActive.value) return
  if (canCellBeClicked(rowIndex, colIndex, flag)) {
    gameStore.sendMessage({
      type: 'PlayerOperation',
      action: { x: rowIndex, y: colIndex, f: flag },
    })
    if ('vibrate' in navigator && flag) {
      navigator.vibrate([100])
    }
  }
}
onMounted(() => {
  gameClockRef.value?.start()
})
</script>

<style scoped>
.game-page-layout {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 2.5rem;
  min-height: 90vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-area {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-status-bar {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.10);
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.game-board-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
}

.game-board {
  display: grid;
  gap: 4px;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;
  padding: 1rem;
  min-width: 240px;
  min-height: 240px;
  max-width: 480px;
  max-height: 480px;
}

.cell {
  aspect-ratio: 1 / 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  font-weight: bold;
  border-radius: 0.5em;
  background: linear-gradient(135deg, #e3eafc 0%, #cfd8dc 100%);
  border: 1.5px solid #b0bec5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: background 0.2s, box-shadow 0.2s, border 0.2s;
  cursor: pointer;
  user-select: none;
}

.cell.closed {
  background: linear-gradient(135deg, #b0bec5 0%, #90a4ae 100%);
  border: 1.5px solid #90a4ae;
}

.cell:hover {
  background: linear-gradient(135deg, #f5faff 0%, #b3c6e0 100%);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.10);
  z-index: 2;
}

.cell.opened {
  background: #f8fafc;
  border: 1.5px solid #e0e0e0;
}

.cell.flagged {
  background: linear-gradient(135deg, #fffde7 0%, #ffe082 100%);
  border: 1.5px solid #ffd54f;
  color: #d32f2f;
  font-size: 1.3em;
}

.cell.err-flagged {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border: 1.5px solid #ef5350;
  color: #d32f2f;
  animation: shake 0.5s ease-in-out;
}

.cell.boom {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border: 1.5px solid #ef5350;
  color: #d32f2f;
  animation: explode 0.3s ease-out;
}

.cell.origin-boom {
  background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
  border: 1.5px solid #d32f2f;
  color: white;
  animation: explode 0.5s ease-out;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-2px);
  }

  75% {
    transform: translateX(2px);
  }
}

@keyframes explode {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.mine-num-1 {
  color: #1976d2;
}

.mine-num-2 {
  color: #388e3c;
}

.mine-num-3 {
  color: #d32f2f;
}

.mine-num-4 {
  color: #512da8;
}

.mine-num-5 {
  color: #795548;
}

.mine-num-6 {
  color: #008b8b;
}

.mine-num-7 {
  color: #000;
}

.mine-num-8 {
  color: #757575;
}

.menu-fab {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1001;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  border: none;
}

.menu-fab.active,
.menu-fab:hover {
  background: #fff;
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.18);
}

.side-panel-float {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 320px;
  max-width: 90vw;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  z-index: 1000;
  transition: transform 0.3s;
}

.slide-menu-enter-active,
.slide-menu-leave-active {
  transition: opacity 0.2s, transform 0.3s;
}

.slide-menu-enter-from,
.slide-menu-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 600px) {

  .menu-fab,
  .side-panel-float {
    right: 1rem;
    top: auto;
    bottom: 1.5rem;
  }

  .side-panel-float {
    width: 98vw;
    left: 1vw;
    right: 1vw;
    top: auto;
    bottom: 4.5rem;
  }

  .game-board {
    min-width: 120px;
    min-height: 120px;
    max-width: 98vw;
    max-height: 60vw;
  }

  .game-status-bar,
  .game-board-container {
    max-width: 100vw;
    padding: 0.5rem;
  }
}
</style>

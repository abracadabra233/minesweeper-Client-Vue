<template>
  <div class="waiting-room">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg">
            <div class="card-header text-center">
              <h2 class="card-title mb-0">
                <span class="text-primary">🏠</span>
                房间:
                <span class="badge bg-secondary fs-6">{{ roomInfo.room_id }}</span>
                <span class="text-muted ms-2">
                  <div class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">等待中...</span>
                  </div>
                  等待中
                </span>
              </h2>
            </div>

            <div class="card-body">
              <div class="players-list">
                <div v-for="([id, player]) in Object.entries(roomInfo.players)" :key="id"
                  class="player-item d-flex justify-content-between align-items-center p-3 mb-2 rounded"
                  :class="getPlayerItemClass(player)">
                  <div class="d-flex align-items-center flex-grow-1">
                    <img :src="svgStringToBlobUrl(player.icon)" :alt="`${player.name} avatar`"
                      class="player-avatar rounded-circle me-3">
                    <div class="player-info">
                      <span class="player-name fw-bold">
                        {{ player.name }}
                        <span v-if="id === curPlayer.id" class="badge bg-primary ms-2">(你)</span>
                      </span>
                      <div class="player-status small text-muted">
                        {{ player.is_ready ? '已准备' : '未准备' }}
                      </div>
                    </div>
                  </div>

                  <div class="player-actions d-flex align-items-center">
                    <span v-if="id === curPlayer.id">
                      <button @click="toggleReady" class="btn btn-sm"
                        :class="player.is_ready ? 'btn-danger' : 'btn-success'" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
                        {{ player.is_ready ? '取消准备' : '准备' }}
                      </button>
                    </span>

                    <span class="badge rounded-pill ms-2" :class="player.is_ready ? 'bg-success' : 'bg-secondary'">
                      {{ player.is_ready ? '准备' : '未准备' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 房间信息 -->
              <div class="room-info mt-4 p-3 bg-light rounded">
                <h6 class="text-muted mb-2">房间信息</h6>
                <div class="row">
                  <div class="col-6">
                    <small class="text-muted">房间ID:</small>
                    <div class="fw-bold">{{ roomInfo.room_id }}</div>
                  </div>
                  <div class="col-6">
                    <small class="text-muted">玩家数量:</small>
                    <div class="fw-bold">{{ Object.keys(roomInfo.players).length }}</div>
                  </div>
                </div>
              </div>

              <!-- 错误信息 -->
              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

// 组合式API
const router = useRouter()
const gameStore = useGameStore()

// 响应式数据
const isLoading = ref(false)
const errorMessage = ref('')

// 计算属性
const roomInfo = computed(() => gameStore.roomInfo)
const curPlayer = computed(() => gameStore.curPlayer)
const gameStatus = computed(() => gameStore.gameStatus)

// 监听器
watch(gameStatus, (newStatus) => {
  if (newStatus === 'Gaming') {
    router.push({ name: 'game' })
  }
})

// 方法
const svgStringToBlobUrl = (svgString) => {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  return URL.createObjectURL(blob)
}

const getPlayerItemClass = (player) => {
  if (player.is_ready) {
    return 'bg-success bg-opacity-10 border border-success'
  }
  return 'bg-light border'
}

const toggleReady = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const message = {
      type: 'PlayerStatusSet',
      player_id: curPlayer.value.id,
      is_ready: !curPlayer.value.is_ready,
    }

    await gameStore.sendMessage(message)
  } catch (error) {
    errorMessage.value = '状态更新失败，请重试'
    console.error('Toggle ready error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.waiting-room {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.card {
  border: none;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.card-header {
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem 1rem 0 0 !important;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.player-item {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.player-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.player-avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.player-name {
  color: #2c3e50;
  font-size: 1.1rem;
}

.player-status {
  font-size: 0.9rem;
}

.btn {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.badge {
  font-weight: 600;
}

.room-info {
  background: rgba(248, 249, 250, 0.8) !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.alert {
  border-radius: 0.5rem;
  border: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .waiting-room {
    padding: 1rem 0;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .player-avatar {
    width: 40px;
    height: 40px;
  }

  .player-name {
    font-size: 1rem;
  }

  .player-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .player-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>

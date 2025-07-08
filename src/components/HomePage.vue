<template>
  <div class="home-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg">
            <div class="card-body text-center">
              <h1 class="card-title mb-4">
                <span class="text-primary">💣</span>
                扫雷游戏
                <span class="text-primary">💣</span>
              </h1>
              <p class="card-text text-muted mb-4">
                经典扫雷游戏，支持多人对战
              </p>

              <div class="d-grid gap-3">
                <button @click="createRoom" class="btn btn-primary btn-lg" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? '创建中...' : '创建房间' }}
                </button>

                <button @click="joinRoom" class="btn btn-outline-secondary btn-lg" :disabled="isLoading">
                  加入房间
                </button>
              </div>

              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <RoomConfigModal ref="roomConfigModal" @select="handleRoomCreation" @error="handleError" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import RoomConfigModal from '@/components/modals/RoomConfigModal.vue'

// 组合式API
const router = useRouter()
const gameStore = useGameStore()
const roomConfigModal = ref(null)

// 响应式数据
const isLoading = ref(false)
const errorMessage = ref('')

// 计算属性
const isConnected = computed(() => gameStore.isConnected)
const gameStatus = computed(() => gameStore.gameStatus)

// 监听器
watch(gameStatus, (newStatus) => {
  if (newStatus === 'Waiting') {
    router.push({ name: 'wait' })
  }
})

// 方法
const createRoom = () => {
  if (roomConfigModal.value) {
    roomConfigModal.value.openModal()
  }
}

const joinRoom = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const roomId = prompt('请输入房间ID', '66666')
    if (!roomId) return

    const message = {
      type: 'RoomJoin',
      room_id: roomId,
      player: gameStore.curPlayer,
    }

    await gameStore.sendMessage(message)
  } catch (error) {
    errorMessage.value = '加入房间失败，请重试'
    console.error('Join room error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRoomCreation = async (config) => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const message = {
      type: 'RoomCreate',
      player: gameStore.curPlayer,
      config: config,
    }

    await gameStore.sendMessage(message)
  } catch (error) {
    errorMessage.value = '创建房间失败，请重试'
    console.error('Create room error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleError = (error) => {
  errorMessage.value = error
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.card {
  border: none;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.card-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.btn {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  transform: none;
  box-shadow: none;
}

.alert {
  border-radius: 0.5rem;
  border: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-page {
    padding: 1rem 0;
  }

  .card-title {
    font-size: 1.5rem;
  }
}
</style>

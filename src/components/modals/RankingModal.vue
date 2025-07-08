<template>
  <div ref="modal" class="modal fade" id="rankingModal" tabindex="-1" aria-labelledby="rankingModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="rankingModalLabel">
            <i class="bi bi-trophy me-2"></i>
            胜利排行榜
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div v-if="winInfos.length === 0" class="text-center py-5">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <p class="text-muted mt-3">暂无排行榜数据</p>
          </div>

          <div v-else v-for="(info, index) in winInfos" :key="index" class="ranking-card mb-4">
            <div class="card" @click="toggleDetail(index)">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="ranking-info">
                    <h5 class="card-title mb-1">
                      <span class="badge bg-warning text-dark me-2">#{{ index + 1 }}</span>
                      <strong>胜利记录</strong>
                    </h5>
                    <div class="ranking-stats">
                      <span class="badge bg-primary me-2">
                        <i class="bi bi-clock me-1"></i>
                        用时: {{ formatDuration(info.duration) }}
                      </span>
                      <span class="badge bg-success me-2">
                        <i class="bi bi-arrow-right me-1"></i>
                        步数: {{ info.steps }}
                      </span>
                      <span class="badge bg-info">
                        <i class="bi bi-people me-1"></i>
                        队伍: {{ teamName }}
                      </span>
                    </div>
                  </div>

                  <div class="ranking-actions">
                    <button class="btn btn-outline-primary btn-sm" @click.stop="toggleDetail(index)">
                      <i class="bi" :class="showDetails[index] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                      {{ showDetails[index] ? '收起' : '详情' }}
                    </button>
                  </div>
                </div>

                <!-- 详细信息 -->
                <div v-if="showDetails[index]" class="details-section mt-3">
                  <div class="players-performance">
                    <h6 class="text-muted mb-3">
                      <i class="bi bi-person-lines-fill me-2"></i>
                      玩家表现详情
                    </h6>

                    <div class="list-group">
                      <div v-for="(_, key) in info.id2steps" :key="key"
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                          <img :src="svgStringToBlobUrl(roomInfo.players[key].icon)"
                            :alt="`${roomInfo.players[key].name} avatar`" class="player-avatar rounded-circle me-3">
                          <div class="player-info">
                            <span class="player-name fw-bold">
                              {{ roomInfo.players[key].name }}
                              <span v-if="key === curPlayer.id" class="badge bg-primary ms-2">(你)</span>
                            </span>
                            <div class="player-stats small text-muted">
                              {{ getPlayerStatsDescription(info, key) }}
                            </div>
                          </div>
                        </div>

                        <div class="player-performance-stats">
                          <span class="badge bg-primary me-2">
                            <i class="bi bi-arrow-right me-1"></i>
                            步数: {{ info.id2steps[key] }}
                          </span>
                          <span class="badge bg-success me-2">
                            <i class="bi bi-flag me-1"></i>
                            标记: {{ info.id2flags[key] }}
                          </span>
                          <span class="badge bg-info">
                            <i class="bi bi-box-arrow-up me-1"></i>
                            开启: {{ info.id2opens[key] }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="bi bi-x-circle me-1"></i>
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import { useGameStore } from '@/stores/game'

// 组合式API
const gameStore = useGameStore()

// 响应式数据
const winInfos = ref([])
const showDetails = ref({})
const modalInstance = ref(null)
const modal = ref(null)

// 计算属性
const roomInfo = computed(() => gameStore.roomInfo)
const curPlayer = computed(() => gameStore.curPlayer)
const teamName = computed(() => {
  return Object.values(roomInfo.value.players)
    .map(player => player.name)
    .join(' & ')
})

// 方法
const svgStringToBlobUrl = (svgString) => {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  return URL.createObjectURL(blob)
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getPlayerStatsDescription = (info, playerId) => {
  const steps = info.id2steps[playerId] || 0
  const flags = info.id2flags[playerId] || 0
  const opens = info.id2opens[playerId] || 0

  if (steps > 100) return '活跃玩家 - 操作频繁'
  if (flags > 10) return '标记专家 - 善于标记地雷'
  if (opens > 50) return '开启专家 - 善于开启安全区域'
  return '平衡玩家 - 各方面表现均衡'
}

const initModal = () => {
  if (modal.value) {
    modalInstance.value = new bootstrap.Modal(modal.value, {
      keyboard: true,
      focus: true,
    })
  }
}

const openModal = (winInfosData) => {
  winInfos.value = winInfosData || []
  showDetails.value = {}
  winInfos.value.forEach((_, index) => {
    showDetails.value[index] = false
  })

  if (modalInstance.value) {
    modalInstance.value.show()
  }
}

const closeModal = () => {
  if (modalInstance.value) {
    modalInstance.value.hide()
  }
}

const toggleDetail = (index) => {
  showDetails.value[index] = !showDetails.value[index]
}

// 暴露方法给父组件
defineExpose({
  openModal,
  closeModal,
})

// 生命周期
onMounted(() => {
  initModal()
})
</script>

<style scoped>
.modal-content {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem 1rem 0 0;
}

.modal-title {
  font-weight: 600;
  color: #2c3e50;
}

.ranking-card {
  transition: all 0.3s ease;
}

.ranking-card:hover {
  transform: translateY(-2px);
}

.card {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.2rem;
  color: #2c3e50;
}

.ranking-stats {
  margin-top: 0.5rem;
}

.badge {
  font-weight: 600;
  padding: 0.5em 0.8em;
}

.player-avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.player-name {
  color: #2c3e50;
  font-size: 1rem;
}

.player-stats {
  font-size: 0.85rem;
}

.player-performance-stats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.details-section {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1rem;
}

.list-group-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.list-group-item:hover {
  background-color: rgba(0, 123, 255, 0.05);
  border-color: #007bff;
}

.btn {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
  }

  .ranking-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .ranking-stats {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .player-performance-stats {
    flex-direction: column;
    gap: 0.25rem;
  }

  .list-group-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

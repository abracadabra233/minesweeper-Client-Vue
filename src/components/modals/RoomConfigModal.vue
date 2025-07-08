<template>
  <div class="modal fade" tabindex="-1" role="dialog" ref="modal">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-gear me-2"></i>
            选择房间配置
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <div class="config-options">
            <div v-for="(config, index) in difficultyConfigs" :key="index"
              class="config-item d-flex justify-content-between align-items-center p-3 mb-2 rounded border"
              :class="getConfigItemClass(config)" @click="selectConfig(config)">
              <div class="config-info">
                <div class="config-name fw-bold">{{ config.name }}</div>
                <div class="config-details small text-muted">
                  {{ config.rows }} × {{ config.cols }} 棋盘，{{ config.mines }} 个地雷
                </div>
              </div>
              <div class="config-badge">
                <span class="badge rounded-pill" :class="config.badgeClass">
                  {{ config.difficulty }}
                </span>
              </div>
            </div>

            <div class="config-item d-flex justify-content-between align-items-center p-3 mb-2 rounded border"
              @click="selectCustomConfig">
              <div class="config-info">
                <div class="config-name fw-bold">自定义</div>
                <div class="config-details small text-muted">
                  自定义棋盘大小和地雷数量
                </div>
              </div>
              <div class="config-badge">
                <span class="badge bg-info text-dark rounded-pill">自定义</span>
              </div>
            </div>
          </div>

          <!-- 玩家人数设置 -->
          <div class="player-count-section mt-4 p-3 bg-light rounded">
            <h6 class="text-muted mb-3">
              <i class="bi bi-people me-2"></i>
              玩家人数设置
            </h6>
            <div class="d-flex align-items-center">
              <label for="n_player" class="form-label me-3 mb-0">玩家数量:</label>
              <div class="flex-grow-1">
                <input type="range" id="n_player" v-model.number="n_player" min="1" max="10" class="form-range">
              </div>
              <span class="badge bg-primary ms-3">{{ n_player }}</span>
            </div>
            <div class="small text-muted mt-2">
              {{ getPlayerCountDescription() }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            <i class="bi bi-x-circle me-1"></i>
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'

// 响应式数据
const n_player = ref(2)
const modalInstance = ref(null)
const modal = ref(null)

// 难度配置
const difficultyConfigs = [
  {
    name: '初级',
    difficulty: '简单',
    rows: 8,
    cols: 8,
    mines: 10,
    badgeClass: 'bg-success',
  },
  {
    name: '中级',
    difficulty: '中等',
    rows: 16,
    cols: 16,
    mines: 40,
    badgeClass: 'bg-warning text-dark',
  },
  {
    name: '高级',
    difficulty: '困难',
    rows: 16,
    cols: 30,
    mines: 99,
    badgeClass: 'bg-danger',
  },
]

// 计算属性
const currentConfig = computed(() => ({
  cols: 16,
  rows: 16,
  mines: 40,
  n_player: n_player.value,
}))

// 方法
const initModal = () => {
  if (modal.value) {
    modalInstance.value = new bootstrap.Modal(modal.value, {
      keyboard: true,
      focus: true,
      backdrop: 'static',
    })
  }
}

const openModal = () => {
  if (modalInstance.value) {
    modalInstance.value.show()
  }
}

const closeModal = () => {
  if (modalInstance.value) {
    modalInstance.value.hide()
  }
}

const getConfigItemClass = (config) => {
  return 'config-item-hover cursor-pointer'
}

const selectConfig = (config) => {
  const finalConfig = {
    cols: config.cols,
    rows: config.rows,
    mines: config.mines,
    n_player: n_player.value,
  }
  emit('select', finalConfig)
  closeModal()
}

const selectCustomConfig = () => {
  emit('custom')
  closeModal()
}

const getPlayerCountDescription = () => {
  if (n_player.value === 1) {
    return '单人模式 - 独自挑战扫雷'
  } else if (n_player.value <= 3) {
    return '小团队模式 - 适合朋友间对战'
  } else if (n_player.value <= 6) {
    return '团队模式 - 多人协作挑战'
  } else {
    return '大型团队模式 - 大规模多人游戏'
  }
}

// 事件
const emit = defineEmits(['select', 'custom', 'error'])

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

.config-item {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.config-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #007bff !important;
}

.config-name {
  color: #2c3e50;
  font-size: 1.1rem;
}

.config-details {
  font-size: 0.9rem;
}

.badge {
  font-weight: 600;
  padding: 0.5em 1em;
}

.player-count-section {
  background: rgba(248, 249, 250, 0.8) !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.form-range {
  height: 6px;
  border-radius: 3px;
}

.form-range::-webkit-slider-thumb {
  background: #007bff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.form-range::-moz-range-thumb {
  background: #007bff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

  .config-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .config-badge {
    align-self: flex-end;
  }
}
</style>

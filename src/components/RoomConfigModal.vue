<template>
  <div class="modal fade" tabindex="-1" role="dialog" ref="modal">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">选择房间配置</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            <!-- 使用不同的badge颜色来区分不同的配置 -->
            <li class="list-group-item d-flex justify-content-between align-items-center"
              @click="selectConfig({ cols: 8, rows: 8, mines: 10, n_player: n_player })">
              <div class="fw-bold">初级</div>
              <span class="badge bg-success rounded-pill">8 × 8 - 10 雷</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center"
              @click="selectConfig({ cols: 16, rows: 16, mines: 40, n_player: n_player })">
              <div class="fw-bold">中级</div>
              <span class="badge bg-warning text-dark rounded-pill">16 × 16 - 40 雷</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center"
              @click="selectConfig({ cols: 30, rows: 16, mines: 99, n_player: n_player })">
              <div class="fw-bold">高级</div>
              <span class="badge bg-danger rounded-pill">30 × 16 - 99 雷</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center" @click="selectCustomConfig">
              <div class="fw-bold">自定义</div>
              <span class="badge bg-info text-dark rounded-pill">配置</span>
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <div class="d-flex w-100 align-items-center">
            <div class="flex-shrink-1 flex-grow-1">玩家人数: {{ n_player }}</div>
            <input type="range" id="n_player" v-model.number="n_player" min="1" max="10"
              class="form-range flex-grow-1 ms-2">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap';

export default {
  data() {
    return {
      n_player: 3,
      modalInstance: null, // 初始化模态框实例的变量
    };
  },
  mounted() {
    this.initModal();
  },
  methods: {
    initModal() {
      // 初始化模态框实例
      this.$nextTick(() => {
        let modalEl = this.$refs.modal;
        this.modalInstance = new bootstrap.Modal(modalEl, {
          keyboard: true, // 允许通过键盘的esc键关闭模态框
          focus: true
        });
      });
    },
    openModal() {
      if (this.modalInstance) {
        this.modalInstance.show();
      }
    },
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
    selectConfig(config) {
      this.$emit('select', config);
      this.closeModal(); // 选择配置后自动关闭模态框
    },
    selectCustomConfig() {
      this.$emit('custom');
      this.closeModal(); // 选择自定义配置后自动关闭模态框
    }
  }
};
</script>

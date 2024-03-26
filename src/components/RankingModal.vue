<template>
  <div ref="modal" class="modal fade" id="rankingModal" tabindex="-1" aria-labelledby="rankingModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="rankingModalLabel">Winners Ranking</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-for="(info, index) in winInfos" :key="index" class="card mb-3" @click="toggleDetail(index)">
            <div class="card-body">
              <h5 class="card-title"><strong>#{{ index + 1 }}</strong> Duration: {{ info.duration }}, Steps: {{
            info.steps }}</h5>
              <div v-if="showDetails[index]" class="details">
                <div class="list-group">
                  <div v-for="(_, key) in info.id2steps" :key=key
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <img :src="svgStringToBlobUrl(roomInfo.players[key].icon)" alt="player icon"
                        class="rounded-circle me-3" style="width: 40px; height: 40px; object-fit: cover;">
                      <span class="flex-grow-1">
                        {{ roomInfo.players[key].name }}
                        <span v-if="key === curPlayer.id" class="badge bg-primary ms-2">(You)</span>
                      </span>
                    </div>
                    <div class="d-flex align-items-center">
                      <span class="badge bg-primary me-2">Step: {{ info.id2steps[key] }}</span>
                      <span class="badge bg-success me-2">Flag: {{ info.id2flags[key] }}</span>
                      <span class="badge bg-info">Open: {{ info.id2opens[key] }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap';
import { mapState } from "vuex";
export default {
  computed: { ...mapState("websocket", ["roomInfo", "curPlayer", 'gameStatus']) },
  data() {
    return {
      winInfos: [],
      showDetails: {},
      modalInstance: null, // 初始化模态框实例的变量
    };
  },
  mounted() {
    this.initModal();
  },
  methods: {
    svgStringToBlobUrl(svgString) {
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      return URL.createObjectURL(blob);
    },
    initModal() {
      // 初始化模态框实例
      this.$nextTick(() => {
        let modalEl = this.$refs.modal;
        this.modalInstance = new bootstrap.Modal(modalEl, {
          keyboard: true,
          focus: true
        });
      });
    },
    openModal(winInfos) {
      this.winInfos = winInfos;
      this.showDetails = {};
      winInfos.forEach((_, index) => this.showDetails[index] = false);
      if (this.modalInstance) {
        this.modalInstance.show();
      }
    },
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
    toggleDetail(index) {
      this.showDetails[index] = !this.showDetails[index];
    }

  }
};
</script>

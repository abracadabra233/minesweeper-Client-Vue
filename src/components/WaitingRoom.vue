<template>
  <div class="container waiting-room my-5">
    <h2 class="text-center mb-4">
      Room:
      <span class="badge bg-secondary">{{ roomInfo.room_id }}</span>
      , Waiting
      <div class="spinner-border text-primary" role="status" style="width: 1rem; height: 1rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </h2>
    <div class="list-group">
      <div v-for="([id, player]) in Object.entries(roomInfo.players)" :key="id"
        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        :class="{ 'list-group-item-success': player.is_ready, 'list-group-item-light': !player.is_ready }">
        <img :src="svgStringToBlobUrl(player.icon)" alt="player icon" class="rounded-circle me-3"
          style="width: 40px; height: 40px; object-fit: cover;">
        <span class="flex-grow-1">
          {{ player.name }}
          <span v-if="id === curPlayer.id" class="badge bg-primary ms-2">(You)</span>
        </span>
        <div class="d-flex align-items-center">
          <span v-if="id === curPlayer.id">
            <button @click="toggleReady(id)" class="btn me-2" :class="player.is_ready ? 'btn-danger' : 'btn-success'">
              {{ player.is_ready ? '取消准备' : '准备' }}
            </button>
          </span>
          <span v-if="player.is_ready" class="badge bg-success rounded-pill me-2">Ready</span>
          <span v-else class="badge bg-secondary rounded-pill me-2">Not Ready</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: { ...mapState("websocket", ["roomInfo", "curPlayer", 'gameStatus']) },
  methods: {
    svgStringToBlobUrl(svgString) {
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      return URL.createObjectURL(blob);
    },
    toggleReady() {
      const message = {
        type: "PlayerStatusSet",
        player_id: this.curPlayer.id,
        is_ready: !this.curPlayer.is_ready,
      };
      this.$store.dispatch("sendMessage", message);
    },
  },
  watch: {
    gameStatus(newVal) {
      if (newVal == "Gameing") { this.$router.push({ name: "game" }) }
    },
  },
};
</script>

<template>
  <div class="waiting-room">
    <h2>{{ roomTitle }} {{ ellipsis }}</h2>
    <div class="player-list-container">
      <ul class="player-list">
        <li v-for="([id, player]) in Object.entries(roomInfo.players)" :key="id" class="player-item">
          <img :src="svgStringToBlobUrl(player.icon)" alt="player icon" class="player-icon" />
          {{ player.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  methods: {
    svgStringToBlobUrl(svgString) {
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      return URL.createObjectURL(blob);
    },
  },
  data() { return { ellipsis: "", }; },
  created() {
    let count = 0;
    this.interval = setInterval(() => {
      this.ellipsis = ".".repeat(count % 4);
      count++;
    }, 500);
  },
  beforeUnmount() { clearInterval(this.interval); },
  computed: {
    ...mapState("websocket", ["roomInfo", 'gameStatus']),
    roomTitle() {
      return `${this.roomInfo.room_id}, Waiting players`;
    },
  },
  watch: {
    gameStatus(newVal) {
      if (newVal == "Gameing") {
        this.$router.push({ name: "GamePage" });
      }
    },
  },
};
</script>

<style>
.waiting-room {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.player-list-container {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.player-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 300px;
  /* You can adjust this */
}

.player-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px;
  transition: background-color 0.3s;
}

.player-item:last-child {
  border-bottom: none;
}

.player-item:hover {
  background-color: #f9f9f9;
}

.player-icon {
  width: 50px;
  /* Adjust size as necessary */
  height: 50px;
  /* Adjust size as necessary */
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}
</style>

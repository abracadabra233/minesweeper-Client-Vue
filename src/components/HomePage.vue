<template>
  <div class="button-container">
    <button @click="createRoom" class="button create">创建房间</button>
    <button @click="joinRoom" class="button join">加入房间</button>
  </div>
  <RoomConfigModal v-if="showModal" @close="toggleModal(false)" @select="handleRoomCreation" />
</template>

<script>
import RoomConfigModal from "@/components/RoomConfigModal.vue";
import { mapState } from "vuex";
export default {
  data() { return { showModal: false }; },
  components: { RoomConfigModal },
  computed: { ...mapState("websocket", ["gameStatus", "curPlayer"]) },
  watch: {
    gameStatus(newVal) {
      if (newVal == "Waiting") {
        this.$router.push({ name: "WaitingRoom" });
      }
    },
  },
  methods: {
    toggleModal(state) { this.showModal = state; },
    createRoom() { this.toggleModal(true); },
    handleRoomCreation(config) {
      const requestBody = {
        type: "RoomCreate",
        player: this.curPlayer,
        config: config,
      };
      console.log("Creating room with:", requestBody);
      this.$store.dispatch("sendMessage", requestBody);
      this.toggleModal(false);
    },

    joinRoom() {
      const roomId = prompt("请输入房间ID", "66666");
      if (roomId) {
        const requestBody = {
          type: "RoomJoin",
          room_id: roomId,
          player: this.$store.state.player,
        };
        console.log("Joining room with:", requestBody);
        this.$store.dispatch("sendMessage", requestBody);
      }
    },
  },
};
</script>

<style>
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  /* Use full height to align vertically */
  gap: 20px;
}

.button {
  min-width: 200px;
  /* Minimum width */
  padding: 15px 30px;
  /* Larger padding for a bigger button */
  border: none;
  border-radius: 5px;
  font-size: 18px;
  /* Slightly larger font size */
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  /* Add some shadow for depth */
}

.button:hover {
  transform: translateY(-2px);
}

.create {
  background-color: #4caf50;
  color: white;
}

.create:hover {
  background-color: #45a049;
}

.join {
  background-color: #008cba;
  color: white;
}

.join:hover {
  background-color: #007bb8;
}
</style>

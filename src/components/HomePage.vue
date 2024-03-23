<template>
  <div class="d-flex justify-content-center mt-5">
    <div class="card" style="width: 20rem;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title mb-4">房间操作</h5>
        <button @click="createRoom" class="btn btn-primary mb-2">创建房间</button>
        <button @click="joinRoom" class="btn btn-secondary">加入房间</button>
      </div>
    </div>
  </div>
  <!-- RoomConfigModal组件，使用ref属性引用 -->
  <RoomConfigModal ref="roomConfigModal" @select="handleRoomCreation" />
</template>


<script>
import RoomConfigModal from "@/components/RoomConfigModal.vue";
import { mapState } from "vuex";
export default {
  components: { RoomConfigModal },
  computed: { ...mapState("websocket", ["gameStatus", "curPlayer"]) },
  watch: {
    gameStatus(newVal) {
      if (newVal == "Waiting") { this.$router.push({ name: "WaitingRoom" }) }
    },
  },
  methods: {
    createRoom() {
      // 使用ref调用RoomConfigModal组件的openModal方法
      this.$refs.roomConfigModal.openModal();
    },
    joinRoom() {
      const roomId = prompt("请输入房间ID", "66666");
      if (roomId) {
        const message = {
          type: "RoomJoin",
          room_id: roomId,
          player: this.curPlayer,
        };
        this.$store.dispatch("sendMessage", message);
      }
    },
    handleRoomCreation(config) {
      const message = {
        type: "RoomCreate",
        player: this.curPlayer,
        config: config,
      };
      this.$store.dispatch("sendMessage", message);
    },
  },
};
</script>

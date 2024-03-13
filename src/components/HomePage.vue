<template>
  <div class="button-container">
    <button @click="createRoom" class="button create">创建房间</button>
    <button @click="joinRoom" class="button join">加入房间</button>
  </div>
  <RoomConfigModal v-if="showModal" @close="showModal = false" @select="handleConfigSelected" />
</template>

<script>
import RoomConfigModal from "@/components/RoomConfigModal.vue";
import { mapState } from "vuex";
export default {
  components: {
    RoomConfigModal
  },
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    ...mapState(["roomInfo"]),
  },
  watch: {
    roomInfo(newVal) {
      if (newVal.room_id && newVal.players !== undefined) {
        this.$router.push({
          name: "WaitingRoom"
        });
      }
    },
  },
  methods: {
    createRoom() {
      this.showModal = true;
    },
    handleConfigSelected(config) {
      console.log("createRoom", config);
      this.$store
        .dispatch("initWebSocket")
        .then((ws) => {
          const player = this.$store.state.player;
          ws.send(
            JSON.stringify({
              type: "InitRoom",
              player: player,
              config: config,
            })
          );
        })
        .catch((error) => {
          console.error("WebSocket连接失败", error);
          // 处理连接失败的情况
        });
      this.showModal = false;
    },
    joinRoom() {
      this.$store
        .dispatch("initWebSocket")
        .then((ws) => {
          let roomId = prompt("请输入房间ID", "66666");
          const player = this.$store.state.player;
          ws.send(
            JSON.stringify({
              type: "JoinRoom",
              room_id: roomId,
              player: player,
            })
          );
        })
        .catch((error) => {
          console.error("WebSocket连接失败", error);
          // 处理连接失败的情况
        });
    },
  },
  // setup() {
  //   onBeforeUnmount(() => {
  //     // 页面卸载前关闭WebSocket连接
  //     if (this.$store.state.ws) {
  //       this.$store.state.ws.close();
  //     }
  //   });
  // },

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
  background-color: #4CAF50;
  color: white;
}

.create:hover {
  background-color: #45a049;
}

.join {
  background-color: #008CBA;
  color: white;
}

.join:hover {
  background-color: #007bb8;
}
</style>
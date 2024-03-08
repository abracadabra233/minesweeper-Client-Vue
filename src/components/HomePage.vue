<template>
  <div>
    <button @click="createRoom">创建房间</button>
    <button @click="joinRoom">加入房间</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
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
      this.$store
        .dispatch("initWebSocket")
        .then((ws) => {
          let input = prompt(
            "请输入列数、行数和地雷数。例如 '10,10,16'",
            "10 10 16"
          );
          let parts = input.split(" ");
          const player = this.$store.state.player;
          ws.send(
            JSON.stringify({
              type: "InitRoom",
              player: player,
              config: {
                cols: parseInt(parts[0], 10),
                rows: parseInt(parts[1], 10),
                mines: parseInt(parts[2], 10),
              },
            })
          );
        })
        .catch((error) => {
          console.error("WebSocket连接失败", error);
          // 处理连接失败的情况
        });
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
};
</script>

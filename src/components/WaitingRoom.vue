<template>
  <div>
    <h2>等待室</h2>
    <ul>
      <li v-for="player in roomInfo.players" :key="player.id">
        <img :src="player.icon" alt="player icon" /> {{ player.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['roomInfo']),
    ...mapState(['gameConfig', 'gameBoard']),
  },
  watch: {
    'gameBoard'(newConfig) {
      if (newConfig) {
        console.log('游戏开始', newConfig);
        this.$router.push({ name: 'GamePage' });
      }
    },
  },
};
</script>
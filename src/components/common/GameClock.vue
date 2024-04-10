<template>
    <div class="badge bg-success">
        ⏱ {{ formatTime(timePassed) }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            timePassed: 0,
            intervalId: null,
        };
    },
    methods: {
        formatTime(timeInSeconds) {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = timeInSeconds % 60;
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');
            return `${formattedMinutes}:${formattedSeconds}`;
        },
        start() {
            if (this.intervalId) return; // 防止多个定时器同时运行
            this.timePassed = 0;
            this.intervalId = setInterval(() => {
                this.timePassed++;
            }, 1000);
        },
        stop() {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },
    beforeUnmount() {
        this.stop(); // 组件卸载时确保定时器被清除
    },
};
</script>
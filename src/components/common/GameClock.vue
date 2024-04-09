<template>
    <div class="badge bg-success">
        ⏱ {{ timePassed }}
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
        start() {
            if (this.intervalId) return; // 防止多个定时器同时运行
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
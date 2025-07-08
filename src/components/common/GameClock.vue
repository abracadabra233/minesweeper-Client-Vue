<template>
    <div class="game-clock">
        <div class="badge bg-success fs-6">
            <i class="bi bi-clock me-1"></i>
            {{ formatTime(timePassed) }}
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

// 响应式数据
const timePassed = ref(0)
const intervalId = ref(null)

// 方法
const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')
    return `${formattedMinutes}:${formattedSeconds}`
}

const start = () => {
    if (intervalId.value) return // 防止多个定时器同时运行
    timePassed.value = 0
    intervalId.value = setInterval(() => {
        timePassed.value++
    }, 1000)
}

const stop = () => {
    if (intervalId.value) {
        clearInterval(intervalId.value)
        intervalId.value = null
    }
}

const reset = () => {
    stop()
    timePassed.value = 0
}

// 暴露方法给父组件
defineExpose({
    start,
    stop,
    reset,
})

// 生命周期
onUnmounted(() => {
    stop() // 组件卸载时确保定时器被清除
})
</script>

<style scoped>
.game-clock {
    display: inline-block;
}

.badge {
    font-weight: 600;
    padding: 0.5em 1em;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}

.badge:hover {
    transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .badge {
        font-size: 0.875rem !important;
        padding: 0.4em 0.8em;
    }
}
</style>
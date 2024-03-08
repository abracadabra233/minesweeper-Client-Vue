<template>
    <div>
      <h2>游戏结束</h2>
      <p>{{ result }}</p>
      <button @click="restartGame">重新开始</button>
      <router-link to="/">返回首页</router-link>
    </div>
  </template>
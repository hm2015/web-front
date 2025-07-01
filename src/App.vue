<script setup>
import { RouterView } from 'vue-router'
import MyHeader from './components/MyHeader.vue'
import MyFooter from './components/MyFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <MyHeader />

    <main class="flex-1">
      <RouterView />
    </main>

    <MyFooter />
  </div>
</template>

<style scoped>
/* 应用布局样式已通过 Tailwind CSS 类处理 */
</style>

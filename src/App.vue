<template>
  <div class="flex min-h-screen">
    <AppSidebar/>
    <main class="flex-1 bg-gray-800 p-6 min-h-screen text-white">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppSidebar from './components/AppSidebar.vue'
</script>
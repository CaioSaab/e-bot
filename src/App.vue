<template>
  <div class="flex min-h-screen">
    <AppSidebar v-if="!isLoginPage"/>
    <main class="flex-1 bg-gray-800 p-6 min-h-screen text-white">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import { computed } from 'vue'

const route = useRoute()

const isLoginPage = computed(() => route.path === '/login' || route.path === '/registro')
</script>
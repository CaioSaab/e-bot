<template>
  <aside class="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col">
    <div class="mb-6 flex text-center items-center">
      <img src="../assets/logo.png" alt="Logo" class="w-10 mb-2 rounded-3xl" />
      <h1 class="text-xl ml-2 mt-2 font-bold">Bot</h1>
    </div>
    <nav class="space-y-2 flex-1">
      <router-link :to="routes.dashboard" class="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</router-link>
      <router-link :to="routes.anuncio" class="block px-4 py-2 rounded hover:bg-gray-700">Anúncios</router-link>
      <router-link :to="routes.produtos" class="block px-4 py-2 rounded hover:bg-gray-700">Produtos</router-link>
      <router-link :to="routes.perguntas" class="block px-4 py-2 rounded hover:bg-gray-700">Perguntas a Responder</router-link>
    </nav>

    <button 
      @click="logout" 
      class="mt-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      Sair
    </button>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { routes } from '@/router' // <-- importando rotas nomeadas

const router = useRouter()

function logout() {
  localStorage.removeItem('AUTH_TOKEN') // ou sessionStorage se for esse o caso
  router.push(routes.login)
}
</script>

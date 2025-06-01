<template>
  <div class="flex items-center justify-center h-screen bg-gray-900">
    <div class="bg-gray-800 p-8 rounded-lg shadow-md w-96">
      <img src="../assets/logo.png" alt="Logo" class="w-20 h-20 mb-4 mx-auto rounded-full object-cover" />

      <h1 class="text-2xl font-bold text-white mb-6 text-center">Login</h1>

      <input
        v-model="nome"
        type="text"
        placeholder="Usuário"
        class="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white focus:outline-none"
      />

      <input
        v-model="senha"
        type="password"
        placeholder="Senha"
        class="w-full px-4 py-2 mb-6 rounded bg-gray-700 text-white focus:outline-none"
      />

      <button
        @click="Authenticate"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Entrar
      </button>

      <p class="text-sm text-gray-400 text-center mt-4">
        Não tem uma conta?
        <router-link :to=routes.register class="text-blue-500 hover:underline">
          Cadastre-se
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import api from '@/api'
import { ref } from 'vue'
import router, { routes } from '@/router';

const nome = ref('')
const senha = ref('')

async function Authenticate() {
  const signInParameters = {
    nome: nome.value,
    senha: senha.value
  }

  console.log({ signInParameters }, 'Parâmetros do login')

  try {
    const signInResult = await api.post('/auth/signIn', signInParameters)

    window.localStorage.setItem('AUTH_TOKEN', signInResult.data)
    console.log('Login realizado, redirecionando...')
    router.replace(routes.dashboard)
  } catch (error) {
    alert('Falha no login')
    console.error({ error }, 'Erro no login')
  }
}
</script>

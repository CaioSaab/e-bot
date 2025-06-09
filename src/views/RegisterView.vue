<template>
  <div class="flex items-center justify-center h-screen bg-gray-900">
    <div class="bg-gray-800 p-8 rounded-lg shadow-md w-96">
      <img src="../assets/logo.png" alt="Logo" class="w-20 h-20 mb-4 mx-auto rounded-full object-cover" />

      <h1 class="text-2xl font-bold text-white mb-6 text-center">Cadastro</h1>

      <input v-model="nome" type="text" placeholder="Nome de usuário" class="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white focus:outline-none"/>

      <input v-model="email" type="email" placeholder="Email" class="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white focus:outline-none"/>

      <input v-model="senha" type="password" placeholder="Senha" class="w-full px-4 py-2 mb-6 rounded bg-gray-700 text-white focus:outline-none"/>

      <button @click="Register" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
        Cadastrar
      </button>

      <p class="text-sm text-gray-400 text-center mt-4">
        Já tem uma conta?
        <router-link to="/login" class="text-blue-500 hover:underline">
          Entrar
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import api from '@/api'
import { ref } from 'vue'
import router from '@/router'

const nome = ref('')
const email = ref('')
const senha = ref('')

async function Register() {
  const registerParameters = {
    nome: nome.value,
    email: email.value,
    senha: senha.value
  }

  console.log({ registerParameters }, 'Parâmetros do cadastro')

  try {
    await api.post('/contas', registerParameters)
    alert('Cadastro realizado com sucesso!')
    router.replace(routes.login)
  } catch (error) {
    alert('Erro ao realizar cadastro')
    console.error({ error }, 'Erro no cadastro')
  }
}
</script>
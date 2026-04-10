<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border-t-4 border-susGreen">
    <h2 class="text-2xl font-bold text-center text-susBlue mb-6">Acesso ao Sistema</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">E-mail</label>
        <input v-model="email" type="email" class="w-full border rounded p-2 focus:ring focus:ring-susBlue/30" required>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Senha</label>
        <input v-model="password" type="password" class="w-full border rounded p-2 focus:ring focus:ring-susBlue/30" required>
      </div>
      <button type="submit" class="w-full bg-susBlue text-white font-bold py-2 rounded hover:bg-blue-700 transition" :disabled="loading">
        {{ loading ? 'Carregando...' : 'Entrar / Registrar' }}
      </button>
      <p class="text-xs text-center text-gray-500 mt-2">Se a conta não existir, ela será criada automaticamente.</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  
  // 1. Tenta fazer o login no Supabase
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  // 2. Se a conta não existir (Invalid login credentials), nós criamos ela na hora!
  if (error && error.message.includes('Invalid login')) {
    const signup = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })
    data = signup.data
    
    // 3. Cadastra esse novo usuário na nossa tabela de Perfis como "paciente"
    if(data.user) {
        await supabase.from('profiles').insert([{ id: data.user.id, role: 'paciente' }])
    }
  }

  // 4. Se o usuário conseguiu logar, verifica se ele é admin ou paciente para jogar pra tela certa
  if (data?.user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
    
    if (profile?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/paciente')
    }
  } else if (error) {
    alert("Erro ao entrar: " + error.message)
  }

  loading.value = false
}
</script>
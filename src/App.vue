<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 font-sans">
    <nav class="bg-susBlue text-white p-4 shadow-md flex justify-between items-center">
      <h1 class="text-xl font-bold flex items-center gap-2">
        <span class="text-susGreen text-2xl">✚</span> SaúdeFácil
      </h1>
      <button v-if="user" @click="logout" class="bg-white text-susBlue px-4 py-1 rounded hover:bg-gray-200 transition font-bold">
        Sair
      </button>
    </nav>

    <main class="p-4 max-w-6xl mx-auto mt-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './services/supabase'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  // Fica observando se o usuário logou ou deslogou
  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user || null
  })
})

const logout = async () => {
  // Desloga no Supabase e joga pra tela inicial
  await supabase.auth.signOut()
  router.push('/')
}
</script>
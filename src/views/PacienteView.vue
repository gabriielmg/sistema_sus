<template>
  <section class="space-y-6">
    <div class="rounded-2xl bg-white p-6 shadow-lg">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-susGreen">Paciente</p>
      <h2 class="mt-2 text-2xl font-bold text-gray-900">Painel do paciente</h2>
      <p class="mt-2 text-gray-600">
        A aplicacao voltou a carregar. Esta tela pode receber sua listagem de consultas e agendamentos.
      </p>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-lg">
      <h3 class="text-lg font-semibold text-gray-900">Sessao atual</h3>
      <p class="mt-3 text-sm text-gray-600">
        {{ userEmail ? `Logado como ${userEmail}` : 'Nenhum usuario identificado.' }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../services/supabase'

const userEmail = ref('')

onMounted(async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  userEmail.value = user?.email || ''
})
</script>

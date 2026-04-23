<template>
  <section class="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg">
    <div class="mb-6 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-susBlue">Agendamento SUS</p>
      <h2 class="mt-2 text-2xl font-bold text-gray-900">Entrar no sistema</h2>
      <p class="mt-2 text-sm text-gray-600">
        Use seu email e senha cadastrados no Supabase.
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="login">
      <label class="block">
        <span class="mb-1 block text-sm font-medium text-gray-700">Email</span>
        <input
          v-model="email"
          type="email"
          class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-susBlue"
          placeholder="seuemail@exemplo.com"
          required
        />
      </label>

      <label class="block">
        <span class="mb-1 block text-sm font-medium text-gray-700">Senha</span>
        <input
          v-model="password"
          type="password"
          class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-susBlue"
          placeholder="••••••••"
          required
        />
      </label>

      <p v-if="errorMessage" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        class="w-full rounded-xl bg-susBlue px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function login() {
  isLoading.value = true
  errorMessage.value = ''

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  isLoading.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }

  const role = data.user?.user_metadata?.role
  router.push(role === 'admin' ? '/admin' : '/paciente')
}
</script>

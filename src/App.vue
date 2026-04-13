<template>
  <div class="min-h-screen text-slate-800">
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute left-0 top-0 h-72 w-72 rounded-full bg-susBlue/15 blur-3xl" />
      <div class="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-susGreen/15 blur-3xl" />
    </div>

    <header
      v-if="showShell"
      class="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-susBlue to-susGreen text-sm font-bold text-white shadow-card"
          >
            SUS
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-susBlue">
              Sistema publico de saude
            </p>
            <p class="text-sm font-semibold text-ink">{{ pageLabel }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span
            v-if="profile"
            class="hidden rounded-full bg-susBlue-soft px-3 py-1 text-xs font-semibold text-susBlue-dark sm:inline-flex"
          >
            {{ profile.role === 'admin' ? 'Equipe' : 'Paciente' }}
          </span>
          <BaseButton variant="ghost" size="sm" @click="handleLogout">Sair</BaseButton>
        </div>
      </div>
    </header>

    <main :class="showShell ? 'mx-auto max-w-7xl px-3 py-4 sm:px-4 lg:px-6' : 'min-h-screen px-4 py-6 sm:px-6 lg:px-8'">
      <div v-if="!authReady && showShell" class="mb-4 rounded-3xl border border-white/60 bg-white/80 p-4 text-sm text-slate-600">
        Carregando sua sessão...
      </div>
      <RouterView v-else />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { authReady, logout, profile } = useAuth()

const showShell = computed(() => route.name !== 'login')
const pageLabel = computed(() => {
  if (route.name === 'admin') return 'Painel da equipe'
  if (route.name === 'paciente') return 'Agendamento rápido'
  return 'Acesso'
})

async function handleLogout() {
  await logout()
  await router.push({ name: 'login' })
}
</script>

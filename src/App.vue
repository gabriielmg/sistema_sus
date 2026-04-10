<template>
  <div class="min-h-screen text-slate-800">
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute left-0 top-0 h-72 w-72 rounded-full bg-susBlue/20 blur-3xl" />
      <div class="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-susGreen/20 blur-3xl" />
    </div>

    <main v-if="isLoginPage" class="min-h-screen px-4 py-10 lg:px-8">
      <RouterView />
    </main>

    <div v-else class="page-shell">
      <header class="glass-panel mb-5 flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div class="flex items-center gap-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-susBlue to-susGreen text-xl font-bold text-white shadow-card"
          >
            SUS
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-susBlue">
              Agendamento digital
            </p>
            <h1 class="font-display text-2xl font-semibold text-ink">
              {{ pageTitle }}
            </h1>
            <p class="text-sm text-slate-600">
              {{ pageSubtitle }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div v-if="user" class="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Sessao ativa
            </p>
            <p class="text-sm font-semibold text-slate-800">{{ user.email }}</p>
          </div>
          <div
            v-if="profile"
            class="rounded-3xl px-4 py-2 text-sm font-semibold"
            :class="profile.role === 'admin' ? 'bg-susBlue-soft text-susBlue-dark' : 'bg-susGreen-soft text-susGreen-dark'"
          >
            {{ profile.role === 'admin' ? 'Administrador' : 'Paciente' }}
          </div>
          <BaseButton variant="ghost" @click="handleLogout">Sair</BaseButton>
        </div>
      </header>

      <div v-if="!authReady" class="glass-panel px-6 py-12 text-center">
        <p class="text-sm font-semibold text-slate-700">Carregando sua sessao...</p>
      </div>
      <RouterView v-else />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { authReady, logout, profile, user } = useAuth()

const isLoginPage = computed(() => route.name === 'login')

const pageTitle = computed(() =>
  route.name === 'admin' ? 'Centro de comando do SUS' : 'Busca e agendamento do paciente',
)

const pageSubtitle = computed(() =>
  route.name === 'admin'
    ? 'Organize a oferta de horarios, unidades e acompanhe a operacao em tempo real.'
    : 'Encontre unidades proximas pelo CEP e reserve seu atendimento em poucos passos.',
)

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300',
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800',
    ]"
  >
    <!-- Blobs decorativos de fundo -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        :class="[
          'absolute -left-20 top-0 h-[30rem] w-[30rem] rounded-full blur-[100px] transition-all duration-1000',
          isDark ? 'bg-susBlue/15' : 'bg-susBlue/8',
        ]"
      />
      <div
        :class="[
          'absolute -bottom-20 -right-20 h-[35rem] w-[35rem] rounded-full blur-[120px] transition-all duration-1000',
          isDark ? 'bg-susGreen/15' : 'bg-susGreen/8',
        ]"
      />
    </div>

    <!-- ── Header principal (só aparece após login) ── -->
    <header
      v-if="showShell"
      :class="[
        'sticky top-0 z-40 transition-all duration-300',
        isDark
          ? 'border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl'
          : 'border-b border-slate-200/60 bg-white/80 backdrop-blur-xl',
      ]"
    >
      <div :class="shellHeaderClass">

        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-susBlue to-susBlue-dark shadow-md shadow-susBlue/30 ring-1 ring-inset ring-white/20">
            <svg class="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div class="hidden sm:block">
            <p :class="['text-[10px] font-bold uppercase tracking-widest', isDark ? 'text-slate-400' : 'text-slate-500']">
              Sistema Público de Saúde
            </p>
            <p :class="['text-sm font-extrabold leading-tight', isDark ? 'text-white' : 'text-slate-900']">
              {{ pageLabel }}
            </p>
          </div>
        </div>

        <!-- Ações direita -->
        <div class="flex items-center gap-2">

          <!-- Badge de rota/papel -->
          <span
            v-if="profile"
            :class="[
              'hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold sm:inline-flex',
              isDark
                ? 'bg-slate-800 text-slate-300 ring-1 ring-slate-700'
                : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
            ]"
          >
            <span class="relative flex h-1.5 w-1.5">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {{ roleLabel }}
          </span>

          <!-- Toggle de tema -->
          <button
            :class="[
              'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
              isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700',
            ]"
            :aria-label="themeActionLabel"
            :title="themeActionLabel"
            @click="toggleTheme"
          >
            <svg v-if="isDark" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75a9.75 9.75 0 0 1-9.75-9.75 9.718 9.718 0 0 1 .748-3.752A9.75 9.75 0 1 0 21.752 15.002Z" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.864 6.364-1.06-1.06M6.197 6.197 5.136 5.136m13.728 0-1.06 1.06M6.197 17.803l-1.06 1.06M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          </button>

          <!-- Avatar + Sair -->
          <div class="flex items-center gap-2">
            <!-- Avatar com iniciais -->
            <div
              v-if="profile"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-susBlue to-susGreen text-xs font-black text-white shadow-sm"
              :title="profile.full_name"
            >
              {{ userInitials }}
            </div>

            <!-- Botão Sair -->
            <button
              :class="[
                'group flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-all',
                isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-rose-900/40 hover:text-rose-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600',
              ]"
              @click="handleLogout"
            >
              <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span class="hidden sm:inline">Sair</span>
            </button>
          </div>

        </div>
      </div>
    </header>

    <!-- Botão de tema flutuante (fora do shell — tela de login) -->
    <button
      v-if="!showShell"
      :class="[
        'fixed right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-xl shadow-lg transition-colors',
        isDark
          ? 'bg-slate-800 text-slate-300 shadow-slate-900/30 hover:bg-slate-700'
          : 'bg-white text-slate-500 shadow-slate-200/60 hover:bg-slate-50',
      ]"
      :aria-label="themeActionLabel"
      @click="toggleTheme"
    >
      <svg v-if="isDark" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75a9.75 9.75 0 0 1-9.75-9.75 9.718 9.718 0 0 1 .748-3.752A9.75 9.75 0 1 0 21.752 15.002Z" />
      </svg>
      <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.864 6.364-1.06-1.06M6.197 6.197 5.136 5.136m13.728 0-1.06 1.06M6.197 17.803l-1.06 1.06M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    </button>

    <!-- ── Conteúdo principal ── -->
    <main :class="shellMainClass">

      <!-- Loading de verificação de sessão -->
      <div
        v-if="!authReady && showShell"
        class="mt-8 flex flex-col items-center justify-center rounded-3xl border p-12 text-center"
        :class="isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-white/60'"
      >
        <div class="relative flex h-12 w-12 items-center justify-center">
          <div class="absolute h-12 w-12 animate-ping rounded-full bg-susBlue/20" />
          <div :class="['h-8 w-8 animate-spin rounded-full border-4 border-t-susBlue', isDark ? 'border-slate-700' : 'border-slate-200']" />
        </div>
        <p :class="['mt-4 text-sm font-bold', isDark ? 'text-slate-300' : 'text-slate-600']">Verificando credenciais...</p>
        <p :class="['mt-1 text-xs', isDark ? 'text-slate-500' : 'text-slate-400']">Aguarde um momento.</p>
      </div>

      <div v-else class="animate-in fade-in zoom-in-[0.99] duration-300">
        <RouterView />
      </div>

    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { authReady, logout, profile } = useAuth()
const { isDark, toggleTheme } = useTheme()

const showShell = computed(() => route.name !== 'login')

const shellHeaderClass = computed(() => {
  if (route.name === 'admin') {
    return 'mx-auto flex w-full max-w-[1720px] items-center justify-between gap-4 px-4 py-3 sm:px-6 xl:px-8'
  }
  return 'mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8'
})

const shellMainClass = computed(() => {
  if (!showShell.value) return 'w-full'
  if (route.name === 'admin') {
    return 'mx-auto w-full max-w-[1720px] px-4 py-6 sm:px-6 xl:px-8'
  }
  return 'mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8'
})

const pageLabel = computed(() => {
  if (route.name === 'admin') return 'Painel Administrativo'
  if (route.name === 'gestor') return 'Gestão da Unidade'
  if (route.name === 'paciente') return 'Agendamento'
  return 'Acesso'
})

const roleLabel = computed(() => {
  const role = profile.value?.role
  if (role === 'admin') return 'Administrador'
  if (role === 'gestor') return 'Gestor'
  return 'Paciente'
})

const userInitials = computed(() => {
  const name = profile.value?.full_name ?? ''
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase() || '??'
})

const themeActionLabel = computed(() => isDark.value ? 'Ativar tema claro' : 'Ativar tema escuro')

async function handleLogout() {
  await logout()
  await router.push({ name: 'login' })
}
</script>

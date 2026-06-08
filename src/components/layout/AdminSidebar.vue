<template>
  <aside
    :class="[
      'overflow-hidden rounded-3xl border p-4 sm:p-5 xl:sticky xl:top-5',
      isDark
        ? 'border-slate-800 bg-slate-900/80 backdrop-blur-xl'
        : 'border-slate-200/60 bg-white/90 shadow-xl shadow-slate-200/30 backdrop-blur-xl',
    ]"
  >
    <!-- Hero do painel -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a3d8a] via-[#0f62db] to-[#0b7d5b] p-5 text-white">
      <div class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div class="pointer-events-none absolute bottom-0 left-0 h-16 w-16 rounded-full bg-susGreen/20 blur-xl" />

      <div class="relative">
        <div class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Sistema Ativo</span>
        </div>

        <h2 class="mt-3 text-xl font-black leading-tight tracking-tight">Painel<br />Administrativo</h2>
        <p class="mt-2 text-xs leading-5 text-white/60">
          Gerencie unidades, agenda e monitore os agendamentos em tempo real.
        </p>

        <div class="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-3 py-2">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <svg class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-white/50">Rede</p>
            <p class="text-xs font-bold text-white">Operação Central</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navegação -->
    <nav class="mt-4 grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 focus:outline-none"
        :class="item.key === activeKey
          ? 'bg-gradient-to-r from-susBlue to-[#2b78ef] text-white shadow-lg shadow-susBlue/25'
          : (isDark
            ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')"
        @click="$emit('select', item.key)"
      >
        <!-- Ícone -->
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors"
          :class="item.key === activeKey
            ? 'bg-white/20'
            : (isDark ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-slate-100 group-hover:bg-slate-200')"
        >
          <component :is="'svg'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" v-html="item.iconPath" />
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold leading-tight">{{ item.label }}</p>
          <p class="mt-0.5 text-xs leading-4 opacity-60 line-clamp-1">{{ item.description }}</p>
        </div>

        <!-- Seta ativa -->
        <svg
          v-if="item.key === activeKey"
          class="h-3.5 w-3.5 shrink-0 text-white/70"
          fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </nav>

    <!-- Rodapé -->
    <div
      class="mt-4 rounded-2xl border px-4 py-3.5 text-xs"
      :class="isDark ? 'border-slate-800 bg-slate-800/50 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'"
    >
      <p class="font-bold" :class="isDark ? 'text-slate-200' : 'text-slate-700'">Fluxo administrativo</p>
      <p class="mt-1 leading-5">Cadastros, agenda e gestão da fila em um único painel.</p>
    </div>
  </aside>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

defineProps({
  items: { type: Array, default: () => [] },
  activeKey: { type: String, default: 'dashboard' },
})

defineEmits(['select'])

const { isDark } = useTheme()
</script>

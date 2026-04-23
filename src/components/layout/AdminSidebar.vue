<template>
  <aside class="admin-sidebar glass-panel dot-grid overflow-hidden p-4 sm:p-5 xl:sticky xl:top-5">
    <div class="admin-sidebar__hero rounded-[28px] p-5 text-white shadow-soft dark:bg-slate-950/90">
      <div class="admin-sidebar__eyebrow">
        <span class="admin-sidebar__pulse" />
        Gestao SUS
      </div>
      <h2 class="mt-4 font-display text-[1.65rem] font-semibold tracking-[-0.03em]">Painel administrativo</h2>
      <p class="mt-3 text-sm leading-6 text-slate-300 dark:text-slate-400">
        Controle unidades, especialidades, horarios e acompanhe a fila de agendamentos com uma visao operacional clara.
      </p>
      <div class="admin-sidebar__trust">
        <span class="admin-sidebar__trust-label">Rede publica</span>
        <span class="admin-sidebar__trust-value">Operacao central</span>
      </div>
    </div>

    <nav class="admin-sidebar__nav mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        @click="$emit('select', item.key)"
        :class="[
          'admin-sidebar__item w-full rounded-[22px] px-4 py-3.5 text-left transition-all duration-200',
          item.key === activeKey
            ? 'admin-sidebar__item--active bg-susBlue text-white shadow-card'
            : 'bg-white/70 text-slate-700 hover:bg-white dark:bg-slate-900/75 dark:text-slate-100 dark:hover:bg-slate-800',
        ]"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold tracking-[-0.01em]">{{ item.label }}</p>
            <p class="mt-1 text-xs leading-5 opacity-80">{{ item.description }}</p>
          </div>
          <span
            class="inline-flex h-10 w-10 items-center justify-center rounded-[18px] border border-white/15 bg-white/10 text-xs font-bold"
          >
            {{ item.short }}
          </span>
        </div>
      </button>
    </nav>

    <div class="admin-sidebar__footer mt-6 rounded-[24px] border border-slate-200/70 bg-white/72 px-4 py-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
      <p class="font-semibold text-slate-900 dark:text-slate-100">Fluxo administrativo</p>
      <p class="mt-1 leading-6">Acoes criticas, cadastros e acompanhamento da fila em um unico painel.</p>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  activeKey: {
    type: String,
    default: 'dashboard',
  },
})

defineEmits(['select'])
</script>

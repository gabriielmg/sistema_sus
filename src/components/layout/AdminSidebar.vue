<template>
  <aside class="glass-panel dot-grid sticky top-5 overflow-hidden p-5">
    <div class="rounded-3xl bg-slate-900/90 p-5 text-white shadow-soft">
      <p class="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">
        Gestao SUS
      </p>
      <h2 class="mt-3 font-display text-2xl font-semibold">Painel administrativo</h2>
      <p class="mt-2 text-sm leading-6 text-slate-300">
        Controle unidades, especialidades, horarios e acompanhe a fila de agendamentos.
      </p>
    </div>

    <nav class="mt-6 space-y-2">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        @click="$emit('select', item.key)"
        :class="[
          'w-full rounded-2xl px-4 py-3 text-left transition',
          item.key === activeKey
            ? 'bg-susBlue text-white shadow-card'
            : 'bg-white/70 text-slate-700 hover:bg-white',
        ]"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="font-semibold">{{ item.label }}</p>
            <p class="mt-1 text-xs opacity-80">{{ item.description }}</p>
          </div>
          <span
            class="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xs font-bold"
          >
            {{ item.short }}
          </span>
        </div>
      </button>
    </nav>
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

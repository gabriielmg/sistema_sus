<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]',
      styleMap[currentStatus] ?? styleMap.default,
    ]"
  >
    {{ labelMap[currentStatus] ?? currentStatus }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'pendente',
  },
})

const currentStatus = computed(() => String(props.status || 'pendente').toLowerCase())

const labelMap = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  disponivel: 'Disponivel',
  reservado: 'Reservado',
  indisponivel: 'Indisponivel',
}

const styleMap = {
  pendente: 'bg-amber-100 text-amber-700',
  confirmado: 'bg-emerald-100 text-emerald-700',
  cancelado: 'bg-rose-100 text-rose-700',
  disponivel: 'bg-sky-100 text-sky-700',
  reservado: 'bg-indigo-100 text-indigo-700',
  indisponivel: 'bg-slate-200 text-slate-700',
  default: 'bg-slate-100 text-slate-700',
}
</script>

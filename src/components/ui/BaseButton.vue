<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
      sizeClass,
      variantClass,
      block ? 'w-full' : '',
    ]"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        class="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-90"
        fill="currentColor"
        d="M22 12a10 10 0 0 0-10-10v4a6 6 0 0 1 6 6h4Z"
      />
    </svg>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  type: {
    type: String,
    default: 'button',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
})

const variantMap = {
  primary:
    'bg-susBlue text-white shadow-card hover:bg-susBlue-dark focus:ring-susBlue/20',
  success:
    'bg-susGreen text-white shadow-card hover:bg-susGreen-dark focus:ring-susGreen/20',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300/60',
  ghost:
    'bg-white/70 text-slate-700 hover:bg-white focus:ring-slate-300/60 border border-slate-200',
  danger:
    'bg-rose-600 text-white shadow-card hover:bg-rose-700 focus:ring-rose-500/20',
}

const sizeMap = {
  sm: 'min-h-11 px-4 py-2.5 text-sm',
  md: 'min-h-12 px-4 py-3 text-sm',
  lg: 'min-h-14 px-5 py-4 text-base',
}

const variantClass = computed(() => variantMap[props.variant] ?? variantMap.primary)
const sizeClass = computed(() => sizeMap[props.size] ?? sizeMap.md)
const isDisabled = computed(() => props.loading || props.disabled)
</script>

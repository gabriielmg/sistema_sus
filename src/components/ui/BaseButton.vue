<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-[18px] font-semibold tracking-[-0.01em] transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
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
    'bg-gradient-to-r from-susBlue to-[#2b78ef] text-white shadow-card hover:-translate-y-0.5 hover:shadow-elevated focus:ring-susBlue/20',
  success:
    'bg-gradient-to-r from-susGreen to-[#18b686] text-white shadow-card hover:-translate-y-0.5 hover:shadow-elevated focus:ring-susGreen/20',
  secondary:
    'border border-lineHealth bg-white/80 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white focus:ring-slate-300/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-slate-600/60',
  ghost:
    'border border-slate-200/90 bg-white/72 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white focus:ring-slate-300/60 dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-600/60',
  danger:
    'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-card hover:-translate-y-0.5 hover:shadow-elevated focus:ring-rose-500/20',
}

const sizeMap = {
  sm: 'min-h-11 px-4 py-2.5 text-sm',
  md: 'min-h-[3.125rem] px-4 py-3 text-sm',
  lg: 'min-h-[3.5rem] px-5 py-4 text-base',
}

const variantClass = computed(() => variantMap[props.variant] ?? variantMap.primary)
const sizeClass = computed(() => sizeMap[props.size] ?? sizeMap.md)
const isDisabled = computed(() => props.loading || props.disabled)
</script>

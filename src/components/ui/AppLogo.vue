<template>
  <div class="flex items-center" :class="gaps[size]">
    <!-- Icon -->
    <div
      class="shrink-0 flex items-center justify-center"
      :class="[
        iconSizes[size],
        roundings[size],
        variant === 'light'
          ? 'bg-white/15 ring-1 ring-white/20 backdrop-blur-sm'
          : 'bg-gradient-to-br from-[#0a3d8a] via-[#0f62db] to-[#0f9d73] shadow-lg shadow-blue-600/30',
      ]"
    >
      <svg :class="svgSizes[size]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10.5" y="4" width="3" height="16" rx="1.5" fill="white"/>
        <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="white"/>
      </svg>
    </div>

    <!-- Text -->
    <div v-if="!iconOnly" class="leading-none">
      <p
        class="font-bold uppercase tracking-[0.18em]"
        :class="[subtitleSizes[size], variant === 'light' ? 'text-white/60' : 'text-slate-500']"
      >
        Sistema Público
      </p>
      <p
        class="font-extrabold tracking-tight"
        :class="[titleSizes[size], variant === 'light' ? 'text-white' : 'text-slate-900']"
      >
        Agendamento SUS
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'md' },   // 'sm' | 'md' | 'lg'
  variant: { type: String, default: 'dark' }, // 'dark' | 'light'
  iconOnly: { type: Boolean, default: false },
})

const gaps      = { sm: 'gap-2',    md: 'gap-3',   lg: 'gap-3.5' }
const iconSizes = { sm: 'h-8 w-8',  md: 'h-10 w-10', lg: 'h-12 w-12' }
const roundings = { sm: 'rounded-xl', md: 'rounded-2xl', lg: 'rounded-2xl' }
const svgSizes  = { sm: 'h-4 w-4',  md: 'h-5 w-5', lg: 'h-6 w-6' }
const subtitleSizes = { sm: 'text-[9px]', md: 'text-[10px]', lg: 'text-xs' }
const titleSizes    = { sm: 'text-sm mt-0.5', md: 'text-base mt-0.5', lg: 'text-lg mt-1' }
</script>

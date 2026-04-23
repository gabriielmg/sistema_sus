<template>
  <section :class="['section-panel', padded ? '' : 'p-0', className]">
    <header v-if="title || subtitle || $slots.header" class="mb-6 border-b border-slate-200/70 pb-5 dark:border-slate-800/80">
      <slot name="header">
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 v-if="title" class="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink dark:text-slate-50">
              {{ title }}
            </h2>
            <p v-if="subtitle" class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {{ subtitle }}
            </p>
          </div>
          <slot name="actions" />
        </div>
      </slot>
    </header>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  padded: {
    type: Boolean,
    default: true,
  },
  className: {
    type: String,
    default: '',
  },
})
</script>

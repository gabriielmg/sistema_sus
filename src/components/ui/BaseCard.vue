<template>
  <section :class="['section-panel', padded ? '' : 'p-0', className]">
    <header v-if="title || subtitle || $slots.header" class="mb-5">
      <slot name="header">
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 v-if="title" class="font-display text-xl font-semibold text-ink">
              {{ title }}
            </h2>
            <p v-if="subtitle" class="mt-1 text-sm text-slate-600">
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

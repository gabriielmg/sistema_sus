<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="presentation"
      >
        <div class="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" @click="handleCancel" />

        <section
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="descriptionId"
          class="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/20 dark:border-slate-700/80 dark:bg-slate-900"
        >
          <div class="absolute inset-x-0 top-0 h-1.5" :class="toneBarClass" />

          <div class="relative p-6 sm:p-7">
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" :class="toneIconWrapClass">
                <svg class="h-6 w-6" :class="toneIconClass" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path
                    v-if="tone === 'danger'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v2.25m0 3.75h.008v.008H12v-.008zm8.25-.75c0 4.556-3.694 8.25-8.25 8.25S3.75 18.806 3.75 14.25 7.444 6 12 6s8.25 3.694 8.25 8.25z"
                  />
                  <path
                    v-else-if="tone === 'success'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    v-else-if="tone === 'warning'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m0 3.75h.008v.008H12v-.008Zm8.146 1.354L13.854 4.646a2.25 2.25 0 0 0-3.708 0L3.854 18.354A2.25 2.25 0 0 0 5.708 21.75h12.584a2.25 2.25 0 0 0 1.854-3.396Z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.25 11.25 12 11.25v5.25h.75m7.5-4.5a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z"
                  />
                </svg>
              </div>

              <div class="min-w-0 flex-1">
                <h2 :id="titleId" class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {{ title }}
                </h2>
                <p :id="descriptionId" class="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {{ message }}
                </p>
              </div>
            </div>

            <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <BaseButton
                v-if="!hideCancel"
                variant="ghost"
                class="rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                @click="handleCancel"
              >
                {{ cancelLabel }}
              </BaseButton>
              <BaseButton
                :variant="confirmVariantResolved"
                class="rounded-xl shadow-lg"
                :class="confirmShadowClass"
                :loading="loading"
                @click="$emit('confirm')"
              >
                {{ confirmLabel }}
              </BaseButton>
            </div>
          </div>
        </section>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirmar acao',
  },
  message: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'info',
  },
  confirmLabel: {
    type: String,
    default: 'Confirmar',
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar',
  },
  hideCancel: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  confirmVariant: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const titleId = `alert-dialog-title-${Math.random().toString(36).slice(2)}`
const descriptionId = `alert-dialog-description-${Math.random().toString(36).slice(2)}`
const previousBodyOverflow = typeof document !== 'undefined' ? document.body.style.overflow : ''

const confirmVariantResolved = computed(() => {
  if (props.confirmVariant) return props.confirmVariant
  if (props.tone === 'danger') return 'danger'
  if (props.tone === 'success') return 'success'
  return 'primary'
})

const toneBarClassMap = {
  info: 'bg-susBlue',
  success: 'bg-susGreen',
  warning: 'bg-amber-500',
  danger: 'bg-rose-600',
}

const toneIconWrapClassMap = {
  info: 'bg-susBlue/10',
  success: 'bg-emerald-100',
  warning: 'bg-amber-100',
  danger: 'bg-rose-100',
}

const toneIconClassMap = {
  info: 'text-susBlue',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  danger: 'text-rose-600',
}

const confirmShadowClassMap = {
  primary: 'shadow-susBlue/20',
  success: 'shadow-emerald-500/20',
  danger: 'shadow-rose-500/20',
  secondary: 'shadow-slate-300/20',
  ghost: 'shadow-slate-300/20',
}

const toneBarClass = computed(() => toneBarClassMap[props.tone] ?? toneBarClassMap.info)
const toneIconWrapClass = computed(() => toneIconWrapClassMap[props.tone] ?? toneIconWrapClassMap.info)
const toneIconClass = computed(() => toneIconClassMap[props.tone] ?? toneIconClassMap.info)
const confirmShadowClass = computed(() => confirmShadowClassMap[confirmVariantResolved.value] ?? '')

watch(
  () => props.modelValue,
  (isOpen) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = isOpen ? 'hidden' : previousBodyOverflow
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = previousBodyOverflow
})

function handleCancel() {
  if (props.loading) return
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

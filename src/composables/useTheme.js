import { computed, readonly, ref } from 'vue'

export const THEME_STORAGE_KEY = 'agendamento-sus-theme'

const FALLBACK_THEME = 'light'
const VALID_THEMES = new Set(['light', 'dark'])
const theme = ref(resolveInitialTheme())

function resolveInitialTheme() {
  if (typeof window === 'undefined') {
    return FALLBACK_THEME
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return VALID_THEMES.has(storedTheme) ? storedTheme : FALLBACK_THEME
  } catch {
    return FALLBACK_THEME
  }
}

function applyTheme(nextTheme) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const isDark = nextTheme === 'dark'

  root.classList.toggle('dark', isDark)
  root.dataset.theme = isDark ? 'dark' : 'light'
}

function persistTheme(nextTheme) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  } catch {}
}

function normalizeTheme(nextTheme) {
  return VALID_THEMES.has(nextTheme) ? nextTheme : FALLBACK_THEME
}

function setTheme(nextTheme) {
  const normalizedTheme = normalizeTheme(nextTheme)

  theme.value = normalizedTheme
  applyTheme(normalizedTheme)
  persistTheme(normalizedTheme)
}

function toggleTheme() {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

export function initializeTheme() {
  const initialTheme = resolveInitialTheme()

  theme.value = initialTheme
  applyTheme(initialTheme)
}

export function useTheme() {
  return {
    theme: readonly(theme),
    isDark: computed(() => theme.value === 'dark'),
    setTheme,
    toggleTheme,
  }
}

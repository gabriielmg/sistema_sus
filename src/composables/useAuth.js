import { computed, ref } from 'vue'
import {
  assertSupabaseConfigured,
  ensureProfile,
  getHomeRouteByRole,
  getProfileByUserId,
  getRoleFromUser,
  getSession,
  normalizeProfile,
  supabase,
} from '@/services/supabase'
import { sanitizeCpf } from '@/utils/formatters'

const user = ref(null)
const profile = ref(null)
const authReady = ref(false)
const CPF_AUTH_DOMAIN = 'cpf.local'
let initialized = false

async function syncProfile(nextUser) {
  if (!nextUser) {
    profile.value = null
    return null
  }

  try {
    let nextProfile = await getProfileByUserId(nextUser.id)

    if (!nextProfile) {
      nextProfile = await ensureProfile({
        userId: nextUser.id,
        email: nextUser.email,
        fullName: nextUser.user_metadata?.full_name ?? '',
        cpf: nextUser.user_metadata?.cpf ?? '',
        phone: nextUser.phone ?? nextUser.user_metadata?.phone ?? '',
        unitId: nextUser.user_metadata?.unit_id ?? null,
        role: getRoleFromUser(nextUser),
      })
    }

    profile.value = normalizeProfile(nextProfile, nextUser)
    return profile.value
  } catch {
    profile.value = normalizeProfile(null, nextUser)
    return profile.value
  }
}

async function initializeAuth() {
  if (initialized) {
    return
  }

  initialized = true

  try {
    const session = await getSession()
    user.value = session?.user ?? null
    await syncProfile(user.value)
  } catch {
    user.value = null
    profile.value = null
  } finally {
    authReady.value = true
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null

    if (!session?.user) {
      profile.value = null
      authReady.value = true
      return
    }

    syncProfile(session.user)
      .catch(() => {
        profile.value = null
      })
      .finally(() => {
        authReady.value = true
      })
  })
}

export function useAuth() {
  initializeAuth()

  const role = computed(() => profile.value?.role ?? null)
  const homeRoute = computed(() => getHomeRouteByRole(role.value))

  async function signInWithPassword({ email, password }) {
    assertSupabaseConfigured()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    user.value = data.user
    const nextProfile = await syncProfile(data.user)

    return {
      user: data.user,
      profile: nextProfile,
      session: data.session,
    }
  }

  async function signUpWithPassword({ email, password, fullName, cpf }) {
    assertSupabaseConfigured()

    const normalizedCpf = normalizeRequiredCpf(cpf)
    const resolvedEmail = email || buildAuthEmailFromCpf(normalizedCpf)

    const { data, error } = await supabase.auth.signUp({
      email: resolvedEmail,
      password,
      options: {
        data: {
          full_name: String(fullName || '').trim(),
          cpf: normalizedCpf,
        },
      },
    })

    if (error) {
      throw mapAuthError(error)
    }

    if (data.user && !data.session) {
      throw new Error('Desative a confirmacao de email no Supabase para usar cadastro por CPF e senha.')
    }

    if (data.user && data.session?.user) {
      await ensureProfile({
        userId: data.user.id,
        email: data.user.email ?? resolvedEmail,
        fullName,
        role: getRoleFromUser(data.user),
        cpf: normalizedCpf,
        phone: data.user.phone ?? data.user.user_metadata?.phone ?? '',
        unitId: data.user.user_metadata?.unit_id ?? null,
      })
    }

    if (data.session?.user) {
      user.value = data.session.user
      await syncProfile(data.session.user)
    }

    return {
      user: data.user,
      session: data.session,
      profile: profile.value,
      requiresEmailConfirmation: false,
    }
  }

  async function signInWithCpf({ cpf, password }) {
    const normalizedCpf = normalizeRequiredCpf(cpf)

    return signInWithPassword({
      email: buildAuthEmailFromCpf(normalizedCpf),
      password,
    })
  }

  async function signUpWithCpf({ fullName, cpf, password }) {
    const trimmedFullName = String(fullName || '').trim()

    if (!trimmedFullName) {
      throw new Error('Informe o nome completo.')
    }

    if (trimmedFullName.split(/\s+/).length < 2) {
      throw new Error('Informe o nome completo com nome e sobrenome.')
    }

    if (String(password || '').length < 6) {
      throw new Error('A senha precisa ter pelo menos 6 caracteres.')
    }

    return signUpWithPassword({
      email: buildAuthEmailFromCpf(cpf),
      password,
      fullName: trimmedFullName,
      cpf,
    })
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    user.value = null
    profile.value = null
  }

  return {
    user,
    profile,
    role,
    homeRoute,
    authReady,
    isAuthenticated: computed(() => Boolean(user.value)),
    isAdmin: computed(() => role.value === 'admin'),
    signInWithPassword,
    signUpWithPassword,
    signInWithCpf,
    signUpWithCpf,
    logout,
    refreshProfile: () => syncProfile(user.value),
  }
}

function normalizeRequiredCpf(value = '') {
  const digits = sanitizeCpf(value)

  if (digits.length !== 11) {
    throw new Error('Informe um CPF com 11 digitos.')
  }

  return digits
}

function buildAuthEmailFromCpf(value = '') {
  const digits = sanitizeCpf(value)

  if (digits.length !== 11) {
    throw new Error('Informe um CPF com 11 digitos.')
  }

  return `${digits}@${CPF_AUTH_DOMAIN}`
}

function mapAuthError(error) {
  const message = String(error?.message || '')

  if (
    message.includes('User already registered') ||
    message.includes('already been registered') ||
    message.includes('duplicate key') ||
    message.includes('profiles_cpf_key')
  ) {
    return new Error('Ja existe uma conta cadastrada para este CPF.')
  }

  return error
}

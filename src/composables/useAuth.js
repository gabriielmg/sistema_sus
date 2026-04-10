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

const user = ref(null)
const profile = ref(null)
const authReady = ref(false)
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

  async function signUpWithPassword({ email, password, fullName }) {
    assertSupabaseConfigured()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      throw error
    }

    // Quando a confirmacao de email esta habilitada, o usuario ainda nao tem sessao.
    // Nesse caso o trigger do banco deve criar o profile apos o cadastro, e evitamos
    // um upsert bloqueado por RLS antes da confirmacao.
    if (data.user && data.session?.user) {
      await ensureProfile({
        userId: data.user.id,
        email: data.user.email,
        fullName,
        role: getRoleFromUser(data.user),
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
      requiresEmailConfirmation: Boolean(data.user && !data.session),
    }
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
    logout,
    refreshProfile: () => syncProfile(user.value),
  }
}

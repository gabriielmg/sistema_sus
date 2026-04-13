import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const TABLES = {
  profiles: 'profiles',
  units: 'units',
  doctors: 'doctors',
  specialties: 'specialties',
  schedules: 'schedules',
  appointments: 'appointments',
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env antes de usar autenticacao ou banco.',
    )
  }

  const projectRefFromUrl = getProjectRefFromUrl(supabaseUrl)

  if (!projectRefFromUrl || projectRefFromUrl === 'your-project-id' || supabaseUrl.includes('placeholder')) {
    throw new Error(
      'O VITE_SUPABASE_URL ainda esta com valor de exemplo. Substitua pelo host real do seu projeto Supabase.',
    )
  }

  const projectRefFromKey = getProjectRefFromAnonKey(supabaseAnonKey)

  if (projectRefFromKey && projectRefFromUrl !== projectRefFromKey) {
    throw new Error(
      'A URL do Supabase e a anon key pertencem a projetos diferentes. Revise o arquivo .env.',
    )
  }
}

function getProjectRefFromUrl(url) {
  try {
    return new URL(url).hostname.split('.')[0] ?? ''
  } catch {
    return ''
  }
}

function getProjectRefFromAnonKey(token) {
  try {
    const payload = token.split('.')[1]

    if (!payload) {
      return ''
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    const decoded = JSON.parse(atob(padded))

    return decoded?.ref ?? ''
  } catch {
    return ''
  }
}

export function getHomeRouteByRole(role = 'paciente') {
  return role === 'admin' || role === 'gestor' ? '/admin' : '/paciente'
}

export function getRoleFromUser(user) {
  return user?.app_metadata?.role ?? user?.user_metadata?.role ?? 'paciente'
}

export function normalizeProfile(rawProfile = {}, fallbackUser = null) {
  if (!rawProfile?.id && !fallbackUser?.id) {
    return null
  }

  return {
    id: rawProfile.id ?? fallbackUser?.id ?? null,
    email: rawProfile.email ?? fallbackUser?.email ?? '',
    cpf: rawProfile.cpf ?? fallbackUser?.user_metadata?.cpf ?? '',
    phone: rawProfile.phone ?? fallbackUser?.phone ?? fallbackUser?.user_metadata?.phone ?? '',
    unit_id: rawProfile.unit_id ?? fallbackUser?.user_metadata?.unit_id ?? null,
    full_name:
      rawProfile.full_name ??
      fallbackUser?.user_metadata?.full_name ??
      fallbackUser?.user_metadata?.name ??
      '',
    role: rawProfile.role ?? getRoleFromUser(fallbackUser),
    created_at: rawProfile.created_at ?? null,
    updated_at: rawProfile.updated_at ?? null,
  }
}

export async function getSession() {
  assertSupabaseConfigured()

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return session
}

export async function getProfileByUserId(userId) {
  if (!userId) {
    return null
  }

  assertSupabaseConfigured()

  const { data, error } = await supabase
    .from(TABLES.profiles)
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return normalizeProfile(data)
}

export async function ensureProfile({
  userId,
  email,
  fullName = '',
  role = 'paciente',
  cpf = '',
  phone = '',
  unitId = null,
}) {
  assertSupabaseConfigured()

  const payload = {
    id: userId,
    email,
    full_name: fullName,
    role,
    cpf,
    phone,
    unit_id: unitId,
  }

  let { error } = await supabase
    .from(TABLES.profiles)
    .upsert(payload, { onConflict: 'id' })

  if (error?.code === '42703' && error.message?.includes('full_name')) {
    const retry = await supabase
      .from(TABLES.profiles)
      .upsert(
        {
          id: userId,
          role,
        },
        { onConflict: 'id' },
      )

    error = retry.error
  }

  if (error) {
    throw error
  }

  const profile = await getProfileByUserId(userId)
  return profile ?? normalizeProfile({ id: userId, full_name: fullName, role }, { id: userId, email })
}

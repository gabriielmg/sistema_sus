export function sanitizeCep(value = '') {
  return String(value).replace(/\D/g, '').slice(0, 8)
}

export function formatCep(value = '') {
  const cep = sanitizeCep(value)

  if (cep.length <= 5) {
    return cep
  }

  return `${cep.slice(0, 5)}-${cep.slice(5)}`
}

export function formatDateTime(value) {
  if (!value) {
    return '--'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatDate(value) {
  if (!value) {
    return '--'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  }).format(date)
}

export function formatTime(value) {
  if (!value) {
    return '--'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    timeStyle: 'short',
  }).format(date)
}

export function formatDistance(km) {
  if (!Number.isFinite(km)) {
    return 'Distancia indisponivel'
  }

  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  }

  return `${km.toFixed(1)} km`
}

export function formatCpf(value = '') {
  const digits = String(value).replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function formatPhone(value = '') {
  const digits = String(value).replace(/\D/g, '').slice(-11)

  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function buildUnitAddress(unit = {}) {
  const parts = [
    unit.street,
    unit.neighborhood,
    unit.city,
    unit.state,
  ].filter(Boolean)

  return parts.join(', ')
}

export function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)

  if (!parts.length) {
    return 'US'
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

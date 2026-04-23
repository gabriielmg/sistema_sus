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

export function sanitizeCpf(value = '') {
  return String(value).replace(/\D/g, '').slice(0, 11)
}

export function formatCpf(value = '') {
  const digits = sanitizeCpf(value)

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
    [unit.street, unit.residence_number || unit.residenceNumber].filter(Boolean).join(', '),
    unit.neighborhood,
    unit.city,
    unit.state,
  ].filter(Boolean)

  return parts.join(', ')
}

export const OPERATING_WEEKDAY_LABELS = [
  'Domingo',
  'Segunda',
  'Terca',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sabado',
]

export const OPERATING_WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

export function getWeekdayLabel(weekday) {
  return OPERATING_WEEKDAY_LABELS[Number(weekday)] ?? 'Dia'
}

export function sortOperatingHours(hours = []) {
  const orderMap = new Map(OPERATING_WEEKDAY_ORDER.map((weekday, index) => [weekday, index]))

  return [...hours].sort((left, right) => {
    return (orderMap.get(Number(left?.weekday)) ?? 99) - (orderMap.get(Number(right?.weekday)) ?? 99)
  })
}

export function createDefaultOperatingHours() {
  return OPERATING_WEEKDAY_ORDER.map((weekday) => ({
    weekday,
    opens_at: '08:00',
    closes_at: '17:00',
    is_closed: weekday === 0,
  }))
}

export function mergeOperatingHours(hours = []) {
  const sourceMap = new Map(hours.map((entry) => [Number(entry?.weekday), entry]))

  return createDefaultOperatingHours().map((entry) => {
    const source = sourceMap.get(Number(entry.weekday))

    if (!source) {
      return { ...entry }
    }

    return {
      ...entry,
      ...source,
      weekday: Number(source.weekday ?? entry.weekday),
      opens_at: String(source.opens_at ?? entry.opens_at).slice(0, 5),
      closes_at: String(source.closes_at ?? entry.closes_at).slice(0, 5),
      is_closed: Boolean(source.is_closed),
    }
  })
}

export function formatOperatingHourRange(entry) {
  if (!entry || entry.is_closed) {
    return 'Fechado'
  }

  const opensAt = String(entry.opens_at ?? '').slice(0, 5)
  const closesAt = String(entry.closes_at ?? '').slice(0, 5)

  if (!opensAt || !closesAt) {
    return 'Horario nao informado'
  }

  return `${opensAt} - ${closesAt}`
}

export function getOperatingHoursForWeekday(hours = [], weekday = new Date().getDay()) {
  return mergeOperatingHours(hours).find((entry) => Number(entry.weekday) === Number(weekday)) ?? null
}

export function formatTodayOperatingHours(hours = [], date = new Date()) {
  const today = getOperatingHoursForWeekday(hours, date.getDay())

  if (!today) {
    return 'Horario nao informado'
  }

  return `${getWeekdayLabel(today.weekday)}: ${formatOperatingHourRange(today)}`
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

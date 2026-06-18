import type { Worker, ClientBrief, Booking, Market } from './types'

function parseArr(raw: string): string[] {
  try { return JSON.parse(raw) } catch { return [] }
}

function toArr(arr: string[]): string {
  return JSON.stringify(arr)
}

function isoStr(d: Date | null | undefined): string {
  return d ? d.toISOString() : new Date().toISOString()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseWorker(r: any): Worker {
  return {
    id: r.id,
    created_at: isoStr(r.created_at),
    full_name: r.full_name,
    email: r.email,
    phone: r.phone ?? null,
    city: r.city ?? null,
    country: r.country ?? null,
    markets: parseArr(r.markets),
    roles: parseArr(r.roles),
    experience: r.experience ?? null,
    events_worked: r.events_worked ?? null,
    availability: parseArr(r.availability),
    international: r.international,
    languages: r.languages ?? null,
    right_to_work_uk: r.right_to_work_uk,
    heard_from: r.heard_from ?? null,
    cv_url: r.cv_url ?? null,
    status: r.status,
    tier: r.tier ?? null,
    notes: r.notes ?? null,
    rating: r.rating,
    date_available: r.date_available ?? null,
    emergency_contact: r.emergency_contact ?? null,
    bank_details_provided: r.bank_details_provided,
    deel_contract_active: r.deel_contract_active,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseBrief(r: any): ClientBrief {
  return {
    id: r.id,
    created_at: isoStr(r.created_at),
    full_name: r.full_name,
    company: r.company ?? null,
    email: r.email,
    phone: r.phone ?? null,
    event_name: r.event_name ?? null,
    event_type: r.event_type ?? null,
    event_date: r.event_date ?? null,
    event_end_date: r.event_end_date ?? null,
    location: r.location ?? null,
    country: r.country ?? null,
    staff_count: r.staff_count ?? null,
    roles: parseArr(r.roles),
    budget: r.budget ?? null,
    information: r.information ?? null,
    deposit_agreed: r.deposit_agreed,
    status: r.status,
    notes: r.notes ?? null,
    assigned_workers: parseArr(r.assigned_workers),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseBooking(r: any): Booking {
  return {
    id: r.id,
    created_at: isoStr(r.created_at),
    brief_id: r.brief_id ?? null,
    event_name: r.event_name ?? null,
    event_date: r.event_date ?? null,
    event_end_date: r.event_end_date ?? null,
    location: r.location ?? null,
    country: r.country ?? null,
    client_name: r.client_name ?? null,
    client_company: r.client_company ?? null,
    client_email: r.client_email ?? null,
    workers: parseArr(r.workers),
    total_invoice_value: r.total_invoice_value ?? null,
    worker_cost: r.worker_cost ?? null,
    margin: r.margin ?? null,
    deposit_amount: r.deposit_amount ?? null,
    deposit_paid: r.deposit_paid,
    invoice_sent: r.invoice_sent,
    invoice_paid: r.invoice_paid,
    factoring_used: r.factoring_used,
    status: r.status,
    notes: r.notes ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseMarket(r: any): Market {
  return {
    id: r.id,
    country: r.country,
    status: r.status,
    upcoming_events: r.upcoming_events ?? null,
    notes: r.notes ?? null,
  }
}

export function workerCreateData(fields: {
  full_name: string
  email: string
  phone: string | null
  city: string | null
  country: string | null
  markets: string[]
  roles: string[]
  experience: string | null
  events_worked: string | null
  availability: string[]
  international: boolean
  languages: string | null
  right_to_work_uk: boolean
  heard_from: string | null
  cv_url: string | null
}) {
  return {
    ...fields,
    markets: toArr(fields.markets),
    roles: toArr(fields.roles),
    availability: toArr(fields.availability),
  }
}

export function briefCreateData(fields: {
  full_name: string
  company: string | null
  email: string
  phone: string | null
  event_name: string | null
  event_type: string | null
  event_date: string | null
  event_end_date: string | null
  location: string | null
  country: string | null
  staff_count: string | null
  roles: string[]
  budget: string | null
  information: string | null
  deposit_agreed: boolean
}) {
  return {
    ...fields,
    roles: toArr(fields.roles),
  }
}

export function serializeArrayFields(
  body: Record<string, unknown>,
  arrayKeys: string[]
): Record<string, unknown> {
  const result = { ...body }
  for (const key of arrayKeys) {
    if (Array.isArray(result[key])) {
      result[key] = toArr(result[key] as string[])
    }
  }
  return result
}

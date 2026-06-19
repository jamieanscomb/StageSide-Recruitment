import type { Worker, ClientBrief, Booking, Market } from './types'

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
    markets: r.markets ?? [],
    roles: r.roles ?? [],
    experience: r.experience ?? null,
    events_worked: r.events_worked ?? null,
    availability: r.availability ?? [],
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
    telegram_chat_id: r.telegram_chat_id ?? null,
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
    roles: r.roles ?? [],
    budget: r.budget ?? null,
    information: r.information ?? null,
    deposit_agreed: r.deposit_agreed,
    status: r.status,
    notes: r.notes ?? null,
    assigned_workers: r.assigned_workers ?? [],
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
    workers: r.workers ?? [],
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

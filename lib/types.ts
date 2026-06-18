export type WorkerStatus = 'Applied' | 'Vetted' | 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Rejected'
export type WorkerTier = 'Tier 1' | 'Tier 2' | 'Tier 3' | null
export type BriefStatus = 'New' | 'In Discussion' | 'Quoted' | 'Booked' | 'Declined'
export type BookingStatus = 'Confirmed' | 'Completed' | 'Cancelled'
export type MarketStatus = 'Active' | 'Building' | 'Planned'

export interface Worker {
  id: string
  created_at: string
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
  status: WorkerStatus
  tier: WorkerTier
  notes: string | null
  rating: number
  date_available: string | null
  emergency_contact: string | null
  bank_details_provided: boolean
  deel_contract_active: boolean
}

export interface ClientBrief {
  id: string
  created_at: string
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
  deposit_agreed: boolean
  information: string | null
  status: BriefStatus
  notes: string | null
  assigned_workers: string[]
}

export interface Booking {
  id: string
  created_at: string
  brief_id: string | null
  event_name: string | null
  event_date: string | null
  event_end_date: string | null
  location: string | null
  country: string | null
  client_name: string | null
  client_company: string | null
  client_email: string | null
  workers: string[]
  total_invoice_value: number | null
  worker_cost: number | null
  margin: number | null
  deposit_amount: number | null
  deposit_paid: boolean
  invoice_sent: boolean
  invoice_paid: boolean
  factoring_used: boolean
  status: BookingStatus
  notes: string | null
}

export interface Market {
  id: string
  country: string
  status: MarketStatus
  upcoming_events: string | null
  notes: string | null
}

export interface WorkerFormData {
  full_name: string
  email: string
  phone: string
  city: string
  country: string
  markets: string[]
  roles: string[]
  experience: string
  events_worked: string
  availability: string[]
  international: string
  languages: string
  right_to_work_uk: string
  right_to_work_eu: string
  heard_from: string
  cv?: File
}

export interface BriefFormData {
  full_name: string
  company: string
  email: string
  phone: string
  event_name: string
  event_type: string
  event_date: string
  event_end_date: string
  location: string
  country: string
  staff_count: string
  roles: string[]
  budget: string
  information: string
  deposit_agreed: boolean
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

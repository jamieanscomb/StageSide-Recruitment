import { WorkerStatus, BriefStatus } from './types'

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function workerStatusStyle(status: WorkerStatus): string {
  switch (status) {
    case 'Applied':
      return 'border border-[#555] text-[#555]'
    case 'Vetted':
      return 'border border-accent text-accent'
    case 'Tier 1':
      return 'bg-accent text-background'
    case 'Tier 2':
      return 'bg-elevated border border-accent text-accent'
    case 'Tier 3':
      return 'bg-elevated border border-body text-body'
    case 'Rejected':
      return 'bg-danger text-heading'
    default:
      return 'border border-muted text-muted'
  }
}

export function briefStatusStyle(status: BriefStatus): string {
  switch (status) {
    case 'New':
      return 'text-accent'
    case 'In Discussion':
      return 'text-[#FF8C00]'
    case 'Quoted':
      return 'text-body'
    case 'Booked':
      return 'text-success'
    case 'Declined':
      return 'text-danger'
    default:
      return 'text-muted'
  }
}

export function getAdminPassword(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('stageside_admin_pass') || ''
  }
  return ''
}

export function adminHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAdminPassword()}`,
  }
}

export function truncate(str: string | null, length: number): string {
  if (!str) return '—'
  if (str.length <= length) return str
  return str.slice(0, length) + '…'
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

function authCheck(req: NextRequest): boolean {
  const auth = req.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServerClient()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 25
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const country = searchParams.get('country') || ''
  const eventType = searchParams.get('event_type') || ''

  let query = supabase.from('client_briefs').select('*', { count: 'exact' })

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,company.ilike.%${search}%,event_name.ilike.%${search}%`)
  }
  if (status) query = query.eq('status', status)
  if (country) query = query.eq('country', country)
  if (eventType) query = query.eq('event_type', eventType)

  query = query.order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count })
}

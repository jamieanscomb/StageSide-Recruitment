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
  const role = searchParams.get('role') || ''
  const market = searchParams.get('market') || ''
  const international = searchParams.get('international') || ''

  let query = supabase.from('workers').select('*', { count: 'exact' })

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,city.ilike.%${search}%`)
  }
  if (status) query = query.eq('status', status)
  if (role) query = query.contains('roles', [role])
  if (market) query = query.contains('markets', [market])
  if (international === 'Yes') query = query.eq('international', true)
  if (international === 'No') query = query.eq('international', false)

  query = query.order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count })
}

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

  const [marketsRes, workersRes] = await Promise.all([
    supabase.from('markets').select('*').order('country'),
    supabase.from('workers').select('country, tier, markets'),
  ])

  if (marketsRes.error) return NextResponse.json({ error: marketsRes.error.message }, { status: 500 })

  const workers = workersRes.data || []
  const marketCountryMap: Record<string, string> = {
    'United Kingdom': 'UK',
    'Ireland': 'Ireland',
    'Ibiza': 'Ibiza / Spain',
    'Croatia': 'Croatia',
    'Netherlands': 'Netherlands',
    'Belgium': 'Belgium',
  }

  const enriched = (marketsRes.data || []).map(m => {
    const marketKey = marketCountryMap[m.country] || m.country
    const marketWorkers = workers.filter(w =>
      (w.markets || []).some((mk: string) => mk === marketKey || mk === m.country)
    )
    const tierBreakdown = {
      'Tier 1': marketWorkers.filter(w => w.tier === 'Tier 1').length,
      'Tier 2': marketWorkers.filter(w => w.tier === 'Tier 2').length,
      'Tier 3': marketWorkers.filter(w => w.tier === 'Tier 3').length,
    }
    return { ...m, workerCount: marketWorkers.length, tierBreakdown }
  })

  return NextResponse.json({ data: enriched })
}

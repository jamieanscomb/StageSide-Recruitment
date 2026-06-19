import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function authCheck(req: NextRequest): boolean {
  const auth = req.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

const DEFAULT_MARKETS = [
  { country: 'United Kingdom', status: 'Active' },
  { country: 'Ireland', status: 'Active' },
  { country: 'Ibiza', status: 'Active' },
  { country: 'Croatia', status: 'Active' },
  { country: 'Netherlands', status: 'Building' },
  { country: 'Belgium', status: 'Building' },
]

const MARKET_KEYS: Record<string, string> = {
  'United Kingdom': 'UK',
  'Ireland': 'Ireland',
  'Ibiza': 'Ibiza / Spain',
  'Croatia': 'Croatia',
  'Netherlands': 'Netherlands',
  'Belgium': 'Belgium',
}

export async function GET(req: NextRequest) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.market.count()
  if (existing === 0) {
    await prisma.market.createMany({ data: DEFAULT_MARKETS })
  }

  const [markets, workers] = await Promise.all([
    prisma.market.findMany({ orderBy: { country: 'asc' } }),
    prisma.worker.findMany({ select: { tier: true, markets: true } }),
  ])

  const enriched = markets.map(m => {
    const marketKey = MARKET_KEYS[m.country] || m.country
    const marketWorkers = workers.filter(w =>
      (w.markets ?? []).some(mk => mk === marketKey || mk === m.country)
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

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseWorker } from '@/lib/db'
import { Prisma } from '@prisma/client'

function authCheck(req: NextRequest): boolean {
  const auth = req.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 25
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const role = searchParams.get('role') || ''
  const market = searchParams.get('market') || ''
  const international = searchParams.get('international') || ''

  const where: Prisma.WorkerWhereInput = {}

  if (search) {
    where.OR = [
      { full_name: { contains: search } },
      { email: { contains: search } },
      { city: { contains: search } },
    ]
  }
  if (status) where.status = status
  if (role) where.roles = { contains: role }
  if (market) where.markets = { contains: market }
  if (international === 'Yes') where.international = true
  if (international === 'No') where.international = false

  const [rows, count] = await Promise.all([
    prisma.worker.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.worker.count({ where }),
  ])

  return NextResponse.json({ data: rows.map(parseWorker), count })
}

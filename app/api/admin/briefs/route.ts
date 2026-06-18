import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseBrief } from '@/lib/db'
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
  const country = searchParams.get('country') || ''
  const eventType = searchParams.get('event_type') || ''

  const where: Prisma.ClientBriefWhereInput = {}

  if (search) {
    where.OR = [
      { full_name: { contains: search } },
      { company: { contains: search } },
      { event_name: { contains: search } },
    ]
  }
  if (status) where.status = status
  if (country) where.country = country
  if (eventType) where.event_type = eventType

  const [rows, count] = await Promise.all([
    prisma.clientBrief.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.clientBrief.count({ where }),
  ])

  return NextResponse.json({ data: rows.map(parseBrief), count })
}

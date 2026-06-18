import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseBooking, serializeArrayFields } from '@/lib/db'

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

  const [rows, count] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.booking.count(),
  ])

  return NextResponse.json({ data: rows.map(parseBooking), count })
}

export async function POST(req: NextRequest) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const data = serializeArrayFields(body, ['workers'])
  const record = await prisma.booking.create({ data: data as Parameters<typeof prisma.booking.create>[0]['data'] })
  return NextResponse.json({ success: true, data: parseBooking(record) })
}

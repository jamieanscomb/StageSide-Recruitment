import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function authCheck(req: NextRequest): boolean {
  const auth = req.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  await prisma.worker.update({ where: { id: params.id }, data: body })
  return NextResponse.json({ success: true })
}

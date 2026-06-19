import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramMessage } from '@/lib/telegram'
import { parseWorker } from '@/lib/db'

function authCheck(req: NextRequest): boolean {
  const auth = req.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { worker_id, message_type, payload = {} } = await req.json()
  const raw = await prisma.worker.findUnique({ where: { id: worker_id } })
  if (!raw?.telegram_chat_id) return NextResponse.json({ ok: true, sent: false })

  const w = parseWorker(raw)
  const chatId = raw.telegram_chat_id
  let message = ''

  switch (message_type) {
    case 'welcome':
      message = `🎉 *Welcome to the Stageside Roster*\n\nHi ${w.full_name}, you've been approved and added to our worker network.\n\nYou'll receive shift offers directly here. Reply /shifts at any time to check your status.\n\nQuestions? Email info@stagesiderecruitment.co.uk`
      break
    case 'shift_offer':
      message = `🎵 *Shift Available — ${payload.event_name || 'Upcoming Event'}*\n\n📅 Date: ${payload.event_date || '—'}\n📍 Location: ${payload.location || '—'}\n💼 Role: ${payload.role || '—'}\n💷 Rate: ${payload.rate || '—'}\n\nReply *ACCEPT* or *DECLINE* within 2 hours to confirm.`
      break
    case 'status_update': {
      const status = payload.status || w.status
      message = `✅ *Roster Update*\n\nHi ${w.full_name}, your Stageside status has been updated to *${status}*.`
      if (status === 'Tier 1') message += `\n\nYou're now on our priority list for all bookings. Expect regular shift offers.`
      if (status === 'Rejected') message += `\n\nUnfortunately we can't place you on our roster at this time. You're welcome to reapply in future.`
      break
    }
    case 'payment_sent':
      message = `💷 *Payment Processed*\n\nHi ${w.full_name}, your payment for *${payload.event_name || 'your shift'}* has been sent via Deel.\n\nAmount: ${payload.amount || '—'}\nReference: ${payload.reference || '—'}\n\nAllow 1-3 working days for it to arrive in your account.`
      break
    default:
      return NextResponse.json({ error: 'Unknown message_type' }, { status: 400 })
  }

  await sendTelegramMessage(chatId, message)
  return NextResponse.json({ ok: true, sent: true })
}

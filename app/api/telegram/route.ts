import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramMessage } from '@/lib/telegram'
import { parseWorker } from '@/lib/db'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()
    const message = update?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId = String(message.chat?.id)
    const text = (message.text || '').trim()

    if (text === '/start') {
      await sendTelegramMessage(chatId,
        `👋 Welcome to the *Stageside Recruitment* bot.\n\nReply with your email address to link your account and receive shift offers directly here.\n\nNot applied yet? Visit stagesiderecruitment.co.uk/join`
      )
      return NextResponse.json({ ok: true })
    }

    if (text === '/help') {
      await sendTelegramMessage(chatId,
        `*Stageside Recruitment Bot*\n\nAvailable commands:\n/shifts — check your roster status\n/help — show this message\n\nQuestions? Email info@stagesiderecruitment.co.uk`
      )
      return NextResponse.json({ ok: true })
    }

    if (text === '/shifts') {
      const raw = await prisma.worker.findFirst({ where: { telegram_chat_id: chatId } })
      if (!raw) {
        await sendTelegramMessage(chatId, `We couldn't find your account. Reply with your email address to link it.`)
        return NextResponse.json({ ok: true })
      }
      const w = parseWorker(raw)
      await sendTelegramMessage(chatId,
        `🎵 *Your Stageside Status*\n\nName: ${w.full_name}\nStatus: ${w.status}${w.tier ? `\nTier: ${w.tier}` : ''}\nMarkets: ${w.markets.join(', ') || '—'}\nRoles: ${w.roles.join(', ') || '—'}\n\nWe'll message you here when a shift comes up in your markets.`
      )
      return NextResponse.json({ ok: true })
    }

    if (EMAIL_RE.test(text)) {
      const raw = await prisma.worker.findFirst({ where: { email: text.toLowerCase() } })
      if (!raw) {
        await sendTelegramMessage(chatId,
          `❌ We couldn't find an application with that email address.\n\nApply to join our roster at stagesiderecruitment.co.uk/join and then come back here to link your account.`
        )
        return NextResponse.json({ ok: true })
      }
      await prisma.worker.update({ where: { id: raw.id }, data: { telegram_chat_id: chatId } })
      await sendTelegramMessage(chatId,
        `✅ *Account linked successfully.*\n\nHi ${raw.full_name}, you're now connected to the Stageside roster.\n\nYou'll receive shift offers, status updates and payment confirmations here.\n\nReply /help at any time to see available commands.`
      )
      return NextResponse.json({ ok: true })
    }

    await sendTelegramMessage(chatId,
      `*Stageside Recruitment Bot*\n\nAvailable commands:\n/shifts — check your roster status\n/help — show this message\n\nQuestions? Email info@stagesiderecruitment.co.uk`
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Telegram webhook error:', err)
    return NextResponse.json({ ok: true })
  }
}

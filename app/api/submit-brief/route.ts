import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramMessage } from '@/lib/telegram'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const record = await prisma.clientBrief.create({
      data: {
        full_name: body.full_name,
        company: body.company || null,
        email: body.email,
        phone: body.phone || null,
        event_name: body.event_name || null,
        event_type: body.event_type || null,
        event_date: body.event_date || null,
        event_end_date: body.event_end_date || null,
        location: body.location || null,
        country: body.country || null,
        staff_count: body.staff_count || null,
        roles: body.roles || [],
        budget: body.budget || null,
        information: body.information || null,
        deposit_agreed: body.deposit_agreed || false,
      },
    })

    const adminEmail = process.env.ADMIN_EMAIL || 'info@stagesiderecruitment.co.uk'

    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID
    if (adminChatId) {
      await sendTelegramMessage(adminChatId,
        `📋 *New Brief Submitted*\n\n*Contact:* ${body.full_name}\n*Company:* ${body.company || '—'}\n*Event:* ${body.event_name || '—'}\n*Date:* ${body.event_date || '—'}\n*Location:* ${body.location || '—'}, ${body.country || '—'}\n*Staff Needed:* ${body.staff_count || '—'}\n*Roles:* ${(body.roles || []).join(', ') || '—'}\n*Budget:* ${body.budget || '—'}\n\nReview in admin dashboard.`
      )
    }

    await Promise.allSettled([
      resend.emails.send({
        from: 'Stageside Recruitment <noreply@stagesiderecruitment.co.uk>',
        to: body.email,
        subject: `Brief received — ${body.event_name || 'Your event'}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2>Thanks ${body.full_name},</h2>
            <p>We've received your brief for <strong>${body.event_name || 'your event'}</strong>.</p>
            <p>We'll be in touch within 24 hours with availability and a quote.</p>
            <br/>
            <p style="color: #999;">Stageside Recruitment<br/>stagesiderecruitment.co.uk</p>
          </div>
        `,
      }),
      resend.emails.send({
        from: 'Stageside Recruitment <noreply@stagesiderecruitment.co.uk>',
        to: adminEmail,
        subject: `New brief: ${body.event_name || 'Untitled'} — ${body.full_name}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2>New Client Brief Received</h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Name</strong></td><td style="padding:8px;">${body.full_name}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Company</strong></td><td style="padding:8px;">${body.company || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email</strong></td><td style="padding:8px;">${body.email}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Phone</strong></td><td style="padding:8px;">${body.phone || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Event</strong></td><td style="padding:8px;">${body.event_name || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Event Type</strong></td><td style="padding:8px;">${body.event_type || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Date</strong></td><td style="padding:8px;">${body.event_date || '—'}${body.event_end_date ? ` to ${body.event_end_date}` : ''}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Location</strong></td><td style="padding:8px;">${body.location || '—'}, ${body.country || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Staff Needed</strong></td><td style="padding:8px;">${body.staff_count || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Roles</strong></td><td style="padding:8px;">${(body.roles || []).join(', ') || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Budget</strong></td><td style="padding:8px;">${body.budget || '—'}</td></tr>
              <tr><td style="padding:8px;"><strong>Additional Info</strong></td><td style="padding:8px;">${body.information || '—'}</td></tr>
            </table>
          </div>
        `,
      }),
    ])

    return NextResponse.json({ success: true, id: record.id })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

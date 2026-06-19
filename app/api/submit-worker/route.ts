import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramMessage } from '@/lib/telegram'
import { Resend } from 'resend'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()

    const get = (key: string) => fd.get(key) as string | null
    const getArr = (key: string): string[] => {
      const raw = get(key)
      if (!raw) return []
      try { return JSON.parse(raw) } catch { return [] }
    }

    const internationalStr = get('international') || ''
    const rightUk = get('right_to_work_uk') || ''

    let cvUrl: string | null = null
    const cvFile = fd.get('cv') as File | null
    if (cvFile && cvFile.size > 0) {
      const safeName = `${Date.now()}-${cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs')
      await mkdir(uploadDir, { recursive: true })
      const buffer = Buffer.from(await cvFile.arrayBuffer())
      await writeFile(path.join(uploadDir, safeName), buffer)
      cvUrl = `/uploads/cvs/${safeName}`
    }

    const record = await prisma.worker.create({
      data: {
        full_name: get('full_name') || '',
        email: get('email') || '',
        phone: get('phone') || null,
        city: get('city') || null,
        country: get('country') || null,
        markets: getArr('markets'),
        roles: getArr('roles'),
        experience: get('experience') || null,
        events_worked: get('events_worked') || null,
        availability: getArr('availability'),
        international: internationalStr === 'Yes' || internationalStr === 'Sometimes',
        languages: get('languages') || null,
        right_to_work_uk: rightUk === 'Yes',
        heard_from: get('heard_from') || null,
        cv_url: cvUrl,
      },
    })

    const fullName = get('full_name') || ''
    const email = get('email') || ''
    const adminEmail = process.env.ADMIN_EMAIL || 'info@stagesiderecruitment.co.uk'

    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID
    if (adminChatId) {
      await sendTelegramMessage(adminChatId,
        `👤 *New Worker Application*\n\n*Name:* ${fullName}\n*Email:* ${email}\n*Location:* ${get('city') || '—'}, ${get('country') || '—'}\n*Roles:* ${getArr('roles').join(', ') || '—'}\n*Markets:* ${getArr('markets').join(', ') || '—'}\n*Experience:* ${get('experience') || '—'}\n*International:* ${internationalStr || 'No'}\n\nReview in admin dashboard.`
      )
    }

    await Promise.allSettled([
      resend.emails.send({
        from: 'Stageside Recruitment <noreply@stagesiderecruitment.co.uk>',
        to: email,
        subject: 'Application received — Stageside Recruitment',
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2>Thanks ${fullName},</h2>
            <p>Your application to join the Stageside roster has been received.</p>
            <p>We review all applications within 5 working days and will be in touch if we'd like to arrange a call.</p>
            <br/>
            <p style="color: #999;">Stageside Recruitment<br/>stagesiderecruitment.co.uk</p>
          </div>
        `,
      }),
      resend.emails.send({
        from: 'Stageside Recruitment <noreply@stagesiderecruitment.co.uk>',
        to: adminEmail,
        subject: `New worker application — ${fullName}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2>New Worker Application</h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Name</strong></td><td style="padding:8px;">${fullName}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email</strong></td><td style="padding:8px;">${email}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Phone</strong></td><td style="padding:8px;">${get('phone') || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>City</strong></td><td style="padding:8px;">${get('city') || '—'}, ${get('country') || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Markets</strong></td><td style="padding:8px;">${getArr('markets').join(', ') || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Roles</strong></td><td style="padding:8px;">${getArr('roles').join(', ') || '—'}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Experience</strong></td><td style="padding:8px;">${get('experience') || '—'}</td></tr>
              <tr><td style="padding:8px;"><strong>CV</strong></td><td style="padding:8px;">${cvUrl ? `Uploaded: ${cvUrl}` : 'Not provided'}</td></tr>
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

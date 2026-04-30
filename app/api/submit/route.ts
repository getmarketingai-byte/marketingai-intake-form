import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, businessName, website, industry, marketingSpend, challenge, timeline } = body

  if (!email || !businessName || !industry || !marketingSpend || !challenge || !timeline) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'getmarketingai@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'aoegqisuhzyeaqtd',
    },
  })

  const nl = String.fromCharCode(10)
  const emailBody = 'New Pre-Call Intake Submission' + nl
    + '===============================' + nl + nl
    + 'Email:           ' + email + nl
    + 'Business Name:   ' + businessName + nl
    + 'Website:         ' + (website || '(not provided)') + nl
    + 'Industry:        ' + industry + nl
    + 'Marketing Spend: ' + marketingSpend + nl
    + 'Challenge:       ' + challenge + nl
    + 'Timeline:        ' + timeline + nl + nl
    + 'Submitted:       ' + new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })

  await transporter.sendMail({
    from: 'MarketingAI Intake <getmarketingai@gmail.com>',
    to: 'getmarketingai@gmail.com',
    subject: 'New intake: ' + businessName + ' - ' + timeline,
    text: emailBody,
  })

  try {
    await fetch('https://assets.mailerlite.com/jsonp/2282416/forms/185339817098216933/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'fields[email]': email,
        'fields[name]': businessName,
        ml_submit: '1',
        anticsrf: 'true',
      }).toString(),
    })
  } catch (_e) { /* MailerLite failure is non-fatal */ }

  return NextResponse.json({ ok: true })
}
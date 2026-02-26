import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// GET - Get all replies for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const replies = await prisma.ticketReply.findMany({
      where: { ticketId: params.id },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(replies)
  } catch (error) {
    console.error('Error fetching replies:', error)
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 })
  }
}

// POST - Create a new reply and send email
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { message, updateStatus } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get the ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Create the reply
    const reply = await prisma.ticketReply.create({
      data: {
        ticketId: params.id,
        sender: 'admin',
        senderName: session.user?.name || 'Support Team',
        senderEmail: session.user?.email || 'support@subcold.com',
        message: message.trim(),
        emailSent: false
      }
    })

    // Update ticket status if requested
    const newStatus = updateStatus || 'awaiting-customer'
    await prisma.ticket.update({
      where: { id: params.id },
      data: { 
        status: newStatus,
        updatedAt: new Date()
      }
    })

    // Send email to customer
    let emailSent = false
    let emailError: string | null = null

    if (resend) {
      try {
        await resend.emails.send({
          from: 'Subcold Support <support@support.subcold.com>',
          to: ticket.email,
          replyTo: 'sales@subcold.com',
          subject: `Re: ${ticket.ticketNumber} - ${ticket.subject}`,
          html: generateReplyEmailHTML(ticket, message, session.user?.name || 'Support Team')
        })
        emailSent = true
      } catch (error) {
        console.error('Failed to send reply email:', error)
        emailError = error instanceof Error ? error.message : 'Unknown error'
      }

      // Update reply with email status
      await prisma.ticketReply.update({
        where: { id: reply.id },
        data: { emailSent, emailError }
      })
    }

    return NextResponse.json({
      reply,
      emailSent,
      emailError
    })
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 })
  }
}

function generateReplyEmailHTML(ticket: any, message: string, senderName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #000; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #00B4D8; margin: 0; font-size: 24px;">Subcold Support</h1>
      </div>
      
      <div style="background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none;">
        <p style="margin-top: 0;">Hi ${ticket.fullName},</p>
        
        <p>Thank you for contacting Subcold Support. Here is our response to your enquiry:</p>
        
        <div style="background: #f8f9fa; border-left: 4px solid #00B4D8; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Reference:</strong> ${ticket.ticketNumber}<br>
          <strong>Subject:</strong> ${ticket.subject}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 25px 0;">
        
        <p style="margin-bottom: 0; font-size: 14px; color: #666;">
          To reply to this message, simply respond to this email or visit our support center.
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
        <p style="margin: 0 0 10px;">${senderName} | Subcold Support Team</p>
        <p style="margin: 0;">
          <a href="https://support.subcold.com" style="color: #00B4D8; text-decoration: none;">support.subcold.com</a> | 
          <a href="tel:01onal440557" style="color: #00B4D8; text-decoration: none;">01506 440557</a>
        </p>
      </div>
    </body>
    </html>
  `
}

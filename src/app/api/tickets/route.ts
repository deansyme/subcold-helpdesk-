import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Generate a human-readable ticket number
async function generateTicketNumber(): Promise<string> {
  const count = await prisma.ticket.count()
  const number = (count + 1).toString().padStart(6, '0')
  return `TKT-${number}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      type,
      fullName,
      email,
      phone,
      subject,
      message,
      // Return-specific fields
      orderNumber,
      purchaseChannel,
      returnReason,
      unwantedReason,
      productName,
      serialNumber,
      troubleshooting,
      wantsReplacement,
      photos,
      priority
    } = body

    // Validate required fields
    if (!type || !fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const ticketNumber = await generateTicketNumber()

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        type,
        status: 'open',
        priority: priority || 'normal',
        fullName,
        email,
        phone: phone || null,
        subject,
        message,
        orderNumber: orderNumber || null,
        purchaseChannel: purchaseChannel || null,
        returnReason: returnReason || null,
        unwantedReason: unwantedReason || null,
        productName: productName || null,
        serialNumber: serialNumber || null,
        troubleshooting: troubleshooting || null,
        wantsReplacement: wantsReplacement || null,
        attachments: photos || []
      }
    })

    // Send notification emails if Resend is configured
    if (resend) {
      const typeLabels: Record<string, string> = {
        return: 'Return Request',
        enquiry: 'General Enquiry',
        support: 'Support Request',
        complaint: 'Complaint'
      }

      // Admin notification
      try {
        await resend.emails.send({
          from: 'Subcold Support <noreply@support.subcold.com>',
          to: 'sales@subcold.com',
          subject: `New ${typeLabels[type] || 'Ticket'}: ${ticketNumber} - ${subject}`,
          html: generateAdminEmailHTML(ticket, typeLabels[type] || type)
        })
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError)
      }

      // Customer confirmation
      try {
        await resend.emails.send({
          from: 'Subcold Support <noreply@support.subcold.com>',
          to: email,
          subject: `Ticket Received: ${ticketNumber} - ${subject}`,
          html: generateCustomerEmailHTML(ticket, typeLabels[type] || type)
        })
      } catch (emailError) {
        console.error('Failed to send customer confirmation:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      ticketNumber: ticket.ticketNumber,
      ticketId: ticket.id,
      message: 'Ticket created successfully'
    })

  } catch (error) {
    console.error('Ticket creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket. Please try again.' },
      { status: 500 }
    )
  }
}

function generateAdminEmailHTML(ticket: {
  ticketNumber: string
  type: string
  fullName: string
  email: string
  phone: string | null
  subject: string
  message: string
  orderNumber: string | null
  returnReason: string | null
  productName: string | null
  createdAt: Date
}, typeLabel: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
        .value { margin-top: 5px; }
        .message-box { background: white; border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-top: 10px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .badge-return { background: #fef3c7; color: #92400e; }
        .badge-enquiry { background: #dbeafe; color: #1e40af; }
        .badge-support { background: #d1fae5; color: #065f46; }
        .badge-complaint { background: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 20px;">New ${typeLabel}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.8; font-size: 14px;">${ticket.ticketNumber}</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Type</div>
            <div class="value">
              <span class="badge badge-${ticket.type}">${typeLabel}</span>
            </div>
          </div>
          <div class="field">
            <div class="label">Subject</div>
            <div class="value" style="font-size: 18px; font-weight: bold;">${ticket.subject}</div>
          </div>
          <div class="field">
            <div class="label">Customer</div>
            <div class="value">${ticket.fullName}</div>
            <div class="value"><a href="mailto:${ticket.email}">${ticket.email}</a></div>
            ${ticket.phone ? `<div class="value">${ticket.phone}</div>` : ''}
          </div>
          ${ticket.orderNumber ? `
          <div class="field">
            <div class="label">Order Number</div>
            <div class="value">${ticket.orderNumber}</div>
          </div>
          ` : ''}
          ${ticket.returnReason ? `
          <div class="field">
            <div class="label">Return Reason</div>
            <div class="value">${ticket.returnReason}</div>
          </div>
          ` : ''}
          ${ticket.productName ? `
          <div class="field">
            <div class="label">Product</div>
            <div class="value">${ticket.productName}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Message</div>
            <div class="message-box">${ticket.message.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="field">
            <div class="label">Submitted</div>
            <div class="value">${new Date(ticket.createdAt).toLocaleString('en-GB')}</div>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p><a href="https://support.subcold.com/admin/tickets/${ticket.ticketNumber}">View in Admin Dashboard</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCustomerEmailHTML(ticket: {
  ticketNumber: string
  fullName: string
  subject: string
}, typeLabel: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 30px; text-align: center; }
        .header img { max-width: 150px; margin-bottom: 15px; }
        .content { padding: 30px; background: #ffffff; }
        .highlight { background: #f0fdfa; border-left: 4px solid #00B4D8; padding: 15px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background: #f9f9f9; }
        h1 { color: #00B4D8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://subcold.com/cdn/shop/files/subcold-logo-white_39563153-4a05-4674-b976-f96a36b48c2c.png?v=1760517416&width=156" alt="Subcold" />
          <h2 style="margin: 0;">We've Received Your ${typeLabel}</h2>
        </div>
        <div class="content">
          <p>Dear ${ticket.fullName.split(' ')[0]},</p>
          
          <p>Thank you for contacting Subcold Support. We have received your ${typeLabel.toLowerCase()} and our team will review it shortly.</p>
          
          <div class="highlight">
            <strong>Ticket Reference:</strong> ${ticket.ticketNumber}<br/>
            <strong>Subject:</strong> ${ticket.subject}
          </div>
          
          <h3>What happens next?</h3>
          <ol>
            <li>Our team will review your ticket within 1-2 working days</li>
            <li>We'll email you with a response or if we need any additional information</li>
            <li>You can reply to any of our emails to update your ticket</li>
          </ol>
          
          <p>If you have any urgent queries, please don't hesitate to contact us:</p>
          <ul>
            <li>Email: <a href="mailto:sales@subcold.com">sales@subcold.com</a></li>
            <li>Phone: 01506 440557 (Mon-Fri 9am-5pm)</li>
          </ul>
          
          <p>Kind regards,<br/>The Subcold Team</p>
        </div>
        <div class="footer">
          <p>Your ticket reference is <strong>${ticket.ticketNumber}</strong>. Please quote this in any correspondence.</p>
          <p>&copy; ${new Date().getFullYear()} Subcold. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

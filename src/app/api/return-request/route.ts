import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

// Initialize Resend - will use RESEND_API_KEY from environment
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      returnReason,
      fullName,
      email,
      orderNumber,
      purchaseChannel,
      unwantedReason,
      productName,
      serialNumber,
      troubleshooting,
      description,
      wantsReplacement,
      photos
    } = body

    // Validate required fields
    if (!returnReason || !fullName || !email || !orderNumber || !purchaseChannel) {
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

    // Store photos as data URLs for now (in production, you'd upload to S3/Cloudinary)
    const photoUrls = photos || []

    // Create the return request in the database
    const returnRequest = await prisma.returnRequest.create({
      data: {
        returnReason,
        fullName,
        email,
        orderNumber,
        purchaseChannel,
        unwantedReason: unwantedReason || null,
        productName: productName || null,
        serialNumber: serialNumber || null,
        troubleshooting: troubleshooting || null,
        description: description || null,
        wantsReplacement: wantsReplacement || null,
        photoUrls,
        status: 'pending'
      }
    })

    // Send notification emails if Resend is configured
    if (resend) {
      // Admin notification email
      try {
        await resend.emails.send({
          from: 'Subcold Support <noreply@support.subcold.com>',
          to: 'sales@subcold.com',
          subject: `New Return Request #${returnRequest.id.slice(-8).toUpperCase()} - ${returnReason}`,
          html: generateAdminEmailHTML(returnRequest, body)
        })
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError)
      }

      // Customer confirmation email
      try {
        await resend.emails.send({
          from: 'Subcold Support <noreply@support.subcold.com>',
          to: email,
          subject: `Return Request Received - Order ${orderNumber}`,
          html: generateCustomerEmailHTML(returnRequest, body)
        })
      } catch (emailError) {
        console.error('Failed to send customer confirmation:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      requestId: returnRequest.id,
      message: 'Return request submitted successfully'
    })

  } catch (error) {
    console.error('Return request error:', error)
    return NextResponse.json(
      { error: 'Failed to submit return request. Please try again.' },
      { status: 500 }
    )
  }
}

function generateAdminEmailHTML(request: { id: string; createdAt: Date }, body: {
  returnReason: string
  fullName: string
  email: string
  orderNumber: string
  purchaseChannel: string
  unwantedReason?: string
  productName?: string
  serialNumber?: string
  troubleshooting?: string
  description?: string
  wantsReplacement?: string
}) {
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
        .label { font-weight: bold; color: #666; }
        .value { margin-top: 5px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
        .badge-unwanted { background: #fef3c7; color: #92400e; }
        .badge-damage { background: #fee2e2; color: #991b1b; }
        .badge-faulty { background: #dbeafe; color: #1e40af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">New Return Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.8;">Request ID: #${request.id.slice(-8).toUpperCase()}</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Return Reason</div>
            <div class="value">
              <span class="badge badge-${body.returnReason.toLowerCase()}">${body.returnReason}</span>
            </div>
          </div>
          <div class="field">
            <div class="label">Customer Name</div>
            <div class="value">${body.fullName}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${body.email}">${body.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Order Number</div>
            <div class="value">${body.orderNumber}</div>
          </div>
          <div class="field">
            <div class="label">Purchase Channel</div>
            <div class="value">${body.purchaseChannel}</div>
          </div>
          ${body.unwantedReason ? `
          <div class="field">
            <div class="label">Unwanted Reason</div>
            <div class="value">${body.unwantedReason}</div>
          </div>
          ` : ''}
          ${body.productName ? `
          <div class="field">
            <div class="label">Product</div>
            <div class="value">${body.productName}</div>
          </div>
          ` : ''}
          ${body.serialNumber ? `
          <div class="field">
            <div class="label">Serial Number</div>
            <div class="value">${body.serialNumber}</div>
          </div>
          ` : ''}
          ${body.troubleshooting ? `
          <div class="field">
            <div class="label">Followed Troubleshooting</div>
            <div class="value">${body.troubleshooting}</div>
          </div>
          ` : ''}
          ${body.description ? `
          <div class="field">
            <div class="label">Description</div>
            <div class="value">${body.description}</div>
          </div>
          ` : ''}
          ${body.wantsReplacement ? `
          <div class="field">
            <div class="label">Preference</div>
            <div class="value">${body.wantsReplacement}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Submitted</div>
            <div class="value">${new Date(request.createdAt).toLocaleString('en-GB')}</div>
          </div>
        </div>
        <div class="footer">
          <p>View and manage this request in the <a href="https://support.subcold.com/admin/returns">Admin Dashboard</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCustomerEmailHTML(request: { id: string }, body: {
  returnReason: string
  fullName: string
  orderNumber: string
  productName?: string
}) {
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
          <h2 style="margin: 0;">Return Request Received</h2>
        </div>
        <div class="content">
          <p>Dear ${body.fullName.split(' ')[0]},</p>
          
          <p>Thank you for submitting your return request. We have received your submission and our team will review it shortly.</p>
          
          <div class="highlight">
            <strong>Request Reference:</strong> #${request.id.slice(-8).toUpperCase()}<br/>
            <strong>Order Number:</strong> ${body.orderNumber}<br/>
            <strong>Reason:</strong> ${body.returnReason}
            ${body.productName ? `<br/><strong>Product:</strong> ${body.productName}` : ''}
          </div>
          
          <h3>What happens next?</h3>
          <ol>
            <li>Our team will review your request within 1-2 working days</li>
            <li>We'll email you with the next steps and any return shipping instructions</li>
            <li>Once we receive your item back, we'll process your ${body.returnReason === 'Unwanted' ? 'refund' : 'replacement or refund'}</li>
          </ol>
          
          <p>If you have any questions in the meantime, please don't hesitate to contact us:</p>
          <ul>
            <li>Email: <a href="mailto:sales@subcold.com">sales@subcold.com</a></li>
            <li>Phone: 01506 440557 (Mon-Fri 9am-5pm)</li>
          </ul>
          
          <p>Kind regards,<br/>The Subcold Team</p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation email. Please do not reply directly to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Subcold. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Allow lookup by ID or ticket number
    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { id: params.id },
          { ticketNumber: params.id }
        ]
      }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status, priority, adminNotes, assignedTo } = body

    const validStatuses = ['open', 'in-progress', 'awaiting-customer', 'resolved', 'closed']
    const validPriorities = ['low', 'normal', 'high', 'urgent']

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })
    }

    // Find by ID or ticket number
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { id: params.id },
          { ticketNumber: params.id }
        ]
      }
    })

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: existingTicket.id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(assignedTo !== undefined && { assignedTo })
      }
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find by ID or ticket number
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { id: params.id },
          { ticketNumber: params.id }
        ]
      }
    })

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    await prisma.ticket.delete({
      where: { id: existingTicket.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json(
      { error: 'Failed to delete ticket' },
      { status: 500 }
    )
  }
}

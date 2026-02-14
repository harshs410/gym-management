import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const checkinSchema = z.object({
  memberId: z.string(),
  action: z.enum(['checkin', 'checkout']),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    // Only admins and trainers can check in members
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { memberId, action } = checkinSchema.parse(body)

    // Find member
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { user: true },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Update member check-in status
    const isCheckedIn = action === 'checkin'
    
    await prisma.member.update({
      where: { id: memberId },
      data: {
        isCheckedIn,
        lastCheckedIn: isCheckedIn ? new Date() : member.lastCheckedIn,
      },
    })

    // Create check-in record
    if (isCheckedIn) {
      await prisma.checkIn.create({
        data: {
          memberId,
        },
      })
    } else {
      // Update the last check-in with checkout time
      const lastCheckIn = await prisma.checkIn.findFirst({
        where: {
          memberId,
          checkedOutAt: null,
        },
        orderBy: {
          checkedInAt: 'desc',
        },
      })

      if (lastCheckIn) {
        await prisma.checkIn.update({
          where: { id: lastCheckIn.id },
          data: {
            checkedOutAt: new Date(),
          },
        })
      }
    }

    // Calculate current capacity
    const currentCapacity = await prisma.member.count({
      where: { isCheckedIn: true },
    })

    // Update gym settings
    await prisma.gymSettings.updateMany({
      data: {
        currentCapacity,
      },
    })

    // Get gym settings for max capacity
    const gymSettings = await prisma.gymSettings.findFirst()
    const maxCapacity = gymSettings?.maxCapacity || 100

    // Broadcast capacity update via WebSocket
    // Note: Socket.io needs to be accessed differently in App Router
    // We'll trigger it via a separate API call or use Redis pub/sub
    
    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        name: member.user.name,
        isCheckedIn,
      },
      capacity: {
        current: currentCapacity,
        max: maxCapacity,
        percentage: Math.round((currentCapacity / maxCapacity) * 100),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Failed to process check-in' },
      { status: 500 }
    )
  }
}

// GET /api/checkin - Get current capacity
export async function GET() {
  try {
    const currentCapacity = await prisma.member.count({
      where: { isCheckedIn: true },
    })

    const gymSettings = await prisma.gymSettings.findFirst()
    const maxCapacity = gymSettings?.maxCapacity || 100

    // Get checked-in members
    const checkedInMembers = await prisma.member.findMany({
      where: { isCheckedIn: true },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        lastCheckedIn: 'desc',
      },
    })

    return NextResponse.json({
      capacity: {
        current: currentCapacity,
        max: maxCapacity,
        percentage: Math.round((currentCapacity / maxCapacity) * 100),
      },
      checkedInMembers: checkedInMembers.map(m => ({
        id: m.id,
        name: m.user.name,
        email: m.user.email,
        checkedInAt: m.lastCheckedIn,
      })),
    })
  } catch (error) {
    console.error('Get capacity error:', error)
    return NextResponse.json(
      { error: 'Failed to get capacity' },
      { status: 500 }
    )
  }
}

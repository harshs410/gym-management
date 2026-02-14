import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET /api/members - List all members with search and filter
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    // Only admins and trainers can view members
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const tier = searchParams.get('tier') || ''
    const status = searchParams.get('status') || ''

    // Build where clause
    const where: any = {}

    // Search by name or email
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    // Filter by tier
    if (tier && tier !== 'ALL') {
      where.membershipTier = tier
    }

    // Filter by status
    if (status === 'ACTIVE') {
      where.isActive = true
    } else if (status === 'INACTIVE') {
      where.isActive = false
    }

    // Get members
    const members = await prisma.member.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Get members error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

// POST /api/members - Create new member
const createMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  age: z.number().min(16).max(100).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  membershipTier: z.enum(['BASIC', 'PREMIUM', 'VIP']),
  expiresAt: z.string(), // ISO date string
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    // Only admins can create members
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createMemberSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user and member in transaction
    const member = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: 'MEMBER',
        member: {
          create: {
            phone: data.phone,
            age: data.age,
            gender: data.gender,
            membershipTier: data.membershipTier,
            expiresAt: new Date(data.expiresAt),
            isActive: true,
          },
        },
      },
      include: {
        member: true,
      },
    })

    return NextResponse.json(
      { 
        success: true,
        member: {
          id: member.member?.id,
          name: member.name,
          email: member.email,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create member error:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
}

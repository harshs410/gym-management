import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import anthropic from '@/lib/claude'

const workoutPlanSchema = z.object({
  memberId: z.string(),
  age: z.number().min(16).max(100),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  fitnessLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  goals: z.array(z.string()).min(1),
  daysPerWeek: z.number().min(1).max(7),
  minutesPerSession: z.number().min(15).max(180),
  equipment: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    // Only admins and trainers can create workout plans
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = workoutPlanSchema.parse(body)

    // Find member
    const member = await prisma.member.findUnique({
      where: { id: data.memberId },
      include: { user: true },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Get trainer info
// Get or create trainer profile
let trainerId = ''

if (user.role === 'TRAINER') {
  const trainer = await prisma.trainer.findUnique({
    where: { userId: user.userId },
  })
  
  if (!trainer) {
    return NextResponse.json(
      { error: 'Trainer profile not found' },
      { status: 404 }
    )
  }
  trainerId = trainer.id
  
} else if (user.role === 'ADMIN') {
  // Admin: create trainer profile if doesn't exist
  let adminTrainer = await prisma.trainer.findUnique({
    where: { userId: user.userId },
  })
  
  if (!adminTrainer) {
    adminTrainer = await prisma.trainer.create({
      data: {
        userId: user.userId,
        specialization: 'Administrator',
      },
    })
  }
  trainerId = adminTrainer.id
}

    // Build Claude prompt
    const prompt = `You are a certified personal trainer with 10+ years of experience. Create a detailed 4-week progressive workout plan for the following client.

CLIENT PROFILE:
- Age: ${data.age} years old
- Gender: ${data.gender}
- Current Fitness Level: ${data.fitnessLevel}
- Primary Goals: ${data.goals.join(', ')}
- Training Frequency: ${data.daysPerWeek} days per week
- Session Duration: ${data.minutesPerSession} minutes per session
- Available Equipment: ${data.equipment}

REQUIREMENTS:
1. Create exactly 4 weeks of training
2. Each week should progressively increase in intensity
3. Respect the ${data.daysPerWeek} days per week schedule
4. Keep each workout within ${data.minutesPerSession} minutes
5. Include rest days appropriate for the fitness level
6. Provide specific exercises with sets, reps, and rest periods
7. Add form cues and safety tips for each exercise
8. Include brief nutrition guidance
9. Provide progression notes for after the 4 weeks

IMPORTANT: Respond ONLY with valid JSON in this exact structure (no markdown, no extra text):

{
  "title": "4-Week [Primary Goal] Training Program",
  "description": "A 2-3 sentence overview of the program approach and what the client can expect",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation/Volume/Intensity/Recovery",
      "days": [
        {
          "dayNumber": 1,
          "name": "Descriptive workout name (e.g., Upper Body Strength)",
          "exercises": [
            {
              "name": "Specific exercise name",
              "sets": 3,
              "reps": "8-10",
              "rest": "60 seconds",
              "notes": "Form cues, tempo, or modifications"
            }
          ]
        }
      ]
    }
  ],
  "nutritionTips": "3-4 practical nutrition tips specific to the goals",
  "progressionNotes": "How to progress after completing this 4-week program"
}

Generate the complete workout plan now as valid JSON:`

    console.log('🤖 Generating workout plan with Claude...')

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Extract text from Claude response
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '{}'
    
    // Parse AI response
    let planData
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      planData = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText)
      return NextResponse.json(
        { error: 'Failed to parse workout plan from AI. Please try again.' },
        { status: 500 }
      )
    }

    // Validate plan structure
    if (!planData.title || !planData.weeks || !Array.isArray(planData.weeks)) {
      console.error('Invalid plan structure:', planData)
      return NextResponse.json(
        { error: 'AI generated invalid plan structure. Please try again.' },
        { status: 500 }
      )
    }

    // Save to database
    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        memberId: data.memberId,
        trainerId: trainerId,
        title: planData.title || '4-Week Workout Plan',
        description: planData.description || '',
        plan: planData,
        weeks: 4,
        fitnessLevel: data.fitnessLevel,
      },
    })

    console.log('✅ Workout plan created:', workoutPlan.id)

    return NextResponse.json({
      success: true,
      workoutPlan: {
        id: workoutPlan.id,
        title: workoutPlan.title,
        description: workoutPlan.description,
        plan: planData,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Workout plan generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate workout plan. Please check your API key and try again.' },
      { status: 500 }
    )
  }
}

// GET /api/workout-plan?memberId=xxx - Get member's workout plans
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID required' },
        { status: 400 }
      )
    }

    const plans = await prisma.workoutPlan.findMany({
      where: { memberId },
      include: {
        member: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        trainer: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Get workout plans error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workout plans' },
      { status: 500 }
    )
  }
}

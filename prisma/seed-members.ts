import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding test members...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  const tiers = ['BASIC', 'PREMIUM', 'VIP']
  const genders = ['MALE', 'FEMALE', 'OTHER']
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa', 'Tom', 'Anna']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson']

  // Create 100 test members
  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName} ${i}`
    const email = `member${i}@test.com`
    const tier = tiers[Math.floor(Math.random() * tiers.length)]
    const gender = genders[Math.floor(Math.random() * genders.length)]
    const age = 18 + Math.floor(Math.random() * 50) // Age between 18-67
    
    // Random expiry date (some expired, some active)
    const daysOffset = Math.floor(Math.random() * 720) - 180 // -180 to +540 days
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + daysOffset)

    const isActive = expiresAt > new Date() && Math.random() > 0.1 // 90% active if not expired

    try {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'MEMBER',
          member: {
            create: {
              phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
              age,
              gender: gender as any,
              membershipTier: tier as any,
              expiresAt,
              isActive,
            },
          },
        },
      })

      if (i % 10 === 0) {
        console.log(`✅ Created ${i} members...`)
      }
    } catch (error) {
      console.error(`Failed to create member ${i}:`, error)
    }
  }

  console.log('🎉 Successfully created 100 test members!')
  console.log('\nTest accounts:')
  console.log('📧 member1@test.com to member100@test.com')
  console.log('🔑 Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

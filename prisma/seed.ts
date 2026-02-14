import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thrust.com' },
    update: {},
    create: {
      email: 'admin@thrust.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create Trainer user
  const trainer = await prisma.user.upsert({
    where: { email: 'trainer@thrust.com' },
    update: {},
    create: {
      email: 'trainer@thrust.com',
      password: hashedPassword,
      name: 'Trainer John',
      role: 'TRAINER',
      trainer: {
        create: {
          specialization: 'Strength Training',
        },
      },
    },
  })
  console.log('✅ Created trainer user:', trainer.email)

  // Create Member user
  const memberUser = await prisma.user.upsert({
    where: { email: 'member@thrust.com' },
    update: {},
    create: {
      email: 'member@thrust.com',
      password: hashedPassword,
      name: 'Member Mike',
      role: 'MEMBER',
      member: {
        create: {
          membershipTier: 'PREMIUM',
          expiresAt: new Date('2026-12-31'),
          age: 28,
          gender: 'MALE',
        },
      },
    },
  })
  console.log('✅ Created member user:', memberUser.email)

  // Create Gym Settings
  const gymSettings = await prisma.gymSettings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      maxCapacity: 100,
      currentCapacity: 0,
    },
  })
  console.log('✅ Created gym settings')

  console.log('🎉 Seeding complete!')
  console.log('\nDemo Accounts:')
  console.log('📧 Admin: admin@thrust.com / password123')
  console.log('📧 Trainer: trainer@thrust.com / password123')
  console.log('📧 Member: member@thrust.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

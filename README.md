# THRUST - Gym Management SaaS

A full-stack gym management platform with real-time capacity tracking, AI workout generation, and role-based access control.

## Features

- 🔐 **Role-Based Access Control** - Admin, Trainer, Member permissions
- 📊 **Scalable Member Management** - Handle 10,000+ members smoothly
- 🔴 **Real-time Capacity Tracking** - Live gym occupancy via WebSocket
- 🤖 **AI Workout Plans** - OpenAI-powered personalized training programs

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- Recharts
- @tanstack/react-virtual
- Socket.io Client

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Redis (IORedis)
- JWT Authentication (jose)
- bcryptjs
- Zod validation
- Socket.io Server
- OpenAI SDK

**Infrastructure:**
- Docker (PostgreSQL + Redis)
- Vercel (Production hosting)
- Supabase (Production database)

## Phase 0: Local Setup

### Prerequisites
- Node.js 18+ installed
- Docker Desktop installed and running
- Git installed

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Docker Containers**
   ```bash
   docker-compose up -d
   ```
   This starts PostgreSQL (port 5432) and Redis (port 6379)

3. **Configure Environment**
   - The `.env` file is already created
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY="sk-your-key-here"
     ```

4. **Initialize Database**
   ```bash
   npx prisma migrate dev --name init
   ```
   Enter migration name when prompted: `init`

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

### Verify Setup

**Test 1: Docker Running**
```bash
docker ps
```
Should show: `thrust_gym_db` and `thrust_gym_redis`

**Test 2: Database Connection**
```bash
npx prisma studio
```
Should open at http://localhost:5555

**Test 3: Next.js Server**
```bash
npm run dev
```
Should open at http://localhost:3000

### Save Your Work

```bash
git init
git add .
git commit -m "chore: Phase 0 setup complete"
```

## Project Structure

```
thrust-gym/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── prisma/
│   └── schema.prisma         # Database schema
├── docker-compose.yml        # Docker config
├── .env                      # Environment variables
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind config
└── next.config.js            # Next.js config
```

## Database Schema

- **User** - Authentication (email, password, role)
- **Member** - Gym members (tier, expiry, check-in status)
- **Trainer** - Gym trainers (specialization, assigned members)
- **WorkoutPlan** - AI-generated workout plans
- **CheckIn** - Check-in/check-out records
- **GymSettings** - Gym capacity settings

## Next Steps: Phase 1

After Phase 0 is complete:
1. Build authentication system (login/signup)
2. Create admin dashboard
3. Implement member management
4. Add real-time capacity tracker
5. Integrate OpenAI workout generator

## Troubleshooting

**Docker not starting:**
- Ensure Docker Desktop is running
- Check ports 5432 and 6379 are not in use

**npm install fails:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, retry

**Database connection error:**
- Verify Docker containers are running: `docker ps`
- Check `.env` DATABASE_URL matches docker-compose.yml

## License

MIT

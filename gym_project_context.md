# THRUST - Gym Management SaaS
## Project Context Document for Claude

**Date Created**: February 7, 2026  
**Purpose**: Portfolio project to demonstrate technical capabilities for ₹12 LPA salary expectation

---

## 🎯 Project Overview

**Name**: THRUST  
**Type**: Gym Management SaaS (Software as a Service)  
**Goal**: Build a production-grade application showcasing advanced engineering skills

### Why This Project?
- Prove technical depth beyond CRUD applications
- Demonstrate understanding of: Security, Scale, Real-time systems, AI integration
- Portfolio piece that stands out in interviews

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide-React
- **State Management**: TBD (likely React Query + Zustand)

### Backend
- **API**: Next.js API Routes (or separate Node.js if needed)
- **Database**: TBD (PostgreSQL recommended for RBAC + scale)
- **Auth**: JWT-based authentication
- **Real-time**: WebSockets (Socket.io or native WS)

### AI/ML
- **Service**: OpenAI API or Anthropic Claude API
- **Use Case**: Workout plan generation

### DevOps (Future)
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **Database**: Supabase or Neon (PostgreSQL)

---

## 🎨 Core Features (The "Proof Points")

### 1. Security → RBAC (Role-Based Access Control)
**What it proves**: Understanding of enterprise-grade security patterns

**Implementation**:
- 3 User Roles:
  - **Admin**: Full access (manage members, trainers, settings, view analytics)
  - **Trainer**: Limited access (view assigned members, create workout plans, check-ins)
  - **User/Member**: Restricted (view own profile, workout plans, attendance)
- JWT tokens with role claims
- Protected API routes
- Conditional UI rendering based on role
- Middleware for route protection

**Technical Details**:
```typescript
// JWT Payload Structure
{
  userId: string;
  email: string;
  role: 'admin' | 'trainer' | 'user';
  gymId: string; // For multi-tenant support (future)
}
```

---

### 2. Scale → 10,000 Fake Users + Virtualization
**What it proves**: Can build performant UIs at scale

**Implementation**:
- Generate 10,000 realistic fake members using Faker.js
- Virtualized list rendering (react-window or @tanstack/react-virtual)
- Pagination + infinite scroll
- Optimistic UI updates
- Debounced search across large datasets

**Data Points per User**:
- Name, email, phone
- Membership tier (Basic, Premium, VIP)
- Join date, membership expiry
- Attendance history (random 50-200 check-ins)
- Assigned trainer (random)
- Status (Active, Inactive, Frozen)

**Performance Targets**:
- Initial page load: <2 seconds
- Scroll FPS: 60fps (no jank)
- Search results: <500ms

---

### 3. Real-time → Live Gym Capacity Tracker
**What it proves**: Understanding of real-time architectures and WebSockets

**Implementation**:
- WebSocket connection between client and server
- Live dashboard showing:
  - Current capacity: "47/100 members in gym"
  - Real-time check-in/check-out events
  - Occupancy graph (last 24 hours)
- Multiple clients stay in sync
- Heartbeat/reconnection logic

**Technical Flow**:
```
User checks in (QR scan/manual)
  ↓
POST /api/check-in
  ↓
WebSocket broadcast to all connected clients
  ↓
Dashboard updates in real-time (no refresh)
```

**UI Components**:
- Live capacity card (Dashboard)
- Real-time activity feed (who just checked in)
- Occupancy heatmap (hourly breakdown)

---

### 4. AI → Personalized Workout Plan Generator
**What it proves**: Can integrate modern AI tools into products

**Implementation**:
- User inputs:
  - Age, gender, fitness level (beginner/intermediate/advanced)
  - Goals (weight loss, muscle gain, endurance, flexibility)
  - Available equipment (home/gym)
  - Time availability (days per week, minutes per session)
  - Injuries/limitations (optional)

- AI generates:
  - 4-week progressive workout plan
  - Daily exercise breakdown (sets, reps, rest)
  - Nutrition tips
  - Progress checkpoints

**Technical Flow**:
```typescript
// API Route: /api/generate-workout
const prompt = `
You are a certified personal trainer. Generate a personalized 4-week workout plan.

User Profile:
- Age: ${age}, Gender: ${gender}
- Fitness Level: ${level}
- Goals: ${goals.join(', ')}
- Equipment: ${equipment}
- Availability: ${days} days/week, ${duration} mins/session

Return a structured JSON with weekly breakdown.
`;

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }],
});
```

**Storage**:
- Save generated plans to database
- Allow trainers to edit AI-generated plans
- Track user adherence (did they complete workouts?)

---

## 🏗️ App Structure (Planned)

### Pages/Routes
```
/                          → Dashboard (capacity, recent activity)
/members                   → Member list (virtualized, 10k users)
/members/[id]              → Member profile (details, attendance, workout plan)
/live-traffic              → Real-time capacity tracker
/ai-planner                → Workout plan generator
/ai-planner/[planId]       → View generated plan
/settings                  → User settings, gym configuration
/login                     → Authentication
```

### Components Architecture
```
components/
├── layout/
│   ├── Sidebar.tsx        → Main navigation (250px, dark)
│   ├── Header.tsx         → Search, user profile, role badge
│   └── Providers.tsx      → React Query, Auth, Toast providers
├── ui/                    → Reusable primitives (shadcn-style)
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
├── dashboard/
│   ├── CapacityCard.tsx
│   ├── ActivityFeed.tsx
│   └── OccupancyChart.tsx
├── members/
│   ├── MemberList.tsx     → Virtualized list
│   ├── MemberCard.tsx
│   └── MemberSearch.tsx
└── ai-planner/
    ├── WorkoutForm.tsx
    ├── PlanDisplay.tsx
    └── PlanEditor.tsx
```

---

## 🗄️ Database Schema (Draft)

### Users Table
```sql
users
- id (uuid, PK)
- email (unique)
- password_hash
- role (enum: 'admin' | 'trainer' | 'user')
- created_at
- updated_at
```

### Members Table
```sql
members
- id (uuid, PK)
- user_id (FK → users.id)
- full_name
- phone
- date_of_birth
- membership_tier (enum: 'basic' | 'premium' | 'vip')
- membership_start
- membership_end
- status (enum: 'active' | 'inactive' | 'frozen')
- assigned_trainer_id (FK → users.id)
- created_at
```

### Check-ins Table
```sql
check_ins
- id (uuid, PK)
- member_id (FK → members.id)
- check_in_time (timestamp)
- check_out_time (timestamp, nullable)
- created_at
```

### Workout Plans Table
```sql
workout_plans
- id (uuid, PK)
- member_id (FK → members.id)
- created_by (FK → users.id) // trainer or AI
- plan_data (jsonb) // stores the full AI-generated plan
- is_ai_generated (boolean)
- created_at
- updated_at
```

---

## 📐 Design System

### Colors
```
Background: slate-50 (light gray)
Sidebar: slate-900 (dark)
Accent: blue-600 (primary actions)
Success: green-500
Warning: yellow-500
Danger: red-500
```

### Typography
```
Logo: 2xl, bold, white
Headings: xl/lg, semibold
Body: sm/base, regular
```

### Spacing
```
Sidebar: 250px width, 64px logo height
Header: 64px height
Content padding: 24px
```

---

## 🚀 Build Plan (High-Level Phases)

### Phase 1: MVP Shell (Week 1) ← WE ARE HERE
- ✅ Next.js setup
- ✅ Sidebar + Header components
- ✅ Layout structure
- ⬜ Basic routing (Dashboard, Members, Settings pages)
- ⬜ Tailwind + design tokens finalized

### Phase 2: Authentication & RBAC (Week 2)
- JWT implementation
- Login/signup flow
- Role-based middleware
- Protected routes
- User context provider

### Phase 3: Members Module + Scale (Week 3)
- Generate 10,000 fake members
- Virtualized member list
- Search/filter functionality
- Member detail page
- Pagination + infinite scroll

### Phase 4: Real-time Capacity (Week 4)
- WebSocket server setup
- Check-in/check-out API
- Live dashboard
- Capacity tracking
- Activity feed

### Phase 5: AI Workout Planner (Week 5)
- OpenAI API integration
- Workout plan form
- Plan generation logic
- Plan display/editing
- Save to database

### Phase 6: Polish & Deploy (Week 6)
- Error handling
- Loading states
- Responsive design
- Deploy to Vercel
- Documentation

---

## 💡 Advanced Features (Post-MVP)

If time permits or for future iterations:
- Multi-gym support (multi-tenant)
- Payment integration (Stripe/Razorpay)
- Email notifications (check-in reminders, expiry alerts)
- Analytics dashboard (retention, revenue, peak hours)
- Mobile app (React Native)
- QR code check-in system
- Trainer scheduling/calendar
- Nutrition tracking
- Progress photos/measurements

---

## 📝 Questions to Resolve Later

1. **Database Choice**: PostgreSQL (Supabase) vs. MongoDB?
2. **Real-time**: Socket.io vs. native WebSockets vs. Pusher?
3. **AI Model**: GPT-4 vs. Claude vs. open-source (cost vs. quality)?
4. **Deployment**: All on Vercel vs. separate backend?
5. **Testing**: Unit tests (Jest) + E2E (Playwright)?

---

## 🎓 Learning Resources

- Next.js App Router: https://nextjs.org/docs/app
- RBAC Patterns: https://auth0.com/docs/manage-users/access-control/rbac
- React Virtualization: https://tanstack.com/virtual/latest
- WebSocket in Next.js: https://socket.io/docs/v4/
- OpenAI API: https://platform.openai.com/docs

---

## 🔄 How to Use This Document with Claude

**To restore context in a new chat:**
1. Upload this file to Claude
2. Say: "I've uploaded the THRUST project context. Let's continue from [specific phase]."
3. Claude will have full context and can pick up where you left off.

**When to update this doc:**
- After completing each phase
- When making major architectural decisions
- When adding new features to the roadmap

---

**Last Updated**: February 7, 2026  
**Status**: Phase 1 in progress (MVP Shell)  
**Next Step**: Complete Sidebar, Header, Layout files and run the app
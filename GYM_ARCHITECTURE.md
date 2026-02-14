# THRUST - Gym Management SaaS
## System Architecture & Technical Design Document

**Version**: 1.0  
**Last Updated**: February 8, 2026  
**Status**: In Development  
**Architecture Phase**: MVP (Phase 1)

---

## 📋 TABLE OF CONTENTS

1. [Architecture Overview](#overview)
2. [System Architecture Diagram](#diagram)
3. [Technology Stack](#stack)
4. [Database Design](#database)
5. [API Design](#api)
6. [Authentication & Security](#auth)
7. [Real-time Architecture](#realtime)
8. [AI Integration](#ai)
9. [Frontend Architecture](#frontend)
10. [Infrastructure & Deployment](#infrastructure)
11. [Performance & Scalability](#performance)
12. [Monitoring & Observability](#monitoring)

---

<a name="overview"></a>
## 🎯 ARCHITECTURE OVERVIEW

### System Type
**Monolithic Full-Stack Application** with real-time capabilities

**Justification**:
- Simpler deployment (single Vercel project)
- Faster development (no microservice overhead)
- Lower operational complexity
- Suitable for single-gym MVP
- Can migrate to microservices in Phase 2 (multi-tenancy)

---

### Architecture Style

**Hybrid: Server-Side Rendering (SSR) + Client-Side Rendering (CSR) + Real-time (WebSocket)**
```
┌─────────────────────────────────────────────────────────────┐
│                     ARCHITECTURE LAYERS                      │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Presentation (React Components)                   │
│  Layer 2: State Management (React Query + Zustand)          │
│  Layer 3: API Client (fetch + Socket.io)                    │
│  Layer 4: API Routes (Next.js)                              │
│  Layer 5: Business Logic (Services)                         │
│  Layer 6: Data Access (Prisma ORM)                          │
│  Layer 7: Database (PostgreSQL)                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Core Principles

1. **Security First**: JWT auth, RBAC, input validation at every layer
2. **Performance**: Virtualization, caching, optimistic updates
3. **Real-time**: WebSocket for live capacity, event-driven
4. **AI-Augmented**: OpenAI integration for workout generation
5. **Type Safety**: TypeScript everywhere (strict mode)
6. **Developer Experience**: Fast feedback loops, hot reload

---

<a name="diagram"></a>
## 📐 SYSTEM ARCHITECTURE DIAGRAM

### High-Level Architecture
```
┌────────────────────────────────────────────────────────────────────┐
│                          CLIENT TIER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Browser    │  │  Mobile App  │  │    Admin     │            │
│  │   (Next.js)  │  │ (Future RN)  │  │    Panel     │            │
│  │              │  │              │  │              │            │
│  │  - React UI  │  │  - React     │  │  - Same UI   │            │
│  │  - Tailwind  │  │    Native    │  │  - Desktop   │            │
│  │  - Socket.io │  │  - Socket.io │  │    optimized │            │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │
│         │                 │                 │                      │
│         └─────────────────┴─────────────────┘                      │
│                           │                                         │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   CDN / Edge  │
                    │   (Vercel)    │
                    └───────┬───────┘
                            │
┌───────────────────────────┼─────────────────────────────────────────┐
│                    APPLICATION TIER                                  │
│                            │                                         │
│    ┌───────────────────────┴──────────────────────┐                 │
│    │       Next.js 14+ (App Router)               │                 │
│    │                                               │                 │
│    │  ┌─────────────────────────────────────┐    │                 │
│    │  │         Page Routes (SSR)           │    │                 │
│    │  │  ┌─────────────────────────────┐    │    │                 │
│    │  │  │  /                          │    │    │                 │
│    │  │  │  ├─ (auth)/                 │    │    │                 │
│    │  │  │  │  ├─ login                │    │    │                 │
│    │  │  │  │  └─ signup               │    │    │                 │
│    │  │  │  │                          │    │    │                 │
│    │  │  │  └─ (dashboard)/            │    │    │                 │
│    │  │  │     ├─ page.tsx             │    │    │                 │
│    │  │  │     ├─ members/             │    │    │                 │
│    │  │  │     ├─ live-traffic/        │    │    │                 │
│    │  │  │     └─ ai-planner/          │    │    │                 │
│    │  │  └─────────────────────────────┘    │    │                 │
│    │  └─────────────────────────────────────┘    │                 │
│    │                                               │                 │
│    │  ┌─────────────────────────────────────┐    │                 │
│    │  │         API Routes (CSR)            │    │                 │
│    │  │  ┌─────────────────────────────┐    │    │                 │
│    │  │  │  /api/                      │    │    │                 │
│    │  │  │  ├─ auth/                   │    │    │                 │
│    │  │  │  │  ├─ login                │    │    │                 │
│    │  │  │  │  ├─ signup               │    │    │                 │
│    │  │  │  │  ├─ refresh              │    │    │                 │
│    │  │  │  │  └─ me                   │    │    │                 │
│    │  │  │  │                          │    │    │                 │
│    │  │  │  ├─ members/                │    │    │                 │
│    │  │  │  │  ├─ route.ts             │    │    │                 │
│    │  │  │  │  └─ [id]/route.ts        │    │    │                 │
│    │  │  │  │                          │    │    │                 │
│    │  │  │  ├─ check-ins/              │    │    │                 │
│    │  │  │  │  └─ route.ts             │    │    │                 │
│    │  │  │  │                          │    │    │                 │
│    │  │  │  └─ ai/                     │    │    │                 │
│    │  │  │     └─ generate-workout/    │    │    │                 │
│    │  │  └─────────────────────────────┘    │    │                 │
│    │  └─────────────────────────────────────┘    │                 │
│    └───────────────────────────────────────────────┘                │
│                            │                                         │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            │                                 │
    ┌───────▼─────────┐           ┌──────────▼──────────┐
    │   WebSocket     │           │   HTTP REST API     │
    │   Server        │           │                     │
    │   (Socket.io)   │           │   - CRUD ops        │
    │                 │           │   - Auth            │
    │   - Events      │           │   - Validation      │
    │   - Rooms       │           │                     │
    │   - Broadcast   │           └──────────┬──────────┘
    └───────┬─────────┘                      │
            │                                 │
┌───────────┼─────────────────────────────────┼──────────────────────┐
│           │         SERVICE LAYER           │                      │
│           │                                 │                      │
│    ┌──────▼──────────┐          ┌──────────▼──────────┐          │
│    │   WebSocket     │          │   Business Logic    │          │
│    │   Event         │          │   Services          │          │
│    │   Handlers      │          │                     │          │
│    │                 │          │  ┌────────────────┐ │          │
│    │  - onCheckIn    │          │  │ AuthService    │ │          │
│    │  - onCheckOut   │          │  │ MemberService  │ │          │
│    │  - onConnect    │          │  │ CheckInService │ │          │
│    │  - onDisconnect │          │  │ WorkoutService │ │          │
│    │                 │          │  │ AIService      │ │          │
│    │  Broadcast:     │          │  └────────────────┘ │          │
│    │  - capacity     │          │                     │          │
│    │  - activity     │          └──────────┬──────────┘          │
│    └─────────────────┘                     │                      │
│                                            │                      │
└────────────────────────────────────────────┼──────────────────────┘
                                             │
                          ┌──────────────────┴──────────────────┐
                          │                                     │
                  ┌───────▼────────┐              ┌────────────▼────────┐
                  │   Prisma ORM   │              │   External APIs     │
                  │                │              │                     │
                  │  - Type-safe   │              │  ┌────────────────┐ │
                  │  - Migrations  │              │  │ OpenAI API     │ │
                  │  - Queries     │              │  │ (GPT-4 Turbo)  │ │
                  └───────┬────────┘              │  └────────────────┘ │
                          │                       │                     │
┌─────────────────────────┼───────────────────────┤  ┌────────────────┐ │
│         DATA TIER       │                       │  │ SendGrid/      │ │
│                         │                       │  │ Resend (Email) │ │
│         ┌───────────────▼────────────┐          │  └────────────────┘ │
│         │                            │          │                     │
│         │      PostgreSQL 15+        │          │  ┌────────────────┐ │
│         │      (Supabase/Neon)       │          │  │ AWS S3 /       │ │
│         │                            │          │  │ Cloudflare R2  │ │
│         │  Tables:                   │          │  │ (File Storage) │ │
│         │  ├─ users                  │          │  └────────────────┘ │
│         │  ├─ members                │          └─────────────────────┘
│         │  ├─ check_ins              │
│         │  ├─ workout_plans          │
│         │  └─ workout_progress       │
│         │                            │
│         │  Indexes:                  │
│         │  ├─ members.status         │
│         │  ├─ members.membership_end │
│         │  └─ check_ins.check_in_time│
│         └────────────┬───────────────┘
│                      │
│         ┌────────────▼───────────────┐
│         │                            │
│         │      Redis (Upstash)       │
│         │                            │
│         │  - Session store           │
│         │  - WebSocket state         │
│         │  - Rate limiting           │
│         │  - Cache layer             │
│         └────────────────────────────┘
│                                       
└───────────────────────────────────────┘
```

---

### Data Flow Examples

#### Example 1: User Login Flow
```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Browser │      │   API    │      │  Auth    │      │ Database │
│          │      │  Route   │      │ Service  │      │          │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                 │                 │
     │ POST /api/auth/login             │                 │
     │ {email, password}                │                 │
     ├────────────────►│                 │                 │
     │                 │                 │                 │
     │                 │ validateInput() │                 │
     │                 ├────────────────►│                 │
     │                 │                 │                 │
     │                 │                 │ getUserByEmail()│
     │                 │                 ├────────────────►│
     │                 │                 │◄────────────────┤
     │                 │                 │  user record    │
     │                 │                 │                 │
     │                 │ verifyPassword()│                 │
     │                 │◄────────────────┤                 │
     │                 │                 │                 │
     │                 │ generateJWT()   │                 │
     │                 │◄────────────────┤                 │
     │                 │ {accessToken,   │                 │
     │                 │  refreshToken}  │                 │
     │◄────────────────┤                 │                 │
     │ 200 OK          │                 │                 │
     │ {user, tokens}  │                 │                 │
     │                 │                 │                 │
     │ Set cookies     │                 │                 │
     │ Navigate to /   │                 │                 │
     │                 │                 │                 │
```

---

#### Example 2: Real-time Check-in Flow
```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Client A │  │   API    │  │ CheckIn  │  │ Database │  │ Client B │
│          │  │  Route   │  │ Service  │  │          │  │          │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │             │
     │ POST /api/check-ins       │             │             │
     │ {memberId}  │             │             │             │
     ├────────────►│             │             │             │
     │             │             │             │             │
     │             │ createCheckIn()           │             │
     │             ├────────────►│             │             │
     │             │             │             │             │
     │             │             │ INSERT check_in           │
     │             │             ├────────────►│             │
     │             │             │◄────────────┤             │
     │             │             │ check_in record           │
     │             │             │             │             │
     │             │             │ getCurrentCapacity()      │
     │             │             ├────────────►│             │
     │             │             │◄────────────┤             │
     │             │             │ count: 47   │             │
     │             │             │             │             │
     │             │ WebSocket.broadcast()     │             │
     │             │ {type: 'check-in',        │             │
     │             │  memberName: 'John',      │             │
     │             │  capacity: {current: 47,  │             │
     │             │             max: 100}}    │             │
     │             ├───────────────────────────┼────────────►│
     │◄────────────┤             │             │             │
     │ 201 Created │             │             │             │
     │ {checkIn,   │             │             │             │
     │  capacity}  │             │             │             │
     │             │             │             │             │
     │ UI updates  │             │             │ UI updates  │
     │ capacity:47 │             │             │ capacity:47 │
     │             │             │             │             │
```

---

#### Example 3: AI Workout Plan Generation
```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  Browser │  │   API    │  │   AI     │  │  OpenAI  │  │ Database │
│          │  │  Route   │  │ Service  │  │   API    │  │          │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │             │
     │ POST /api/ai/generate-workout          │             │
     │ {memberId, age, goals...}              │             │
     ├────────────►│             │             │             │
     │             │             │             │             │
     │             │ validateInput()           │             │
     │             │ checkRateLimit()          │             │
     │             │             │             │             │
     │             │ generatePlan()            │             │
     │             ├────────────►│             │             │
     │             │             │             │             │
     │             │             │ buildPrompt()             │
     │             │             │             │             │
     │             │             │ POST /v1/chat/completions │
     │             │             ├────────────►│             │
     │             │             │             │ GPT-4       │
     │             │             │             │ processing  │
     │             │             │             │ (~10-15s)   │
     │             │             │◄────────────┤             │
     │             │             │ {plan JSON} │             │
     │             │             │             │             │
     │             │             │ validatePlan()            │
     │             │             │             │             │
     │             │             │ savePlan()  │             │
     │             │             ├─────────────┼────────────►│
     │             │             │             │◄────────────┤
     │             │             │             │  plan record│
     │             │◄────────────┤             │             │
     │◄────────────┤             │             │             │
     │ 201 Created │             │             │             │
     │ {planId,    │             │             │             │
     │  plan,      │             │             │             │
     │  metadata}  │             │             │             │
     │             │             │             │             │
```

---

<a name="stack"></a>
## 🛠️ TECHNOLOGY STACK

### Frontend Stack
```typescript
{
  "framework": "Next.js 14.2+",
  "version": "App Router (not Pages Router)",
  "language": "TypeScript 5.3+",
  "runtime": "Node.js 20+",
  
  "ui": {
    "styling": "Tailwind CSS 3.4+",
    "components": "shadcn/ui (Radix UI primitives)",
    "icons": "Lucide React",
    "fonts": "Next.js Font Optimization (Inter)"
  },
  
  "state": {
    "server": "TanStack Query (React Query) v5",
    "client": "Zustand 4.x (lightweight)",
    "forms": "React Hook Form 7.x",
    "validation": "Zod 3.x"
  },
  
  "data_fetching": {
    "rest": "native fetch with React Query",
    "realtime": "Socket.io Client 4.x"
  },
  
  "visualization": {
    "charts": "Recharts 2.x",
    "virtualization": "@tanstack/react-virtual 3.x"
  },
  
  "utilities": {
    "dates": "date-fns 3.x",
    "classnames": "clsx + tailwind-merge (cn helper)",
    "clipboard": "navigator.clipboard API"
  }
}
```

---

### Backend Stack
```typescript
{
  "runtime": "Node.js 20 LTS",
  "framework": "Next.js API Routes",
  
  "database": {
    "primary": "PostgreSQL 15+",
    "orm": "Prisma 5.x",
    "migrations": "Prisma Migrate",
    "seeding": "Prisma Seed + Faker.js"
  },
  
  "cache": {
    "provider": "Redis (Upstash)",
    "client": "ioredis 5.x",
    "use_cases": [
      "Session storage",
      "WebSocket state",
      "Rate limiting",
      "Query caching"
    ]
  },
  
  "auth": {
    "strategy": "JWT (JSON Web Tokens)",
    "library": "jose 5.x",
    "hashing": "bcryptjs 2.x (12 rounds)",
    "session": "Redis-backed"
  },
  
  "validation": {
    "library": "Zod 3.x",
    "usage": "API input validation, env vars"
  },
  
  "realtime": {
    "library": "Socket.io 4.x",
    "transport": "WebSocket (fallback to polling)",
    "scaling": "Redis adapter (multi-instance)"
  },
  
  "ai": {
    "provider": "OpenAI",
    "sdk": "openai 4.x",
    "model": "gpt-4-turbo-preview",
    "fallback": "Anthropic Claude 3.5 Sonnet"
  },
  
  "jobs": {
    "library": "node-cron 3.x",
    "tasks": [
      "Auto check-out (every hour)",
      "Membership expiry alerts (daily)",
      "Database cleanup (weekly)"
    ]
  }
}
```

---

### Infrastructure Stack
```typescript
{
  "hosting": {
    "frontend": "Vercel (Edge Network)",
    "api": "Vercel Serverless Functions",
    "region": "us-east-1 (primary)"
  },
  
  "database": {
    "provider": "Supabase (managed PostgreSQL)",
    "alternative": "Neon (serverless PostgreSQL)",
    "connection_pooling": "Prisma Data Proxy"
  },
  
  "cache": {
    "provider": "Upstash (Redis)",
    "tier": "Free (10k requests/day)"
  },
  
  "storage": {
    "provider": "Cloudflare R2 (S3-compatible)",
    "use_cases": ["avatars", "progress photos", "exports"],
    "alternative": "AWS S3"
  },
  
  "monitoring": {
    "errors": "Sentry",
    "analytics": "Vercel Analytics",
    "logging": "Vercel Logs + Pino (structured)"
  },
  
  "ci_cd": {
    "platform": "GitHub Actions",
    "workflows": [
      "Test on PR",
      "Deploy preview on push",
      "Deploy production on merge to main"
    ]
  }
}
```

---

### Development Tools
```typescript
{
  "package_manager": "npm 10+ (or pnpm 8+)",
  
  "code_quality": {
    "linter": "ESLint 8.x (Next.js config)",
    "formatter": "Prettier 3.x",
    "typescript": "TypeScript 5.3+ (strict mode)",
    "git_hooks": "Husky + lint-staged"
  },
  
  "testing": {
    "unit": "Vitest 1.x (fast, Vite-powered)",
    "integration": "Vitest + MSW (mock service worker)",
    "e2e": "Playwright 1.x",
    "coverage": "Vitest coverage (c8)"
  },
  
  "database_tools": {
    "gui": "Prisma Studio",
    "migrations": "Prisma Migrate",
    "seeding": "ts-node + Faker.js"
  },
  
  "api_testing": {
    "client": "Thunder Client (VS Code) / Postman",
    "load_testing": "k6 / Artillery"
  }
}
```

---

<a name="database"></a>
## 🗄️ DATABASE DESIGN

### Entity Relationship Diagram (ERD)
```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│      users       │
├──────────────────┤
│ id (PK)          │──────┐
│ email (UNIQUE)   │      │
│ password_hash    │      │
│ role (ENUM)      │      │
│ created_at       │      │
│ updated_at       │      │
└──────────────────┘      │
                          │ 1:1
                          │
                          ▼
                  ┌──────────────────┐
                  │     members      │
                  ├──────────────────┤
                  │ id (PK)          │──────┐
                  │ user_id (FK)     │      │
                  │ full_name        │      │
                  │ phone            │      │
                  │ date_of_birth    │      │
                  │ gender           │      │
                  │ membership_tier  │      │
                  │ membership_start │      │
                  │ membership_end   │      │
                  │ status (ENUM)    │      │
                  │ assigned_trainer │      │
                  │ created_at       │      │
                  │ updated_at       │      │
                  └──────────────────┘      │
                          │                  │ 1:N
                          │ 1:N              │
                          │                  │
        ┌─────────────────┼──────────────────┘
        │                 │
        ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│   check_ins      │  │  workout_plans   │
├──────────────────┤  ├──────────────────┤
│ id (PK)          │  │ id (PK)          │──────┐
│ member_id (FK)   │  │ member_id (FK)   │      │
│ check_in_time    │  │ created_by (FK)  │      │
│ check_out_time   │  │ title            │      │
│ created_at       │  │ is_ai_generated  │      │
└──────────────────┘  │ plan_data (JSON) │      │
                      │ input_params     │      │
                      │ is_active        │      │
                      │ created_at       │      │
                      │ updated_at       │      │
                      └──────────────────┘      │
                                                │ 1:N
                                                │
                                                ▼
                                        ┌──────────────────┐
                                        │ workout_progress │
                                        ├──────────────────┤
                                        │ id (PK)          │
                                        │ plan_id (FK)     │
                                        │ week_number      │
                                        │ day_number       │
                                        │ completed (BOOL) │
                                        │ completed_at     │
                                        │ exercise_data    │
                                        │ created_at       │
                                        └──────────────────┘
```

---

### Prisma Schema
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum Role {
  ADMIN
  TRAINER
  MEMBER
}

enum MembershipTier {
  BASIC
  PREMIUM
  VIP
}

enum MemberStatus {
  ACTIVE
  INACTIVE
  FROZEN
}

// ============================================
// USERS & AUTHENTICATION
// ============================================

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String   @map("password_hash")
  role          Role     @default(MEMBER)
  
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  // Relations
  member        Member?
  createdPlans  WorkoutPlan[] @relation("CreatedBy")
  
  @@map("users")
}

// ============================================
// MEMBERS
// ============================================

model Member {
  id                String         @id @default(uuid())
  userId            String         @unique @map("user_id")
  
  // Personal Info
  fullName          String         @map("full_name")
  phone             String?
  dateOfBirth       DateTime?      @map("date_of_birth")
  gender            String?
  
  // Membership Info
  membershipTier    MembershipTier @default(BASIC) @map("membership_tier")
  membershipStart   DateTime       @map("membership_start")
  membershipEnd     DateTime       @map("membership_end")
  status            MemberStatus   @default(ACTIVE)
  
  // Trainer Assignment
  assignedTrainerId String?        @map("assigned_trainer_id")
  
  // Metadata
  createdAt         DateTime       @default(now()) @map("created_at")
  updatedAt         DateTime       @updatedAt @map("updated_at")
  
  // Relations
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  checkIns          CheckIn[]
  workoutPlans      WorkoutPlan[]
  
  // Indexes for performance
  @@index([status])
  @@index([membershipEnd])
  @@index([assignedTrainerId])
  @@map("members")
}

// ============================================
// CHECK-INS (Real-time Capacity)
// ============================================

model CheckIn {
  id           String    @id @default(uuid())
  memberId     String    @map("member_id")
  
  checkInTime  DateTime  @default(now()) @map("check_in_time")
  checkOutTime DateTime? @map("check_out_time")
  
  createdAt    DateTime  @default(now()) @map("created_at")
  
  // Relations
  member       Member    @relation(fields: [memberId], references: [id], onDelete: Cascade)
  
  // Indexes for capacity queries
  @@index([memberId])
  @@index([checkInTime])
  @@index([checkOutTime])
  @@map("check_ins")
}

// ============================================
// WORKOUT PLANS (AI-Generated)
// ============================================

model WorkoutPlan {
  id              String   @id @default(uuid())
  memberId        String   @map("member_id")
  createdBy       String   @map("created_by")
  
  // Plan metadata
  title           String
  isAiGenerated   Boolean  @default(false) @map("is_ai_generated")
  
  // Plan data (JSON structure)
  planData        Json     @map("plan_data")
  // Structure:
  // {
  //   planSummary: string,
  //   weeks: [{
  //     weekNumber: number,
  //     focus: string,
  //     days: [{
  //       dayNumber: number,
  //       title: string,
  //       exercises: [{ name, sets, reps, rest, notes }]
  //     }]
  //   }],
  //   nutritionTips: string[],
  //   progressionNotes: string
  // }
  
  // Input parameters (for AI-generated plans)
  inputParams     Json?    @map("input_params")
  // { age, gender, fitnessLevel, goals, daysPerWeek, ... }
  
  // Status
  isActive        Boolean  @default(true) @map("is_active")
  
  // Timestamps
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  // Relations
  member          Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)
  creator         User     @relation("CreatedBy", fields: [createdBy], references: [id])
  progress        WorkoutProgress[]
  
  @@index([memberId])
  @@index([createdBy])
  @@index([isActive])
  @@map("workout_plans")
}

// ============================================
// WORKOUT PROGRESS TRACKING
// ============================================

model WorkoutProgress {
  id             String      @id @default(uuid())
  planId         String      @map("plan_id")
  
  weekNumber     Int         @map("week_number")
  dayNumber      Int         @map("day_number")
  
  completed      Boolean     @default(false)
  completedAt    DateTime?   @map("completed_at")
  
  // Optional: detailed exercise completion
  exerciseData   Json?       @map("exercise_data")
  // [{ exerciseName: string, actualSets: number, actualReps: number, notes: string }]
  
  createdAt      DateTime    @default(now()) @map("created_at")
  
  // Relations
  workoutPlan    WorkoutPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  
  @@unique([planId, weekNumber, dayNumber])
  @@index([planId])
  @@map("workout_progress")
}

// ============================================
// AI USAGE LOGS (Optional - Cost Monitoring)
// ============================================

model AIUsageLog {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  
  endpoint    String   // "generate-workout"
  model       String   // "gpt-4-turbo"
  tokensUsed  Int      @map("tokens_used")
  cost        Float    // in USD
  
  createdAt   DateTime @default(now()) @map("created_at")
  
  @@index([userId])
  @@index([createdAt])
  @@map("ai_usage_logs")
}
```

---

### Database Indexes (Performance Optimization)
```sql
-- Full-text search on members (name, phone)
CREATE INDEX members_search_idx ON members 
  USING GIN (to_tsvector('english', full_name || ' ' || COALESCE(phone, '')));

-- Active check-ins (for capacity calculation)
CREATE INDEX check_ins_active_idx ON check_ins (check_in_time) 
  WHERE check_out_time IS NULL;

-- Expiring memberships (for alerts)
CREATE INDEX members_expiring_idx ON members (membership_end) 
  WHERE status = 'ACTIVE' AND membership_end > NOW();

-- Composite index for trainer queries
CREATE INDEX members_trainer_status_idx ON members (assigned_trainer_id, status);
```

---

### Data Seeding Strategy
```typescript
// prisma/seed.ts

import { PrismaClient, Role, MembershipTier, MemberStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@thrust.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin created');

  // 2. Create 5 Trainers
  const trainers = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      const trainerPassword = await bcrypt.hash('Trainer123!', 12);
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          passwordHash: trainerPassword,
          role: Role.TRAINER,
        },
      });
    })
  );
  console.log('✅ 5 Trainers created');

  // 3. Create 10,000 Members
  const batchSize = 1000;
  for (let i = 0; i < 10; i++) {
    const members = Array.from({ length: batchSize }).map(() => {
      const membershipStart = faker.date.past({ years: 2 });
      const membershipDuration = faker.number.int({ min: 3, max: 12 }); // months
      const membershipEnd = new Date(membershipStart);
      membershipEnd.setMonth(membershipEnd.getMonth() + membershipDuration);

      return {
        email: faker.internet.email(),
        passwordHash: bcrypt.hashSync('Member123!', 12),
        role: Role.MEMBER,
        member: {
          create: {
            fullName: faker.person.fullName(),
            phone: faker.phone.number('+91 ##########'),
            dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
            gender: faker.helpers.arrayElement(['male', 'female', 'other']),
            membershipTier: faker.helpers.arrayElement([
              MembershipTier.BASIC,
              MembershipTier.PREMIUM,
              MembershipTier.VIP,
            ]),
            membershipStart,
            membershipEnd,
            status: membershipEnd > new Date() ? MemberStatus.ACTIVE : MemberStatus.INACTIVE,
            assignedTrainerId: faker.helpers.arrayElement(trainers).id,
          },
        },
      };
    });

    await prisma.user.createMany({ data: members });
    console.log(`✅ Batch ${i + 1}/10 created (${(i + 1) * batchSize} members)`);
  }

  // 4. Create random check-ins (last 30 days)
  const allMembers = await prisma.member.findMany({ select: { id: true } });
  const checkIns = allMembers.flatMap((member) => {
    const count = faker.number.int({ min: 5, max: 30 });
    return Array.from({ length: count }).map(() => {
      const checkInTime = faker.date.recent({ days: 30 });
      const duration = faker.number.int({ min: 30, max: 180 }); // 30-180 mins
      const checkOutTime = new Date(checkInTime.getTime() + duration * 60000);

      return {
        memberId: member.id,
        checkInTime,
        checkOutTime,
      };
    });
  });

  const checkInBatchSize = 5000;
  for (let i = 0; i < checkIns.length; i += checkInBatchSize) {
    await prisma.checkIn.createMany({
      data: checkIns.slice(i, i + checkInBatchSize),
    });
    console.log(`✅ Check-ins batch ${Math.floor(i / checkInBatchSize) + 1}`);
  }

  console.log('🎉 Seeding completed!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Usage**:
```bash
npx prisma db seed
```

---

<a name="api"></a>
## 🔌 API DESIGN

### API Architecture Principles

1. **RESTful**: Standard HTTP methods (GET, POST, PATCH, DELETE)
2. **Consistent**: Predictable URL patterns, response formats
3. **Versioned**: `/api/v1/...` (future-proof)
4. **Authenticated**: All routes except login/signup require JWT
5. **Validated**: Zod schemas for all inputs
6. **Error Handling**: Consistent error responses

---

### API Route Structure
```
/api/
├── auth/
│   ├── signup/route.ts        POST   - Create new user
│   ├── login/route.ts         POST   - Authenticate user
│   ├── refresh/route.ts       POST   - Refresh access token
│   ├── logout/route.ts        POST   - Invalidate session
│   └── me/route.ts            GET    - Get current user
│
├── members/
│   ├── route.ts               GET    - List members (paginated, filtered)
│   │                          POST   - Create member
│   ├── [id]/
│   │   └── route.ts           GET    - Get member by ID
│   │                          PATCH  - Update member
│   │                          DELETE - Delete member
│   ├── bulk-action/route.ts   POST   - Bulk activate/deactivate
│   └── export/route.ts        GET    - Export to CSV
│
├── check-ins/
│   ├── route.ts               GET    - List check-ins
│   │                          POST   - Check-in member
│   ├── [id]/route.ts          PATCH  - Check-out member
│   ├── current/route.ts       GET    - Current capacity
│   └── history/route.ts       GET    - Historical capacity data
│
├── workout-plans/
│   ├── route.ts               GET    - List plans
│   │                          POST   - Create plan (manual)
│   ├── [id]/route.ts          GET    - Get plan
│   │                          PATCH  - Update plan
│   │                          DELETE - Delete plan
│   └── [id]/progress/route.ts POST   - Mark day as complete
│
├── ai/
│   └── generate-workout/route.ts POST - Generate AI workout plan
│
└── settings/
    ├── profile/route.ts       PATCH  - Update user profile
    ├── password/route.ts      PATCH  - Change password
    └── gym/route.ts           GET    - Get gym config
                               PATCH  - Update gym config (admin only)
```

---

### API Response Formats

#### Success Response
```typescript
// GET /api/members
{
  "data": [...],
  "pagination": {
    "total": 10234,
    "page": 1,
    "limit": 50,
    "totalPages": 205
  }
}

// POST /api/check-ins
{
  "data": {
    "id": "uuid",
    "memberId": "uuid",
    "checkInTime": "2026-02-08T10:30:00Z"
  },
  "meta": {
    "capacity": {
      "current": 47,
      "max": 100
    }
  }
}
```

#### Error Response
```typescript
// 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}

// 401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}

// 403 Forbidden
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}

// 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req_abc123" // for debugging
  }
}
```

---

### API Authentication Flow
```typescript
// middleware.ts (Next.js Middleware)

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

const publicPaths = ['/login', '/signup', '/api/auth/login', '/api/auth/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for access token in cookies
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    // Redirect to login for page routes
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Return 401 for API routes
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    );
  }

  try {
    // Verify token
    const payload = await verifyToken(token);

    // Attach user info to request headers (for API routes)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid/expired token
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

<a name="auth"></a>
## 🔐 AUTHENTICATION & SECURITY

### JWT Token Structure
```typescript
// Access Token (24h expiry)
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "ADMIN" | "TRAINER" | "MEMBER",
  "iat": 1707350400, // issued at
  "exp": 1707436800  // expires at
}

// Refresh Token (30d expiry)
{
  "userId": "uuid",
  "tokenId": "uuid", // for revocation
  "iat": 1707350400,
  "exp": 1709942400
}
```

---

### Password Security
```typescript
// lib/auth/password.ts

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Password strength validation (Zod schema)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
```

---

### Rate Limiting
```typescript
// lib/rate-limit.ts

import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number }> {
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, Math.floor(windowMs / 1000));
  }
  
  const ttl = await redis.ttl(key);
  const remaining = Math.max(0, limit - current);
  
  return {
    allowed: current <= limit,
    remaining,
  };
}

// Usage in API route
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { allowed, remaining } = await rateLimit(
    `login:${ip}`,
    5, // max 5 attempts
    15 * 60 * 1000 // per 15 minutes
  );
  
  if (!allowed) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many attempts. Try again later.' } },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }
  
  // Continue with login logic...
}
```

---

### RBAC Enforcement
```typescript
// lib/auth/rbac.ts

import { Role } from '@prisma/client';

type Permission = 
  | 'members:view_all'
  | 'members:view_assigned'
  | 'members:create'
  | 'members:edit_all'
  | 'members:edit_assigned'
  | 'members:delete'
  | 'workout:create'
  | 'workout:edit'
  | 'settings:manage';

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    'members:view_all',
    'members:create',
    'members:edit_all',
    'members:delete',
    'workout:create',
    'workout:edit',
    'settings:manage',
  ],
  TRAINER: [
    'members:view_assigned',
    'members:edit_assigned',
    'workout:create',
    'workout:edit',
  ],
  MEMBER: [],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

// Middleware helper
export function requirePermission(permission: Permission) {
  return (role: Role) => {
    if (!hasPermission(role, permission)) {
      throw new Error('FORBIDDEN');
    }
  };
}

// Usage in API route
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const role = request.headers.get('x-user-role') as Role;
  
  requirePermission('members:delete')(role);
  
  // Continue with delete logic...
}
```

---

<a name="realtime"></a>
## ⚡ REAL-TIME ARCHITECTURE

### WebSocket Server Setup
```typescript
// lib/websocket/server.ts

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyToken } from '@/lib/auth/jwt';

let io: SocketIOServer;

export function initWebSocketServer(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    try {
      const payload = await verifyToken(token);
      socket.data.userId = payload.userId;
      socket.data.role = payload.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.userId}`);

    // Join capacity room
    socket.join('capacity');

    // Heartbeat
    const heartbeat = setInterval(() => {
      socket.emit('ping', { timestamp: Date.now() });
    }, 30000);

    socket.on('pong', (data) => {
      // Client is alive
    });

    socket.on('disconnect', () => {
      clearInterval(heartbeat);
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('WebSocket server not initialized');
  }
  return io;
}
```

---

### Event Handlers
```typescript
// lib/websocket/events.ts

import { getIO } from './server';
import { CheckInService } from '@/lib/services/CheckInService';

export async function broadcastCapacityUpdate(type: 'check-in' | 'check-out', memberName: string) {
  const io = getIO();
  const capacity = await CheckInService.getCurrentCapacity();
  
  io.to('capacity').emit('capacity-update', {
    type,
    memberName,
    capacity,
    timestamp: new Date().toISOString(),
  });
}

export async function broadcastActivityEvent(event: {
  type: 'check-in' | 'check-out';
  memberId: string;
  memberName: string;
  timestamp: string;
}) {
  const io = getIO();
  io.to('capacity').emit('activity-feed', event);
}
```

---

### Client-Side Hook
```typescript
// hooks/useWebSocket.ts

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface CapacityUpdate {
  type: 'check-in' | 'check-out';
  memberName: string;
  capacity: { current: number; max: number };
  timestamp: string;
}

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [capacity, setCapacity] = useState<{ current: number; max: number } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('capacity-update', (data: CapacityUpdate) => {
      setCapacity(data.capacity);
    });

    socketInstance.on('ping', () => {
      socketInstance.emit('pong', { timestamp: Date.now() });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [accessToken]);

  return { socket, capacity, isConnected };
}
```

---

<a name="ai"></a>
## 🤖 AI INTEGRATION

### OpenAI Service
```typescript
// lib/services/AIService.ts

import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const workoutPlanInputSchema = z.object({
  age: z.number().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  currentFitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  goals: z.array(z.enum(['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'strength'])),
  daysPerWeek: z.number().min(3).max(7),
  minutesPerSession: z.enum([30, 45, 60, 90]),
  equipment: z.enum(['home_bodyweight', 'home_basic', 'full_gym']),
  injuries: z.string().optional(),
});

const workoutPlanOutputSchema = z.object({
  planSummary: z.string(),
  weeks: z.array(z.object({
    weekNumber: z.number(),
    focus: z.string(),
    days: z.array(z.object({
      dayNumber: z.number(),
      title: z.string(),
      exercises: z.array(z.object({
        name: z.string(),
        sets: z.number(),
        reps: z.string(),
        rest: z.string(),
        notes: z.string(),
      })),
    })),
  })),
  nutritionTips: z.array(z.string()),
  progressionNotes: z.string(),
});

export class AIService {
  static async generateWorkoutPlan(input: z.infer<typeof workoutPlanInputSchema>) {
    const systemPrompt = `You are a certified personal trainer with 10+ years of experience. 
Generate scientifically-backed, progressive workout plans that are safe and effective.
Always return valid JSON matching the specified structure.`;

    const userPrompt = `Create a personalized 4-week workout plan with the following specifications:

MEMBER PROFILE:
- Age: ${input.age}, Gender: ${input.gender}
- Current fitness level: ${input.currentFitnessLevel}

GOALS: ${input.goals.join(', ')}

CONSTRAINTS:
- Available: ${input.daysPerWeek} days/week
- Session duration: ${input.minutesPerSession} minutes
- Equipment: ${input.equipment}
${input.injuries ? `- Injuries/Limitations: ${input.injuries}` : ''}

REQUIREMENTS:
1. Provide a 4-week progressive plan (weeks 1-4)
2. Each workout day should include:
   - Warm-up (5-10 mins)
   - Main exercises (sets, reps, rest time)
   - Cool-down/stretching (5 mins)
3. Include rest days strategically
4. Progressive overload across weeks
5. Exercise variety to prevent boredom

Return ONLY valid JSON with this structure:
{
  "planSummary": "Brief overview",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "days": [
        {
          "dayNumber": 1,
          "title": "Upper Body Strength",
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "10-12",
              "rest": "60s",
              "notes": "Keep core tight"
            }
          ]
        }
      ]
    }
  ],
  "nutritionTips": ["Tip 1", "Tip 2"],
  "progressionNotes": "How to progress"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No content from AI');

    const plan = JSON.parse(content);
    const validatedPlan = workoutPlanOutputSchema.parse(plan);

    return {
      plan: validatedPlan,
      metadata: {
        model: 'gpt-4-turbo-preview',
        tokensUsed: completion.usage?.total_tokens || 0,
        cost: ((completion.usage?.total_tokens || 0) * 0.00001), // Estimate
      },
    };
  }
}
```

---

<a name="frontend"></a>
## 🎨 FRONTEND ARCHITECTURE

### Component Structure
```
components/
├── layout/                     # App shell
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── Providers.tsx
│
├── ui/                         # Reusable primitives (shadcn)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   └── ...
│
├── dashboard/                  # Dashboard-specific
│   ├── CapacityCard.tsx
│   ├── ActivityFeed.tsx
│   ├── MetricCard.tsx
│   └── OccupancyChart.tsx
│
├── members/                    # Member management
│   ├── MemberList.tsx          # Virtualized list
│   ├── MemberCard.tsx
│   ├── MemberFilters.tsx
│   ├── MemberSearch.tsx
│   └── MemberForm.tsx
│
└── ai-planner/                 # AI workout planner
    ├── WorkoutPlanForm.tsx
    ├── PlanDisplay.tsx
    ├── PlanEditor.tsx
    └── ExerciseCard.tsx
```

---

### State Management Strategy
```typescript
// Server State (React Query)
// - Member data
// - Workout plans
// - Check-ins
// - User profile

// Client State (Zustand)
// - UI state (sidebar collapsed, modals open)
// - Filters/search inputs
// - Form drafts

// Real-time State (WebSocket + React Query)
// - Live capacity
// - Activity feed
```

---

<a name="infrastructure"></a>
## 🚀 INFRASTRUCTURE & DEPLOYMENT

### Vercel Deployment
```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret",
    "OPENAI_API_KEY": "@openai-key"
  }
}
```

---

<a name="performance"></a>
## ⚡ PERFORMANCE & SCALABILITY

### Optimization Strategies

1. **Code Splitting**: Automatic (Next.js)
2. **Image Optimization**: next/image
3. **Font Optimization**: next/font
4. **Database Queries**: Indexes, pagination
5. **Caching**: React Query (5min), Redis
6. **Virtualization**: @tanstack/react-virtual
7. **Bundle Size**: Tree-shaking, dynamic imports

---

<a name="monitoring"></a>
## 📊 MONITORING & OBSERVABILITY

### Sentry Setup
```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

---

**END OF ARCHITECTURE DOCUMENT**

---

## 💾 SAVE THIS FILE

**Filename**: `THRUST_ARCHITECTURE.md`

**Save in project root alongside**:
- `THRUST_PROJECT_CONTEXT.md`
- `THRUST_PRD.md`

**Ready to start building? Let me know!** 🚀
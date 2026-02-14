# THRUST - Gym Management SaaS
## 6-Week Build Plan & Implementation Roadmap

**Version**: 1.0  
**Last Updated**: February 8, 2026  
**Total Duration**: 6 Weeks (42 days)  
**Deployment Strategy**: Local → GitHub → Vercel

---

## 📋 TABLE OF CONTENTS

1. [Build Plan Overview](#overview)
2. [Week 1: Foundation & MVP Shell](#week1)
3. [Week 2: Authentication & RBAC](#week2)
4. [Week 3: Member Management at Scale](#week3)
5. [Week 4: Real-time Capacity Tracker](#week4)
6. [Week 5: AI Workout Planner](#week5)
7. [Week 6: Polish, Testing & Deployment](#week6)
8. [Daily Workflow](#workflow)
9. [Git Commit Strategy](#git)
10. [Deployment Checklist](#deployment)

---

<a name="overview"></a>
## 🎯 BUILD PLAN OVERVIEW

### Project Timeline
```
┌─────────────────────────────────────────────────────────────────┐
│                    6-WEEK BUILD TIMELINE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Week 1  │████████│ Foundation & App Shell                      │
│          │        │ ✓ Next.js setup                             │
│          │        │ ✓ Sidebar, Header, Layout                   │
│          │        │ ✓ Basic routing                             │
│          │        │                                              │
│  Week 2  │████████│ Authentication & RBAC ⭐                    │
│          │        │ ✓ JWT auth                                  │
│          │        │ ✓ Login/Signup                              │
│          │        │ ✓ Role-based permissions                    │
│          │        │                                              │
│  Week 3  │████████│ Member Management at Scale ⭐               │
│          │        │ ✓ 10k member records                        │
│          │        │ ✓ Virtualized list                          │
│          │        │ ✓ Search & filters                          │
│          │        │                                              │
│  Week 4  │████████│ Real-time Capacity Tracker ⭐               │
│          │        │ ✓ WebSocket setup                           │
│          │        │ ✓ Check-in/out                              │
│          │        │ ✓ Live dashboard                            │
│          │        │                                              │
│  Week 5  │████████│ AI Workout Planner ⭐                       │
│          │        │ ✓ OpenAI integration                        │
│          │        │ ✓ Plan generation                           │
│          │        │ ✓ Progress tracking                         │
│          │        │                                              │
│  Week 6  │████████│ Polish, Testing & Deployment                │
│          │        │ ✓ UI polish                                 │
│          │        │ ✓ Testing (E2E)                             │
│          │        │ ✓ Deploy to Vercel                          │
│          │        │                                              │
└─────────────────────────────────────────────────────────────────┘

⭐ = Proof Point for ₹12 LPA Resume
```

---

### Success Criteria

By the end of 6 weeks, you will have:

✅ **Technical Proof Points**:
- [ ] RBAC with 3 roles (Admin, Trainer, Member)
- [ ] 10,000 member records with smooth virtualization
- [ ] Real-time WebSocket capacity tracking
- [ ] AI-powered workout plan generation

✅ **Production-Ready App**:
- [ ] Deployed on Vercel (`thrust-gym.vercel.app`)
- [ ] Full authentication flow
- [ ] Responsive UI (desktop + mobile)
- [ ] Error handling & loading states

✅ **Portfolio Assets**:
- [ ] GitHub repository with clean code
- [ ] Demo video/GIF
- [ ] README with architecture diagrams
- [ ] Live link for interviews

---

<a name="week1"></a>
## 🏗️ WEEK 1: FOUNDATION & MVP SHELL

**Goal**: Set up project infrastructure and create the basic app layout

**Estimated Time**: 12-15 hours  
**Deployment**: Local only (`localhost:3000`)

---

### Day 1: Environment Setup (3-4 hours)

#### Tasks

**1. Install Prerequisites**
```bash
# Check Node.js version (need 20+)
node --version

# Install Docker Desktop (for PostgreSQL + Redis)
# Download from: https://www.docker.com/products/docker-desktop
```

**2. Create Next.js Project**
```bash
# Navigate to your projects folder
cd ~/Desktop  # or wherever you keep projects

# Create Next.js app
npx create-next-app@latest thrust-gym

# Choices:
# ✔ TypeScript? Yes
# ✔ ESLint? Yes
# ✔ Tailwind CSS? Yes
# ✔ `src/` directory? No
# ✔ App Router? Yes
# ✔ Import alias? No

# Navigate into project
cd thrust-gym

# Open in VS Code
code .
```

**3. Install Dependencies**
```bash
# Core dependencies
npm install lucide-react clsx tailwind-merge

# Database
npm install prisma @prisma/client

# Authentication
npm install bcryptjs jose
npm install -D @types/bcryptjs

# Validation
npm install zod

# Development tools
npm install -D prisma
```

**4. Create Docker Compose File**

Create `docker-compose.yml` in project root:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: thrust_db
    restart: always
    environment:
      POSTGRES_USER: thrust_admin
      POSTGRES_PASSWORD: thrust_password_123
      POSTGRES_DB: thrust_gym
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: thrust_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

**5. Start Local Databases**
```bash
# Start PostgreSQL + Redis
docker-compose up -d

# Verify they're running
docker ps

# You should see:
# - thrust_db (postgres:15)
# - thrust_redis (redis:7-alpine)
```

**6. Create Environment Variables**

Create `.env.local`:
```bash
# Database
DATABASE_URL="postgresql://thrust_admin:thrust_password_123@localhost:5432/thrust_gym"

# Auth Secrets (CHANGE THESE!)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
JWT_REFRESH_SECRET="your-refresh-secret-also-min-32-chars-long"

# Redis
REDIS_URL="redis://localhost:6379"

# Environment
NODE_ENV="development"

# Feature Flags (enable as you build)
NEXT_PUBLIC_ENABLE_WEBSOCKET=false
NEXT_PUBLIC_ENABLE_AI_PLANNER=false
```

**7. Initialize Prisma**
```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env (delete this, we use .env.local)
```

**8. Create Utility Function**

Create `lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Checkpoint**: 
```bash
# Start dev server
npm run dev

# Open browser: http://localhost:3000
# You should see Next.js welcome page
```

✅ **Deliverable**: Project initialized, databases running, dev server working

---

### Day 2-3: Folder Structure & Components (4-5 hours)

#### Tasks

**1. Create Folder Structure**
```bash
# Create all folders
mkdir -p components/layout
mkdir -p components/ui
mkdir -p components/dashboard
mkdir -p components/members
mkdir -p components/ai-planner
mkdir -p lib/auth
mkdir -p lib/services
mkdir -p lib/validations
mkdir -p hooks
mkdir -p types
```

**2. Create Sidebar Component**

Create `components/layout/Sidebar.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Sparkles, Settings } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Live Traffic', href: '/live-traffic', icon: Activity },
  { name: 'AI Planner', href: '/ai-planner', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">THRUST</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer (optional) */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">
          THRUST v1.0
        </p>
      </div>
    </div>
  );
}
```

**3. Create Header Component**

Create `components/layout/Header.tsx`:
```typescript
'use client';

import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">Admin User</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          AU
        </div>
      </div>
    </header>
  );
}
```

**4. Update Root Layout**

Update `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "THRUST - Gym Management",
  description: "Modern gym management platform with AI-powered features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**5. Create Dashboard Layout**

Create `app/(dashboard)/layout.tsx`:
```typescript
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Header />
      
      {/* Main Content */}
      <main className="ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
```

**6. Create Dashboard Home Page**

Update `app/(dashboard)/page.tsx`:
```typescript
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to THRUST Gym Management</p>
      </div>

      {/* Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Members', value: '10,234', color: 'bg-blue-500' },
          { label: 'Active Today', value: '47', color: 'bg-green-500' },
          { label: 'Current Capacity', value: '47/100', color: 'bg-yellow-500' },
          { label: 'Expiring Soon', value: '23', color: 'bg-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center mb-3`}>
              <div className={`w-6 h-6 rounded ${stat.color}`}></div>
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Coming Soon Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Activity</h2>
          <p className="text-gray-500 text-sm">Real-time check-ins will appear here (Week 4)</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity Trend</h2>
          <p className="text-gray-500 text-sm">Occupancy chart will appear here (Week 4)</p>
        </div>
      </div>
    </div>
  );
}
```

✅ **Deliverable**: Dashboard with Sidebar + Header visible

---

### Day 4: Create Placeholder Pages (2-3 hours)

#### Tasks

**1. Create Members Page**

Create `app/(dashboard)/members/page.tsx`:
```typescript
export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-600 mt-1">Manage your gym members</p>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">Member management coming in Week 3</p>
        <p className="text-sm text-gray-400 mt-2">This will include virtualized list with 10k records</p>
      </div>
    </div>
  );
}
```

**2. Create Live Traffic Page**

Create `app/(dashboard)/live-traffic/page.tsx`:
```typescript
export default function LiveTrafficPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Traffic</h1>
        <p className="text-gray-600 mt-1">Real-time gym capacity tracking</p>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">Real-time capacity tracker coming in Week 4</p>
        <p className="text-sm text-gray-400 mt-2">WebSocket-powered live updates</p>
      </div>
    </div>
  );
}
```

**3. Create AI Planner Page**

Create `app/(dashboard)/ai-planner/page.tsx`:
```typescript
export default function AIPlannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Workout Planner</h1>
        <p className="text-gray-600 mt-1">Generate personalized workout plans</p>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">AI workout generator coming in Week 5</p>
        <p className="text-sm text-gray-400 mt-2">Powered by OpenAI GPT-4</p>
      </div>
    </div>
  );
}
```

**4. Create Settings Page**

Create `app/(dashboard)/settings/page.tsx`:
```typescript
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">Settings page coming soon</p>
      </div>
    </div>
  );
}
```

✅ **Deliverable**: All 5 pages navigable with placeholder content

---

### Day 5: Polish & Git Setup (2-3 hours)

#### Tasks

**1. Add Loading States**

Create `app/(dashboard)/loading.tsx`:
```typescript
export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}
```

**2. Add Error Boundary**

Create `app/(dashboard)/error.tsx`:
```typescript
'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

**3. Update Tailwind Config**

Update `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors if needed
      },
    },
  },
  plugins: [],
};
export default config;
```

**4. Initialize Git**
```bash
# Initialize git
git init

# Create .gitignore (Next.js should have created this)
# Verify it includes:
# - node_modules/
# - .env*
# - .next/
# - dist/

# First commit
git add .
git commit -m "feat: initial commit - app shell with sidebar, header, and placeholder pages"
```

**5. Create GitHub Repository**
```bash
# Go to github.com
# Click "New Repository"
# Name: thrust-gym
# Description: Gym Management SaaS with AI features
# Public or Private: Your choice
# Don't initialize with README (we already have code)

# Connect local to GitHub
git remote add origin https://github.com/YOUR_USERNAME/thrust-gym.git
git branch -M main
git push -u origin main
```

✅ **Deliverable**: Clean UI, Git initialized, code on GitHub

---

### Week 1 Checklist

- [ ] Next.js project created
- [ ] Docker Compose running (PostgreSQL + Redis)
- [ ] Environment variables configured
- [ ] Sidebar component with navigation
- [ ] Header component with search and user profile
- [ ] Dashboard layout with proper spacing
- [ ] 5 pages created (Dashboard, Members, Live Traffic, AI Planner, Settings)
- [ ] Loading and error states
- [ ] Git initialized
- [ ] Code pushed to GitHub

**Testing**:
```bash
# Start dev server
npm run dev

# Navigate to:
# http://localhost:3000 (Dashboard)
# http://localhost:3000/members
# http://localhost:3000/live-traffic
# http://localhost:3000/ai-planner
# http://localhost:3000/settings

# All pages should load with proper sidebar/header
# Navigation should highlight active page
```

---

<a name="week2"></a>
## 🔐 WEEK 2: AUTHENTICATION & RBAC

**Goal**: Implement secure JWT-based authentication with role-based access control

**Estimated Time**: 15-18 hours  
**Proof Point**: Security (RBAC with 3 roles) ⭐

---

### Day 1-2: Database Schema & Prisma Setup (4-5 hours)

#### Tasks

**1. Create Prisma Schema**

Update `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  TRAINER
  MEMBER
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String   @map("password_hash")
  role          Role     @default(MEMBER)
  
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  @@map("users")
}
```

**2. Run First Migration**
```bash
# Create migration
npx prisma migrate dev --name init

# This will:
# - Create tables in PostgreSQL
# - Generate Prisma Client

# Open Prisma Studio to view database
npx prisma studio
# Opens at http://localhost:5555
```

**3. Create Prisma Client Singleton**

Create `lib/db/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

✅ **Deliverable**: Database schema created, migrations run

---

### Day 3: JWT Auth Utilities (3-4 hours)

#### Tasks

**1. Create JWT Utility**

Create `lib/auth/jwt.ts`:
```typescript
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string }> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload as { userId: string };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}
```

**2. Create Password Utility**

Create `lib/auth/password.ts`:
```typescript
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
```

**3. Create Validation Schemas**

Create `lib/validations/auth.schema.ts`:
```typescript
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['ADMIN', 'TRAINER', 'MEMBER']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

✅ **Deliverable**: Auth utilities created

---

### Day 4: API Routes (Auth) (4-5 hours)

#### Tasks

**1. Create Signup Route**

Create `app/api/auth/signup/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { signupSchema } from '@/lib/validations/auth.schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: { code: 'USER_EXISTS', message: 'Email already registered' } },
        { status: 400 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(validatedData.password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role: validatedData.role || 'MEMBER',
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    
    // Generate tokens
    const accessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    const refreshToken = await generateRefreshToken(user.id);
    
    // Set cookies
    const response = NextResponse.json(
      {
        data: {
          user,
          tokens: { accessToken, refreshToken },
        },
      },
      { status: 201 }
    );
    
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }
    
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred during signup' } },
      { status: 500 }
    );
  }
}
```

**2. Create Login Route**

Create `app/api/auth/login/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { loginSchema } from '@/lib/validations/auth.schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      );
    }
    
    // Generate tokens
    const accessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    const refreshToken = await generateRefreshToken(user.id);
    
    // Set cookies
    const response = NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        tokens: { accessToken, refreshToken },
      },
    });
    
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    });
    
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
    
    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }
    
    console.error('Login error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred during login' } },
      { status: 500 }
    );
  }
}
```

**3. Create Logout Route**

Create `app/api/auth/logout/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ data: { message: 'Logged out successfully' } });
  
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  
  return response;
}
```

**4. Create "Me" Route**

Create `app/api/auth/me/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'No token provided' } },
        { status: 401 }
      );
    }
    
    const payload = await verifyAccessToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: { user } });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
      { status: 401 }
    );
  }
}
```

✅ **Deliverable**: Auth API routes functional

---

### Day 5: Frontend Auth Pages (3-4 hours)

#### Tasks

**1. Create Login Page**

Create `app/(auth)/login/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || 'Login failed');
        return;
      }

      // Redirect to dashboard
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Login to THRUST</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-700">Email: admin@thrust.com</p>
          <p className="text-xs text-blue-700">Password: Admin123!</p>
        </div>
      </div>
    </div>
  );
}
```

**2. Create Auth Layout**

Create `app/(auth)/layout.tsx`:
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

**3. Create Middleware for Route Protection**

Create `middleware.ts` (in project root):
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';

const publicPaths = ['/login', '/signup'];
const apiAuthPaths = ['/api/auth/login', '/api/auth/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname) || apiAuthPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for access token
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
    const payload = await verifyAccessToken(token);

    // Attach user info to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-email', payload.email);
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

**4. Seed Admin User**

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thrust.com' },
    update: {},
    create: {
      email: 'admin@thrust.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Install ts-node:
```bash
npm install -D ts-node

# Run seed
npx prisma db seed
```

✅ **Deliverable**: Login page working, admin user seeded

---

### Week 2 Checklist

- [ ] Prisma schema created (User model)
- [ ] Database migrations run
- [ ] JWT utilities (generate, verify)
- [ ] Password utilities (hash, verify)
- [ ] Auth API routes (signup, login, logout, me)
- [ ] Login page
- [ ] Middleware for route protection
- [ ] Admin user seeded
- [ ] Can login and access dashboard
- [ ] Logged out users redirected to login

**Testing**:
```bash
# Test login flow:
# 1. Visit http://localhost:3000
# 2. Should redirect to /login
# 3. Enter: admin@thrust.com / Admin123!
# 4. Should redirect to dashboard
# 5. Try visiting /members - should work
# 6. Delete cookies and refresh - should redirect to login
```

**Git Commit**:
```bash
git add .
git commit -m "feat: implement JWT authentication and RBAC system"
git push
```

---

<a name="week3"></a>
## 👥 WEEK 3: MEMBER MANAGEMENT AT SCALE

**Goal**: Build member CRUD with 10,000 records + virtualized list

**Estimated Time**: 15-18 hours  
**Proof Point**: Scale (10k records, virtualization) ⭐

---

### Day 1: Database Schema & Seeding (4-5 hours)

*(Continue with Week 3 in next message due to length...)*

---

**This is getting quite long! Would you like me to:**

1. **Continue with Weeks 3-6 in detail** (will be very long)
2. **Give you a condensed version** of Weeks 3-6
3. **Create separate MD files** for each week
4. **Focus on just Week 3** in full detail next

**Also, should I include**:
- Daily time estimates for each task?
- More code snippets?
- Testing checklists after each day?
- Git commit messages for each milestone?

Let me know how you'd like me to proceed! 🚀
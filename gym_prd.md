# THRUST - Gym Management SaaS
## Product Requirements Document (PRD)

**Version**: 1.0  
**Last Updated**: February 8, 2026  
**Author**: Product Team  
**Status**: In Development

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Personas](#user-personas)
4. [User Stories & Requirements](#user-stories)
5. [Feature Specifications](#features)
6. [Technical Requirements](#technical)
7. [Success Metrics](#metrics)
8. [Release Plan](#release)

---

<a name="executive-summary"></a>
## 📊 EXECUTIVE SUMMARY

### Product Vision

THRUST is a modern, AI-powered gym management platform that solves operational inefficiencies in fitness centers through automation, real-time insights, and intelligent planning.

### Problem Statement

Gyms today face four critical challenges:

1. **Manual Chaos**: Member data scattered across spreadsheets, paper logs, and memory
2. **Revenue Leakage**: 30-40% of memberships expire unnoticed, losing ₹50,000+/month
3. **Overcrowding**: No visibility into real-time capacity, leading to poor member experience
4. **Generic Programs**: Trainers spend 2+ hours creating workout plans that aren't personalized

### Solution

THRUST provides:
- ✅ **Centralized member management** with role-based access for admins, trainers, and members
- ✅ **Automated expiry alerts** to prevent revenue loss
- ✅ **Real-time capacity tracking** via WebSocket technology
- ✅ **AI-powered workout generation** reducing plan creation from 2 hours to 30 seconds

### Target Market

- **Primary**: Independent gym owners (50-500 members)
- **Secondary**: Gym chains (multi-location management - future)
- **Geography**: India (initial), Global (expansion)

### Business Goals

This project serves as a **technical portfolio piece** demonstrating:
- Enterprise-grade security (RBAC with JWT)
- Performance at scale (10,000+ members)
- Real-time architecture (WebSocket)
- Modern AI integration (OpenAI/Claude)

**Target Outcome**: Secure ₹12 LPA+ software engineering role by showcasing production-ready full-stack skills.

---

<a name="product-overview"></a>
## 🎯 PRODUCT OVERVIEW

### Core Value Propositions

| User Type | Key Value |
|-----------|-----------|
| **Gym Owner** | Reduce admin workload by 60%, prevent revenue loss, data-driven insights |
| **Trainer** | Auto-generate personalized plans, track member progress, focus on coaching |
| **Member** | Avoid crowded hours, get AI-personalized workouts, track progress digitally |

### Product Principles

1. **Security First**: Multi-layered authentication, role-based permissions
2. **Performance Obsessed**: Sub-second load times even with 10k+ records
3. **Real-time Everything**: Live updates, no refresh needed
4. **AI-Augmented**: Automate repetitive tasks, empower humans

### Product Roadmap
```
Phase 1 (MVP - 6 weeks):
├─ Week 1: App Shell + Navigation
├─ Week 2: Authentication & RBAC
├─ Week 3: Member Management (10k records)
├─ Week 4: Real-time Capacity Tracker
├─ Week 5: AI Workout Planner
└─ Week 6: Polish + Deployment

Phase 2 (Post-Launch):
├─ Multi-gym support (multi-tenancy)
├─ Payment integration (Stripe/Razorpay)
├─ Email/SMS notifications
├─ Mobile app (React Native)
└─ Advanced analytics dashboard
```

---

<a name="user-personas"></a>
## 👥 USER PERSONAS

### Persona 1: Rajesh (Gym Owner / Admin)

**Demographics**:
- Age: 35-50
- Role: Gym Owner / Manager
- Tech Savvy: Medium
- Location: Tier 1/2 cities in India

**Goals**:
- Reduce manual admin work
- Maximize revenue (prevent membership lapses)
- Monitor gym operations in real-time
- Make data-driven decisions (peak hours, retention)

**Pain Points**:
- Currently uses Excel + WhatsApp for member tracking
- Forgets to follow up on expiring memberships (loses ₹50k/month)
- No idea how many people are in gym right now
- Spends 3-4 hours/day on administrative tasks

**Jobs to be Done**:
- "When I open the dashboard, I need to see critical metrics (capacity, expirations, revenue) in 5 seconds"
- "When a membership expires in 7 days, I need an alert so I can retain that member"
- "When I hire a new trainer, I need to assign members and control their access"

**Success Criteria**:
- Admin work reduced from 4 hours to 1 hour/day
- Membership renewals increase by 25%
- Can access gym data from phone while traveling

---

### Persona 2: Priya (Personal Trainer)

**Demographics**:
- Age: 25-35
- Role: Certified Personal Trainer
- Tech Savvy: High
- Members Assigned: 15-30

**Goals**:
- Create effective, personalized workout plans quickly
- Track member attendance and progress
- Focus on coaching, not admin work

**Pain Points**:
- Spends 2+ hours creating each workout plan manually
- Plans are repetitive (copy-paste from old ones)
- No easy way to track if members actually do the workouts
- Can't see attendance patterns to follow up with inactive members

**Jobs to be Done**:
- "When a new member joins, I need to generate a 4-week personalized plan in <5 minutes"
- "When I open the app, I need to see which of my members checked in today"
- "When a member misses 3+ workouts, I need an alert to follow up"

**Success Criteria**:
- Plan creation time: 2 hours → 10 minutes
- Can manage 30 members instead of 15 (2x capacity)
- Member adherence improves due to better tracking

---

### Persona 3: Arjun (Gym Member)

**Demographics**:
- Age: 22-45
- Role: Working Professional / Student
- Tech Savvy: High
- Fitness Level: Beginner to Intermediate

**Goals**:
- Get a workout plan tailored to his goals (muscle gain)
- Avoid gym during crowded hours
- Track progress over time

**Pain Points**:
- Generic workout plans don't match his needs
- Arrives at gym during peak hours, wastes 15+ mins waiting for equipment
- No digital record of progress (just memory)
- Trainer rarely available for questions

**Jobs to be Done**:
- "When I'm deciding whether to go to gym, I need to know current capacity"
- "When I log in, I need to see today's workout (exercises, sets, reps)"
- "When I complete a workout, I need to mark it as done and track my streak"

**Success Criteria**:
- Saves 30+ mins/week by avoiding crowded hours
- Sees measurable progress (strength, consistency)
- Feels plan is personalized to him

---

<a name="user-stories"></a>
## 📖 USER STORIES & REQUIREMENTS

### Epic 1: Authentication & Authorization

#### US-1.1: User Signup
**As a** gym owner  
**I want to** create an account with email and password  
**So that** I can access the platform securely

**Acceptance Criteria**:
- ✅ Form validates email format and password strength (min 8 chars, 1 uppercase, 1 number)
- ✅ Password is hashed using bcrypt (12 rounds) before storage
- ✅ Duplicate emails are rejected with clear error message
- ✅ Upon signup, user receives JWT access token (24h expiry) and refresh token (30d expiry)
- ✅ User is automatically logged in after signup

**Priority**: P0 (Must Have)  
**Effort**: 3 story points

---

#### US-1.2: User Login
**As a** registered user  
**I want to** log in with my email and password  
**So that** I can access my account

**Acceptance Criteria**:
- ✅ Login form accepts email + password
- ✅ Invalid credentials show "Invalid email or password" (don't reveal which is wrong)
- ✅ Successful login returns JWT tokens and redirects to dashboard
- ✅ "Remember me" checkbox extends session to 30 days
- ✅ Rate limiting: Max 5 failed attempts per 15 minutes per IP

**Priority**: P0  
**Effort**: 2 story points

---

#### US-1.3: Role-Based Access Control (RBAC)
**As a** system  
**I want to** enforce role-based permissions  
**So that** users can only access features relevant to their role

**Acceptance Criteria**:
- ✅ 3 roles exist: ADMIN, TRAINER, MEMBER
- ✅ Admins can access all features
- ✅ Trainers can only view/edit their assigned members
- ✅ Members can only view their own profile and workout plans
- ✅ Unauthorized access attempts return 403 Forbidden
- ✅ UI hides inaccessible features (e.g., members don't see "Add Member" button)

**Permissions Matrix**:

| Feature | Admin | Trainer | Member |
|---------|-------|---------|--------|
| View all members | ✅ | ❌ | ❌ |
| View assigned members | ✅ | ✅ | ❌ |
| Create members | ✅ | ❌ | ❌ |
| Edit members | ✅ | ⚠️ (assigned only) | ❌ |
| Delete members | ✅ | ❌ | ❌ |
| Create workout plans | ✅ | ✅ | ❌ |
| View own profile | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| Check-in/out | ✅ | ✅ | ✅ |
| View capacity | ✅ | ✅ | ✅ |
| View analytics | ✅ | ⚠️ (limited) | ❌ |
| Manage settings | ✅ | ❌ | ❌ |

**Priority**: P0  
**Effort**: 8 story points

---

### Epic 2: Member Management

#### US-2.1: View Member List (At Scale)
**As an** admin  
**I want to** view all gym members in a performant list  
**So that** I can manage them efficiently even with 10,000+ records

**Acceptance Criteria**:
- ✅ List displays: Name, Email, Phone, Membership Tier, Status, Expiry Date
- ✅ List is virtualized (only renders visible rows)
- ✅ Initial load time: <2 seconds for 10k records
- ✅ Scrolling is smooth at 60fps
- ✅ Pagination: 50 members per page OR infinite scroll
- ✅ Shows loading skeleton during data fetch

**Performance Requirements**:
- Time to First Contentful Paint: <1.5s
- Scroll FPS: 60fps
- Memory usage: <200MB for 10k records
- Search response time: <500ms

**Priority**: P0  
**Effort**: 13 story points

---

#### US-2.2: Search Members
**As an** admin  
**I want to** search members by name, email, or phone  
**So that** I can quickly find a specific member

**Acceptance Criteria**:
- ✅ Search box at top of member list
- ✅ Search is debounced (300ms delay)
- ✅ Searches across: fullName, email, phone
- ✅ Results update in <500ms
- ✅ Highlights matching text in results
- ✅ Shows "No members found" if no matches
- ✅ Can clear search with X button

**Priority**: P0  
**Effort**: 5 story points

---

#### US-2.3: Filter Members
**As an** admin  
**I want to** filter members by status, tier, and expiry date  
**So that** I can focus on specific segments (e.g., expiring memberships)

**Acceptance Criteria**:
- ✅ Filter by Status: Active, Inactive, Frozen
- ✅ Filter by Tier: Basic, Premium, VIP
- ✅ Filter by Expiry: Expiring in 7 days, 30 days, Expired
- ✅ Filters can be combined (AND logic)
- ✅ Filter count badge shows number of active filters
- ✅ "Clear all filters" button
- ✅ Filters persist in URL query params (shareable link)

**Priority**: P1 (Should Have)  
**Effort**: 8 story points

---

#### US-2.4: Create Member
**As an** admin  
**I want to** add a new member with all required details  
**So that** they can access the gym and platform

**Acceptance Criteria**:
- ✅ Form fields: Full Name, Email, Phone, Date of Birth, Gender, Membership Tier, Start Date, End Date, Assigned Trainer (dropdown)
- ✅ Email validation (must be unique)
- ✅ Phone validation (Indian format: +91 XXXXXXXXXX)
- ✅ Date validation (DOB: must be 18+, End Date: must be after Start Date)
- ✅ Auto-creates user account with random password (sent via email - future)
- ✅ Success toast: "Member added successfully"
- ✅ Redirects to member detail page after creation

**Priority**: P0  
**Effort**: 8 story points

---

#### US-2.5: Edit Member
**As an** admin  
**I want to** update member details  
**So that** I can keep records accurate

**Acceptance Criteria**:
- ✅ Same form as "Create Member" but pre-filled
- ✅ Cannot edit email (immutable)
- ✅ Can change status (Active ↔ Frozen ↔ Inactive)
- ✅ Can extend membership end date
- ✅ Validation same as create
- ✅ Shows "Last updated: X mins ago"
- ✅ Optimistic UI update (update immediately, rollback on error)

**Priority**: P0  
**Effort**: 5 story points

---

#### US-2.6: Delete Member
**As an** admin  
**I want to** delete a member account  
**So that** I can remove inactive or duplicate members

**Acceptance Criteria**:
- ✅ Confirmation dialog: "Are you sure? This action cannot be undone."
- ✅ Soft delete (mark as deleted, don't actually remove from DB)
- ✅ Cascade deletes: workout plans, check-ins (or archive them)
- ✅ Success toast: "Member deleted"
- ✅ Redirects to member list

**Priority**: P1  
**Effort**: 3 story points

---

#### US-2.7: View Member Detail
**As an** admin  
**I want to** see a member's complete profile and activity  
**So that** I can understand their engagement

**Acceptance Criteria**:
- ✅ Displays: Personal info, membership details, assigned trainer
- ✅ Attendance history: Last 30 check-ins with timestamps
- ✅ Workout plans: List of active and past plans
- ✅ Quick actions: Edit, Delete, Extend Membership, Assign Plan
- ✅ Shows attendance streak (e.g., "7 days in a row")
- ✅ Chart: Check-ins over last 3 months

**Priority**: P1  
**Effort**: 8 story points

---

### Epic 3: Real-time Capacity Tracking

#### US-3.1: Check-in Member
**As a** trainer or admin  
**I want to** check in a member when they arrive  
**So that** capacity tracking is accurate

**Acceptance Criteria**:
- ✅ Search member by name or ID
- ✅ Click "Check In" button
- ✅ Timestamp recorded (checkInTime)
- ✅ Real-time WebSocket event broadcast to all clients: `{type: 'check-in', memberName, capacity}`
- ✅ Capacity counter increments immediately
- ✅ Activity feed shows "John Doe checked in 2 mins ago"
- ✅ Cannot check in if already checked in (show error)

**Priority**: P0  
**Effort**: 8 story points

---

#### US-3.2: Check-out Member
**As a** trainer or admin  
**I want to** check out a member when they leave  
**So that** capacity reflects current occupancy

**Acceptance Criteria**:
- ✅ Click "Check Out" on checked-in member
- ✅ Timestamp recorded (checkOutTime)
- ✅ WebSocket broadcast: `{type: 'check-out', memberName, capacity}`
- ✅ Capacity counter decrements
- ✅ Auto check-out after 3 hours (background job)
- ✅ Activity feed shows "John Doe checked out 5 mins ago"

**Priority**: P0  
**Effort**: 5 story points

---

#### US-3.3: View Live Capacity
**As any** user  
**I want to** see current gym capacity in real-time  
**So that** I can decide whether to visit now

**Acceptance Criteria**:
- ✅ Dashboard widget shows: "47 / 100 members in gym"
- ✅ Visual indicator: Green (<50%), Yellow (50-80%), Red (>80%), Full (100%)
- ✅ Updates in <2 seconds when someone checks in/out
- ✅ Shows even if user just opened the app (fetches current state)
- ✅ Handles WebSocket disconnection gracefully (shows "Reconnecting...")

**Priority**: P0  
**Effort**: 8 story points

---

#### US-3.4: View Activity Feed
**As any** user  
**I want to** see recent check-in/out events  
**So that** I know who's currently active

**Acceptance Criteria**:
- ✅ Shows last 10 events (check-ins and check-outs)
- ✅ Each event: Member name, action, timestamp (relative: "2 mins ago")
- ✅ Updates in real-time via WebSocket
- ✅ Auto-scrolls to show newest event
- ✅ "Load More" to see older events (paginated)

**Priority**: P1  
**Effort**: 5 story points

---

#### US-3.5: View Occupancy Trends
**As an** admin  
**I want to** see capacity trends over time  
**So that** I can identify peak hours and optimize staffing

**Acceptance Criteria**:
- ✅ Chart shows hourly capacity for last 24 hours
- ✅ Bar chart: X-axis = hour (6 AM, 7 AM, ...), Y-axis = avg capacity
- ✅ Highlights peak hour (e.g., "Peak: 6 PM - 68 members")
- ✅ Can toggle view: 24h, 7 days, 30 days
- ✅ Data updates daily at midnight

**Priority**: P2 (Nice to Have)  
**Effort**: 8 story points

---

### Epic 4: AI-Powered Workout Planner

#### US-4.1: Generate AI Workout Plan
**As a** trainer  
**I want to** generate a personalized 4-week workout plan using AI  
**So that** I can save time and provide better member experience

**Acceptance Criteria**:
- ✅ Form collects:
  - Member selection (dropdown)
  - Age, Gender, Height, Weight
  - Fitness level (Beginner / Intermediate / Advanced)
  - Goals (multi-select: Weight Loss, Muscle Gain, Endurance, Flexibility, Strength)
  - Days per week (3-7)
  - Minutes per session (30 / 45 / 60 / 90)
  - Equipment access (Home Bodyweight / Home Basic / Full Gym)
  - Injuries/limitations (optional text)
- ✅ Click "Generate Plan" → Shows loading spinner (~10-15s)
- ✅ AI generates structured 4-week plan (28 days)
- ✅ Each day includes: Exercises, Sets, Reps, Rest time, Notes
- ✅ Plan is editable before saving
- ✅ Click "Assign to Member" → Saves to database
- ✅ Member gets notification (future)

**AI Output Structure**:
```json
{
  "planSummary": "A progressive 5-day upper/lower split focused on hypertrophy...",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Adaptation & Foundation",
      "days": [
        {
          "dayNumber": 1,
          "title": "Upper Body Push",
          "exercises": [
            {
              "name": "Barbell Bench Press",
              "sets": 3,
              "reps": "8-10",
              "rest": "90s",
              "notes": "Focus on controlled eccentric, explode on concentric"
            },
            {
              "name": "Incline Dumbbell Press",
              "sets": 3,
              "reps": "10-12",
              "rest": "60s",
              "notes": "Keep elbows at 45-degree angle"
            }
          ]
        }
      ]
    }
  ],
  "nutritionTips": [
    "Aim for 1.6-2.2g protein per kg bodyweight",
    "Eat in a 300-500 calorie surplus for muscle gain"
  ],
  "progressionNotes": "Increase weight by 2.5-5% when you can complete all sets with 1-2 reps in reserve. Reassess after 4 weeks."
}
```

**Priority**: P0  
**Effort**: 13 story points

---

#### US-4.2: View Workout Plan
**As a** member  
**I want to** see my assigned workout plan  
**So that** I know what to do each day

**Acceptance Criteria**:
- ✅ Dashboard shows: "Your Plan for Today" widget
- ✅ Displays today's exercises with sets/reps/rest
- ✅ Can navigate to full 4-week plan view
- ✅ Weeks shown as accordion (Week 1 expanded, rest collapsed)
- ✅ Each day expandable to show full exercise list
- ✅ Can mark workout as "Complete" (checkbox)
- ✅ Completed workouts show green checkmark
- ✅ Progress bar: "12 / 28 workouts completed"

**Priority**: P0  
**Effort**: 8 story points

---

#### US-4.3: Edit Workout Plan
**As a** trainer  
**I want to** modify an AI-generated plan  
**So that** I can customize it for specific member needs

**Acceptance Criteria**:
- ✅ Click "Edit Plan" on any generated plan
- ✅ Can add/remove exercises
- ✅ Can modify sets, reps, rest time, notes
- ✅ Can reorder exercises (drag and drop)
- ✅ Can duplicate a day (e.g., repeat Day 1 for Day 3)
- ✅ Changes save automatically (debounced)
- ✅ Shows "Last edited by [Trainer Name] at [Time]"

**Priority**: P1  
**Effort**: 8 story points

---

#### US-4.4: Track Workout Progress
**As a** member  
**I want to** mark workouts as complete  
**So that** I can track my consistency

**Acceptance Criteria**:
- ✅ Checkbox next to each day: "Mark as Complete"
- ✅ Completed workouts visually distinct (green, strikethrough)
- ✅ Streak counter: "7-day streak! 🔥"
- ✅ Progress chart: Bar chart showing completions per week
- ✅ Trainer can see member's completion rate
- ✅ Notifications: "You've completed 3 workouts this week!"

**Priority**: P1  
**Effort**: 5 story points

---

### Epic 5: Dashboard & Analytics

#### US-5.1: Admin Dashboard
**As an** admin  
**I want to** see key metrics at a glance  
**So that** I can monitor gym health

**Metrics to Display**:
- ✅ Total members (breakdown: Active, Inactive, Frozen)
- ✅ Current capacity (real-time)
- ✅ Today's check-ins (count)
- ✅ Revenue (Monthly Recurring Revenue - MRR)
- ✅ Membership expiring in 7 days (alert count)
- ✅ Membership expiring in 30 days
- ✅ New members this month
- ✅ Churn rate this month

**Visualizations**:
- ✅ Live capacity card (with color coding)
- ✅ Activity feed (last 10 check-ins)
- ✅ Occupancy trend chart (last 24h)
- ✅ Membership status pie chart
- ✅ Revenue trend line chart (last 6 months)

**Priority**: P0  
**Effort**: 13 story points

---

#### US-5.2: Trainer Dashboard
**As a** trainer  
**I want to** see my assigned members' progress  
**So that** I can follow up with inactive members

**Metrics to Display**:
- ✅ Assigned members count
- ✅ Members with active workout plans
- ✅ Members with no active plans (action needed)
- ✅ Members who checked in today
- ✅ Members absent for 7+ days (follow-up needed)

**Visualizations**:
- ✅ List of assigned members (sorted by last check-in)
- ✅ Workout plan completion rate (avg across all members)
- ✅ Upcoming sessions (calendar view - future)

**Priority**: P1  
**Effort**: 8 story points

---

#### US-5.3: Member Dashboard
**As a** member  
**I want to** see my progress and upcoming workouts  
**So that** I stay motivated

**Metrics to Display**:
- ✅ Today's workout (if assigned)
- ✅ Attendance streak (consecutive days)
- ✅ Total check-ins this month
- ✅ Workout completion rate (%)
- ✅ Membership expiry countdown
- ✅ Current gym capacity (to decide whether to go)

**Visualizations**:
- ✅ Today's workout card (exercises, sets, reps)
- ✅ Progress chart (check-ins per week, last 8 weeks)
- ✅ Streak calendar (heatmap of check-in days)

**Priority**: P1  
**Effort**: 8 story points

---

### Epic 6: Settings & Administration

#### US-6.1: Update User Profile
**As any** user  
**I want to** update my profile information  
**So that** my details are current

**Acceptance Criteria**:
- ✅ Can edit: Name, Phone, Profile Picture
- ✅ Cannot edit: Email, Role (admin-only)
- ✅ Profile picture upload (max 5MB, jpg/png)
- ✅ Success toast: "Profile updated"

**Priority**: P2  
**Effort**: 5 story points

---

#### US-6.2: Change Password
**As any** user  
**I want to** change my password  
**So that** I can maintain account security

**Acceptance Criteria**:
- ✅ Requires current password for verification
- ✅ New password validation (min 8 chars, 1 uppercase, 1 number)
- ✅ Confirm password must match
- ✅ Success: "Password changed. Please log in again."
- ✅ Invalidates all existing sessions (re-login required)

**Priority**: P2  
**Effort**: 3 story points

---

#### US-6.3: Gym Configuration (Admin Only)
**As an** admin  
**I want to** configure gym settings  
**So that** the platform matches my gym's requirements

**Settings**:
- ✅ Gym name
- ✅ Address, Phone, Email
- ✅ Max capacity (for capacity tracking)
- ✅ Operating hours
- ✅ Membership tiers (Basic, Premium, VIP) with prices
- ✅ Auto check-out duration (default 3 hours)
- ✅ Expiry alert thresholds (7 days, 30 days)

**Priority**: P2  
**Effort**: 8 story points

---

<a name="features"></a>
## 🎨 FEATURE SPECIFICATIONS

### Feature Matrix

| Feature | Admin | Trainer | Member | Priority | Phase |
|---------|-------|---------|--------|----------|-------|
| **Authentication** |
| Sign up / Log in | ✅ | ✅ | ✅ | P0 | MVP |
| Password reset | ✅ | ✅ | ✅ | P2 | Post-MVP |
| **Member Management** |
| View all members | ✅ | ❌ | ❌ | P0 | MVP |
| View assigned members | ✅ | ✅ | ❌ | P0 | MVP |
| Search members | ✅ | ✅ | ❌ | P0 | MVP |
| Filter members | ✅ | ✅ | ❌ | P1 | MVP |
| Create member | ✅ | ❌ | ❌ | P0 | MVP |
| Edit member | ✅ | ⚠️ | ❌ | P0 | MVP |
| Delete member | ✅ | ❌ | ❌ | P1 | MVP |
| View member detail | ✅ | ✅ | ⚠️ | P1 | MVP |
| Bulk actions | ✅ | ❌ | ❌ | P2 | Post-MVP |
| Export to CSV | ✅ | ❌ | ❌ | P2 | Post-MVP |
| **Check-in System** |
| Manual check-in | ✅ | ✅ | ❌ | P0 | MVP |
| Self check-in | ❌ | ❌ | ✅ | P2 | Post-MVP |
| QR code check-in | ✅ | ✅ | ✅ | P2 | Post-MVP |
| Check-out | ✅ | ✅ | ✅ | P0 | MVP |
| View capacity | ✅ | ✅ | ✅ | P0 | MVP |
| View activity feed | ✅ | ✅ | ✅ | P1 | MVP |
| Occupancy analytics | ✅ | ❌ | ❌ | P2 | Post-MVP |
| **Workout Plans** |
| Generate AI plan | ✅ | ✅ | ❌ | P0 | MVP |
| View assigned plan | ✅ | ✅ | ✅ | P0 | MVP |
| Edit plan | ✅ | ✅ | ❌ | P1 | MVP |
| Delete plan | ✅ | ✅ | ❌ | P1 | MVP |
| Mark workout complete | ❌ | ❌ | ✅ | P1 | MVP |
| Track progress | ✅ | ✅ | ✅ | P1 | MVP |
| **Dashboard** |
| View metrics | ✅ | ✅ | ✅ | P0 | MVP |
| View analytics | ✅ | ⚠️ | ❌ | P1 | MVP |
| **Settings** |
| Edit profile | ✅ | ✅ | ✅ | P2 | MVP |
| Change password | ✅ | ✅ | ✅ | P2 | MVP |
| Gym configuration | ✅ | ❌ | ❌ | P2 | MVP |
| **Notifications** (Post-MVP) |
| Email alerts | ✅ | ✅ | ✅ | P2 | Phase 2 |
| Push notifications | ✅ | ✅ | ✅ | P2 | Phase 2 |
| SMS alerts | ✅ | ✅ | ✅ | P3 | Phase 2 |

**Legend**:
- ✅ Full access
- ⚠️ Limited access (based on assignment/ownership)
- ❌ No access

---

<a name="technical"></a>
## 🛠️ TECHNICAL REQUIREMENTS

### Performance Requirements

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| **Page Load** |
| Initial load (First Contentful Paint) | <1.5s | <3s |
| Time to Interactive | <2.5s | <5s |
| **API Response** |
| GET /api/members (10k records) | <1s | <2s |
| POST /api/check-in | <200ms | <500ms |
| POST /api/ai/generate-workout | <15s | <30s |
| **Real-time** |
| WebSocket latency | <100ms | <300ms |
| WebSocket reconnection time | <2s | <5s |
| **UI Performance** |
| Member list scroll FPS | 60fps | 30fps |
| Search debounce delay | 300ms | - |
| Search response time | <500ms | <1s |
| **Memory** |
| Client-side (10k members) | <150MB | <300MB |
| **Lighthouse Score** |
| Performance | >90 | >70 |
| Accessibility | >90 | >80 |
| Best Practices | >90 | >80 |
| SEO | >90 | >80 |

---

### Security Requirements

#### Authentication
- ✅ JWT-based authentication (access + refresh tokens)
- ✅ Access token expiry: 24 hours (configurable)
- ✅ Refresh token expiry: 30 days
- ✅ Password hashing: bcrypt with 12 rounds
- ✅ Password requirements: Min 8 chars, 1 uppercase, 1 number, 1 special char

#### Authorization
- ✅ Role-based access control (RBAC) with 3 roles
- ✅ API route protection via middleware
- ✅ Frontend route guards (redirect if unauthorized)
- ✅ Conditional UI rendering (hide unauthorized features)

#### Data Protection
- ✅ Input validation on all forms (Zod schemas)
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ XSS prevention (React auto-escaping + CSP headers)
- ✅ CSRF protection (tokens for mutations)
- ✅ Rate limiting:
  - Login: 5 attempts per 15 mins per IP
  - API: 100 requests per 15 mins per user
  - AI generation: 10 plans per hour per user

#### Compliance
- ✅ HTTPS only in production
- ✅ Secure cookies (httpOnly, secure, sameSite)
- ✅ Environment variables for secrets (never in code)
- ✅ Regular dependency updates (npm audit)

---

### Scalability Requirements

#### Data Volume
- ✅ Support 10,000 members per gym
- ✅ Support 100,000 check-in records per gym per year
- ✅ Support 1,000 workout plans per gym

#### Concurrent Users
- ✅ 100 concurrent WebSocket connections
- ✅ 50 concurrent API requests
- ✅ Graceful degradation under load (queue, not crash)

#### Database
- ✅ Indexes on frequently queried fields (status, membershipEnd, checkInTime)
- ✅ Pagination for large datasets (50 records per page)
- ✅ Full-text search using PostgreSQL pg_trgm

#### Caching
- ✅ Redis for WebSocket connection state
- ✅ React Query for client-side caching (5-min stale time)
- ✅ CDN for static assets (Vercel Edge Network)

---

### Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari (iOS) | 14+ |
| Chrome (Android) | 90+ |

---

### Accessibility (WCAG 2.1 Level AA)

- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Screen reader support (ARIA labels)
- ✅ Color contrast ratio: 4.5:1 (text), 3:1 (large text)
- ✅ Focus indicators (visible outline)
- ✅ Alt text for all images
- ✅ Form labels and error messages
- ✅ Skip to main content link

---

<a name="metrics"></a>
## 📊 SUCCESS METRICS

### Product Metrics (If Real Users)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Engagement** |
| Daily Active Users (DAU) | 60% of members | Analytics |
| Check-ins per member per month | 12+ | Database query |
| Workout completion rate | 70% | Progress tracking |
| **Retention** |
| Member churn rate | <5% per month | Membership expirations |
| Trainer retention | >90% | Active trainer accounts |
| **Efficiency** |
| Admin time saved | 60% reduction | User survey |
| Workout plan creation time | <10 mins (from 2h) | Time tracking |
| **Revenue** (Future) |
| Membership renewals | +25% | Comparison vs. pre-THRUST |
| Prevented revenue loss | ₹50k+/month | Expiry alerts acted on |

---

### Technical Metrics (Portfolio Proof)

| Metric | Target | Status |
|--------|--------|--------|
| **Performance** |
| Lighthouse Performance Score | >90 | 🎯 |
| Page load time (p95) | <2s | 🎯 |
| Member list scroll FPS | 60fps | 🎯 |
| **Scale** |
| Member records supported | 10,000 | 🎯 |
| Concurrent WebSocket connections | 100+ | 🎯 |
| **Security** |
| RBAC implemented | 3 roles | 🎯 |
| Critical vulnerabilities | 0 | 🎯 |
| npm audit (high/critical) | 0 | 🎯 |
| **Code Quality** |
| Test coverage | >70% | 🎯 |
| TypeScript strict mode | Enabled | ✅ |
| ESLint errors | 0 | 🎯 |
| **AI Integration** |
| Workout plans generated | 50+ (demo) | 🎯 |
| AI response time | <15s | 🎯 |
| AI success rate | >95% | 🎯 |

---

<a name="release"></a>
## 🚀 RELEASE PLAN

### MVP Release (Week 6)

**Scope**:
- ✅ Authentication & RBAC (3 roles)
- ✅ Member management (10k records, search, filters)
- ✅ Real-time capacity tracking (WebSocket)
- ✅ AI workout planner (OpenAI integration)
- ✅ Dashboards (Admin, Trainer, Member)
- ✅ Basic settings

**Out of Scope** (Post-MVP):
- ❌ Payment integration
- ❌ Email/SMS notifications
- ❌ Mobile app
- ❌ Multi-gym support
- ❌ QR code check-in
- ❌ Advanced analytics

**Deployment**:
- Platform: Vercel (Frontend + API)
- Database: Supabase (PostgreSQL)
- Cache: Upstash (Redis)
- Monitoring: Sentry
- Domain: thrust-gym.vercel.app

**Success Criteria for Release**:
- ✅ All P0 features functional
- ✅ Zero critical bugs
- ✅ Lighthouse score >90
- ✅ Load test passed (100 concurrent users)
- ✅ Security audit passed
- ✅ Documentation complete

---

### Post-MVP Roadmap (Phase 2)

**Q1 2026** (Weeks 7-10):
- Email notifications (membership expiry, plan assignment)
- Payment integration (Razorpay/Stripe)
- Bulk member import (CSV)
- Advanced filters and saved searches
- Trainer scheduling/calendar

**Q2 2026** (Weeks 11-14):
- Mobile app (React Native + Expo)
- QR code check-in
- Progress photos upload
- Nutrition tracking module
- Multi-gym support (basic multi-tenancy)

**Q3 2026** (Weeks 15-18):
- Advanced analytics dashboard
- Revenue forecasting (ML)
- Member retention predictions
- Automated marketing campaigns
- Integrations (WhatsApp, Google Calendar)

---

## 📝 APPENDIX

### Glossary

| Term | Definition |
|------|------------|
| **RBAC** | Role-Based Access Control - security model that restricts access based on user roles |
| **JWT** | JSON Web Token - compact, URL-safe token for authentication |
| **WebSocket** | Protocol for full-duplex communication over a single TCP connection |
| **Virtualization** | Rendering technique that only renders visible items in a list (for performance) |
| **MRR** | Monthly Recurring Revenue - predictable revenue from subscriptions |
| **Churn** | Percentage of members who cancel/don't renew their memberships |
| **CSP** | Content Security Policy - HTTP header to prevent XSS attacks |
| **WCAG** | Web Content Accessibility Guidelines - standards for accessible web content |

---

### Open Questions

1. **AI Model Choice**: GPT-4 ($0.03/plan) vs. Claude Sonnet ($0.015/plan)? → Decision: Start with GPT-4 Turbo, migrate to Claude if cost becomes issue
2. **Database**: PostgreSQL (Supabase) vs. MongoDB? → Decision: PostgreSQL for ACID compliance and better RBAC support
3. **Real-time**: Socket.io vs. native WebSockets vs. Pusher? → Decision: Socket.io for ease of use and reconnection handling
4. **Payment Gateway**: Stripe (global) vs. Razorpay (India-focused)? → Decision: Razorpay for Phase 2 (India market)
5. **Mobile**: React Native vs. Flutter vs. PWA? → Decision: React Native (code reuse from web)

---

### Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **OpenAI API downtime** | High | Low | Cache generated plans, fallback to manual creation |
| **WebSocket scalability issues** | High | Medium | Use Redis pub/sub for multi-instance support |
| **Database performance with 10k+ records** | High | Medium | Proper indexing, query optimization, pagination |
| **Security breach (unauthorized access)** | Critical | Low | Regular security audits, pen testing, rate limiting |
| **Browser compatibility issues** | Medium | Low | Polyfills, progressive enhancement, extensive testing |
| **AI-generated unsafe workout plans** | High | Low | Content moderation, trainer review before assignment, disclaimer |

---

### Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Feb 8, 2026 | Initial PRD created | Product Team |
| - | - | - | - |

---

**Document Owner**: Product Team  
**Reviewers**: Engineering Team, Design Team  
**Next Review Date**: After MVP Release (Week 6)

---

**END OF PRD**
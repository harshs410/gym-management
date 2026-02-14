# THRUST - Phase 1: Authentication System

## 🎯 What's New in Phase 1

You now have a complete authentication system with:

✅ **JWT-based authentication** - Secure token-based login  
✅ **Password hashing** - bcrypt encryption (one-way)  
✅ **Role-based access control** - Admin, Trainer, Member roles  
✅ **Protected routes** - Middleware blocks unauthorized access  
✅ **Login/Register pages** - Beautiful UI with validation  
✅ **Demo accounts** - Test with pre-seeded users  

---

## 📦 New Files Added

### Backend (API Routes)
- `lib/prisma.ts` - Database connection singleton
- `lib/auth.ts` - JWT utilities (generate, verify, cookies)
- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/register/route.ts` - Signup endpoint
- `app/api/auth/logout/route.ts` - Logout endpoint

### Frontend (Pages)
- `app/login/page.tsx` - Login page with form
- `app/register/page.tsx` - Registration page with role selection
- `app/dashboard/page.tsx` - Admin dashboard (protected)

### Security
- `middleware.ts` - Route protection middleware

### Database
- `prisma/seed.ts` - Creates demo users

---

## 🚀 Setup Instructions

### 1. Copy New Files to Your Project

Extract the Phase 1 files and copy them into your existing `thrust-gym` folder:

```
thrust-gym/
├── lib/                    (NEW)
├── app/api/auth/          (NEW)
├── app/login/             (NEW)
├── app/register/          (NEW)
├── app/dashboard/         (NEW)
├── middleware.ts          (NEW)
├── prisma/seed.ts         (NEW)
└── package.json           (UPDATED)
```

### 2. Install New Dependencies

```bash
npm install
```

This installs: `jose` (JWT), `bcryptjs` (password hashing), `tsx` (TypeScript runner)

### 3. Seed Demo Users

```bash
npm run db:seed
```

This creates 3 demo accounts:
- 📧 admin@thrust.com / password123 (ADMIN)
- 📧 trainer@thrust.com / password123 (TRAINER)
- 📧 member@thrust.com / password123 (MEMBER)

### 4. Start Dev Server

```bash
npm run dev
```

---

## ✅ Testing Phase 1

### Test 1: Registration Flow

1. Visit http://localhost:3000/register
2. Fill in the form:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123
   - Role: Select "Member"
3. Click "Create Account"
4. Should redirect to member dashboard (not built yet, will show error - this is normal!)

### Test 2: Login with Demo Admin

1. Visit http://localhost:3000/login
2. Enter credentials:
   - Email: admin@thrust.com
   - Password: password123
3. Click "Login"
4. Should redirect to http://localhost:3000/dashboard
5. See admin dashboard with stats (all zeros for now)

### Test 3: Protected Routes

1. Open incognito window
2. Try to visit http://localhost:3000/dashboard directly
3. Should redirect to /login (middleware blocking unauthorized access ✅)

### Test 4: Logout

1. While logged in on dashboard
2. Click the logout icon (top right)
3. Should be logged out and redirected

### Test 5: Role-Based Access

1. Login as trainer@thrust.com / password123
2. Try to visit /dashboard
3. Should be redirected (only admins can access)

---

## 🔐 How Authentication Works

### Registration Flow
```
1. User fills registration form
   └─ POST /api/auth/register

2. Backend validates input (Zod)
   └─ Email format, password length, etc.

3. Check if email already exists
   └─ Query database

4. Hash password with bcrypt
   └─ bcrypt.hash(password, 10)

5. Create user in database
   └─ prisma.user.create()

6. Generate JWT token
   └─ Contains: userId, email, role
   └─ Expires in 7 days

7. Set HTTP-only cookie
   └─ Secure, can't be accessed by JavaScript

8. Return user data (no password!)
```

### Login Flow
```
1. User enters email/password
   └─ POST /api/auth/login

2. Find user by email
   └─ prisma.user.findUnique()

3. Verify password
   └─ bcrypt.compare(password, hashedPassword)

4. Generate JWT token
   └─ Same as registration

5. Set cookie & return user data
```

### Protected Routes
```
1. User visits /dashboard
   └─ middleware.ts intercepts request

2. Check for auth cookie
   └─ request.cookies.get('token')

3. Verify JWT token
   └─ jwtVerify(token, secret)

4. Check role permissions
   └─ If admin accessing /dashboard → Allow
   └─ If member accessing /dashboard → Redirect

5. Allow or redirect
```

---

## 🎨 UI Features

### Login Page
- Email/password inputs with icons
- Client-side validation
- Error messages
- Demo account hints
- Loading state during submission

### Register Page
- Name, email, password fields
- Visual role selector (Member/Trainer/Admin)
- Password strength hint (min 6 chars)
- Automatic redirect after signup

### Dashboard
- Header with user info
- Logout button
- Stats cards (ready for real data in Phase 2)
- Welcome message
- Responsive design

---

## 🐛 Troubleshooting

### "Invalid email or password"
- Check you're using demo accounts: admin@thrust.com / password123
- Run `npm run db:seed` to create demo users

### Redirect loop after login
- Clear browser cookies
- Check .env file has JWT_SECRET

### "Cannot find module 'jose'"
- Run `npm install` again
- Delete node_modules and package-lock.json, reinstall

### Can't access dashboard
- Make sure you logged in as admin@thrust.com
- Other roles can't access /dashboard (this is correct!)

### Database errors
- Ensure Docker is running: `docker ps`
- Check DATABASE_URL in .env matches docker-compose.yml

---

## 📊 Database Changes

No schema changes needed! Your existing Prisma schema already supports:
- User table (email, password, role)
- Member table (linked to User)
- Trainer table (linked to User)

---

## 🎯 Phase 1 Complete!

You now have:
- ✅ Secure authentication system
- ✅ Role-based permissions (RBAC)
- ✅ Protected routes
- ✅ Beautiful login/register UI
- ✅ JWT tokens with 7-day expiry
- ✅ Password hashing (bcrypt)

---

## 🚀 Next: Phase 2

Phase 2 will add:
- Member management (CRUD operations)
- Admin can create/edit/delete members
- Display all members in a table
- Virtual scrolling for 10,000+ members
- Search and filter functionality

**Ready for Phase 2?** Let me know!

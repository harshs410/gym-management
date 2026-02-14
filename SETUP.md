# THRUST Gym - Quick Setup Guide

## What You Just Downloaded

All Phase 0 files for the THRUST gym management platform!

## Setup Steps (15 minutes)

### 1. Extract Files
- Extract this folder to: `D:\project\thrust-gym`
- Open the folder in VS Code

### 2. Install Dependencies
Open VS Code terminal (Ctrl + `) and run:
```bash
npm install
```
⏱️ Takes 2-3 minutes

### 3. Start Docker
Make sure Docker Desktop is running, then:
```bash
docker-compose up -d
```
✅ Starts PostgreSQL and Redis

### 4. Setup Database
```bash
npx prisma migrate dev
```
When prompted for migration name, type: `init`

### 5. Start Development Server
```bash
npm run dev
```
🚀 Open http://localhost:3000

## Verify Everything Works

### Test 1: Docker
```bash
docker ps
```
Should show: `thrust_gym_db` and `thrust_gym_redis`

### Test 2: Database
```bash
npx prisma studio
```
Opens at http://localhost:5555

### Test 3: Web App
Visit http://localhost:3000
Should see THRUST homepage

## All Tests Pass? ✅

Save your work:
```bash
git init
git add .
git commit -m "chore: Phase 0 complete"
```

## Phase 0 Complete! 🎉

You now have:
- ✅ Next.js 14 app running
- ✅ PostgreSQL database (Docker)
- ✅ Redis cache (Docker)
- ✅ Prisma ORM configured
- ✅ TypeScript + Tailwind setup
- ✅ Complete database schema

**Ready for Phase 1: Authentication & Dashboard!**

## Need Help?

Common issues:

**"docker-compose: command not found"**
→ Docker Desktop not running

**"Can't reach database"**
→ Run `docker-compose up -d` again

**"Port 5432 already in use"**
→ Another database is running, stop it first

**npm install errors**
→ Delete `node_modules` and try again

# THRUST - Phase 4: AI Workout Plan Generator

## 🎯 What's New in Phase 4

AI-powered personalized workout plans using OpenAI GPT-4!

✅ **OpenAI Integration** - GPT-4 generates custom plans  
✅ **Member Profile Form** - Age, goals, fitness level, schedule  
✅ **4-Week Progressive Plans** - Week-by-week training program  
✅ **Detailed Exercises** - Sets, reps, rest times, form tips  
✅ **Nutrition Tips** - AI-generated dietary advice  
✅ **Database Storage** - Plans saved for members to view  

---

## 📦 New Files Added (5 Files)

### APIs:
1. `app/api/workout-plan/route.ts` - Generate & retrieve plans
2. `lib/openai.ts` - OpenAI client configuration

### Pages:
3. `app/workout-plan/create/page.tsx` - Plan generator form
4. `app/workout-plan/[id]/page.tsx` - Plan view (success page)
5. `app/dashboard/page.tsx` - Updated with AI link

### Docs:
6. `PHASE4_SETUP.md` - This file

---

## 🚀 Setup Instructions

### 1. Get OpenAI API Key

**IMPORTANT:** You need an OpenAI API key for this to work!

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

**Cost:** ~$0.01-0.05 per workout plan (very cheap!)

### 2. Add API Key to Environment

Open `.env` file in your project root and add:

```
OPENAI_API_KEY="sk-your-actual-key-here"
```

**⚠️ IMPORTANT:** Replace with your actual key!

### 3. Copy Phase 4 Files

Extract Phase 4 archive and copy ALL files into `D:\project3`.

Overwrite when asked.

### 4. Install/Verify Dependencies

The OpenAI package should already be installed from Phase 0.

Verify:
```bash
npm install
```

### 5. Restart Server

**MUST restart for .env changes to take effect:**

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## ✅ Testing Phase 4

### Test 1: Access Workout Plan Generator

1. Login as admin@thrust.com
2. Go to dashboard
3. Click "AI Workout Plans" in Quick Actions
4. **Expected:** Form page opens

### Test 2: Generate a Plan

1. Select member: "Sarah Jones 98"
2. Age: Auto-fills (or enter 28)
3. Gender: FEMALE
4. Fitness Level: INTERMEDIATE
5. Goals: Select "Muscle gain" and "Strength"
6. Days per week: 4
7. Minutes per session: 60
8. Equipment: "Full gym access"
9. Click "Generate AI Workout Plan"
10. **Expected:** 
    - Button shows "Generating... (~10 seconds)"
    - After ~10 seconds, redirects to success page

### Test 3: View Generated Plan

After generation:
1. **Expected:** Success page with green checkmark
2. Shows "Workout Plan Created Successfully"
3. Displays plan details (4 weeks, progressive)
4. Shows note about full view coming next

### Test 4: Create Multiple Plans

1. Click "Create Another Plan"
2. Select different member
3. Change goals (e.g., "Fat loss", "Endurance")
4. Change fitness level to BEGINNER
5. Generate
6. **Expected:** Another plan created successfully

### Test 5: Verify Database Storage

Open Prisma Studio:
```bash
npx prisma studio
```

1. Click "WorkoutPlan" table
2. **Expected:** See your generated plans
3. Click on a plan
4. **Expected:** See JSON with weeks, exercises, etc.

---

## 🎨 UI Features

### Generator Form:
- Member dropdown (all 101 members)
- Auto-fill age/gender from member profile
- Visual fitness level buttons
- Multi-select goals (up to 3)
- Schedule inputs (days/week, minutes/session)
- Equipment description
- Purple gradient submit button
- AI generating animation

### Success Page:
- Green checkmark animation
- Success message
- Plan details cards
- Quick actions (create another/back to dashboard)
- Implementation notes

### Dashboard Integration:
- New "AI Workout Plans" card
- Purple theme
- Direct link to generator

---

## 📊 How It Works

### Plan Generation Flow:

```
1. Trainer fills form:
   - Member: Sarah Jones
   - Age: 28, Female
   - Goals: Muscle gain, Strength
   - Level: Intermediate
   - 4 days/week, 60 mins

2. Submit → POST /api/workout-plan
   
3. Backend builds prompt:
   "You are a certified personal trainer.
    Create a 4-week plan for:
    - 28 year old female
    - Intermediate level
    - Goals: Muscle gain, Strength
    - 4 days/week, 60 min sessions
    - Full gym access
    
    Return JSON with weeks, days, exercises..."

4. OpenAI API Call:
   - Model: gpt-4o-mini (fast & cheap)
   - Temperature: 0.7 (creative but consistent)
   - Max tokens: 4000
   
5. AI generates JSON:
   {
     "title": "4-Week Muscle & Strength Program",
     "weeks": [
       {
         "weekNumber": 1,
         "focus": "Foundation",
         "days": [
           {
             "dayNumber": 1,
             "name": "Upper Body Strength",
             "exercises": [
               {
                 "name": "Barbell Bench Press",
                 "sets": 4,
                 "reps": "8-10",
                 "rest": "90 seconds",
                 "notes": "Focus on controlled eccentric"
               }
             ]
           }
         ]
       }
     ],
     "nutritionTips": "...",
     "progressionNotes": "..."
   }

6. Save to database:
   - WorkoutPlan table
   - Link to member & trainer
   - Store full JSON

7. Return success + plan ID

8. Frontend redirects to success page
```

---

## 🔐 Authorization

**Who can create workout plans:**

| Action | Admin | Trainer | Member |
|--------|-------|---------|--------|
| Create plans | ✅ | ✅ | ❌ |
| View own plan | N/A | N/A | ✅ (future) |
| View all plans | ✅ | ⚪ (assigned only) | ❌ |

---

## 🐛 Troubleshooting

### "Failed to generate workout plan"
**Cause:** OpenAI API key missing or invalid  
**Fix:** 
1. Check `.env` file has `OPENAI_API_KEY`
2. Verify key is correct (starts with `sk-`)
3. Restart server (`npm run dev`)

### "OpenAI is not defined"
**Cause:** Server not restarted after adding key  
**Fix:** Stop server (Ctrl+C) and restart

### Generation takes too long (>30 seconds)
**Cause:** Network issue or API slow  
**Fix:** 
- Check internet connection
- Try again
- OpenAI might be experiencing high load

### "Failed to parse workout plan from AI"
**Cause:** AI returned invalid JSON  
**Fix:** This is rare, just retry. AI usually returns valid JSON.

### Plans not saving to database
**Cause:** Prisma error  
**Fix:** Check server console for error details

---

## 💰 Cost Breakdown

**OpenAI Pricing (gpt-4o-mini):**
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens

**Per workout plan:**
- Prompt: ~500 tokens = $0.00007
- Response: ~2,000 tokens = $0.0012
- **Total: ~$0.0013 per plan** (less than 1 cent!)

**For 100 plans:** ~$0.13 (13 cents)

Very affordable! 🎉

---

## 🎯 Phase 4 Checklist

- [x] OpenAI integration
- [x] Workout plan API
- [x] Member selection form
- [x] Profile inputs (age, gender, goals)
- [x] Fitness level selector
- [x] Schedule inputs
- [x] AI generation with GPT-4
- [x] JSON response parsing
- [x] Database storage (WorkoutPlan table)
- [x] Success page
- [x] Dashboard integration
- [ ] Full plan view (week-by-week) - Coming in Phase 4.5
- [ ] Member dashboard to view their plan - Phase 5

---

## 🚀 What's Next: Phase 5

**Member & Trainer Dashboards**

Features:
- Member dashboard (view own workout plan)
- Trainer dashboard (view assigned members)
- Profile pages
- Workout plan viewer (detailed week-by-week)
- Progress tracking
- Member stats

**Estimated time:** 2 days

---

## 💡 Key Learnings

### Technical:
- OpenAI API is simple to integrate
- Prompt engineering is critical (clear instructions = better results)
- JSON mode ensures structured output
- Error handling for AI responses
- Environment variables for API keys

### Best Practices:
- Always parse AI responses safely
- Validate JSON before saving
- Show loading states (AI takes 5-10 seconds)
- Store prompts for debugging
- Handle API errors gracefully

---

## 🎉 Phase 4 Summary

**Time Spent:** ~2 hours  
**Files Created:** 6  
**Lines of Code:** ~900  
**AI Model:** GPT-4o-mini  
**Cost per Plan:** <$0.01  
**Generation Time:** ~10 seconds  
**Features:** 6  

You now have AI-powered workout generation!

---

**Type "Start Phase 5" when ready for Member/Trainer dashboards!** 🚀

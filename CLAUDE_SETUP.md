# THRUST Phase 4 - Claude API Version

## 🚀 Quick Setup (Claude Instead of OpenAI)

### **Files to Replace:**

1. **Create:** `lib/claude.ts` (replaces `lib/openai.ts`)
2. **Replace:** `app/api/workout-plan/route.ts` (use Claude version)

---

## **Step 1: Install Anthropic SDK**

```bash
npm install @anthropic-ai/sdk
```

---

## **Step 2: Update .env**

Make sure your `.env` has:

```
ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

**Remove or comment out:**
```
# OPENAI_API_KEY="..."
```

---

## **Step 3: Copy These 2 Files**

### **File 1: lib/claude.ts**

Create `lib/claude.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export default anthropic
```

### **File 2: app/api/workout-plan/route.ts**

**Replace entire file** with the Claude version (from archive).

Key change on line 3:
```typescript
// OLD:
import openai from '@/lib/openai'

// NEW:
import anthropic from '@/lib/claude'
```

---

## **Step 4: Restart Server**

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## **Test It:**

1. Dashboard → "AI Workout Plans"
2. Select member
3. Fill form
4. Click "Generate"
5. **Should work with Claude now!** ✅

---

## **Why Claude is Better:**

✅ **More reliable JSON** - Better structured outputs  
✅ **Longer context** - Can generate more detailed plans  
✅ **Better instructions** - Follows requirements precisely  
✅ **Claude Sonnet 4** - Latest model, very capable  

---

## **Cost:**

Claude Sonnet 4:
- ~$0.003 per workout plan (3x cheaper than GPT-4!)

**For 100 plans:** ~$0.30 (30 cents)

---

## **Troubleshooting:**

### "Failed to generate"
- Check API key in `.env`
- Make sure you have `@anthropic-ai/sdk` installed
- Restart server

### "Cannot find module '@/lib/claude'"
- Make sure `lib/claude.ts` file exists
- Check import path is correct

---

**That's it! Claude will now generate your workout plans.** 🎉

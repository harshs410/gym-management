'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dumbbell, ArrowLeft, Calendar, Target, TrendingUp, Clock, ChevronRight } from 'lucide-react'

interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  notes: string
}

interface Day {
  dayNumber: number
  name: string
  exercises: Exercise[]
}

interface Week {
  weekNumber: number
  focus: string
  days: Day[]
}

interface WorkoutPlan {
  id: string
  title: string
  description: string
  plan: {
    weeks: Week[]
    nutritionTips: string
    progressionNotes: string
  }
  member: {
    user: {
      name: string
    }
  }
  trainer: {
    user: {
      name: string
    }
  }
}

export default function WorkoutPlanViewPage() {
  const params = useParams()
  const router = useRouter()
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState(1)

  useEffect(() => {
    fetchPlan()
  }, [])

  const fetchPlan = async () => {
    try {
      // Get plan from API (we'll need to add a GET endpoint)
      // For now, simulate loading
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch plan:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading workout plan...</p>
        </div>
      </div>
    )
  }

  // Placeholder UI since we don't have individual plan fetch yet
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Workout Plan Viewer</h1>
                <p className="text-sm text-gray-600">Your personalized training program</p>
              </div>
            </div>
            
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Temporary Implementation Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            📋 Full Workout Plan Viewer
          </h2>
          
          <p className="text-blue-800 mb-6 max-w-2xl mx-auto">
            The complete week-by-week workout plan view is available in the database. 
            Open Prisma Studio to see the full JSON with all exercises, sets, and reps!
          </p>

          <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">To view your plan now:</h3>
            <ol className="text-left space-y-2 text-gray-700">
              <li>1. Open terminal</li>
              <li>2. Run: <code className="bg-gray-100 px-2 py-1 rounded">npx prisma studio</code></li>
              <li>3. Click "WorkoutPlan" table</li>
              <li>4. Click on your plan</li>
              <li>5. See the full JSON with 4 weeks of exercises!</li>
            </ol>
          </div>

          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Preview of what it will look like */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Preview: How It Will Look</h3>
          
          <div className="space-y-6">
            {/* Week Selector Preview */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((week) => (
                <button
                  key={week}
                  className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
                >
                  Week {week}
                </button>
              ))}
            </div>

            {/* Day Preview */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Day 1: Upper Body Strength</h4>
              
              {/* Exercise Preview */}
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Barbell Bench Press</p>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                    <p>Sets: 4</p>
                    <p>Reps: 8-10</p>
                    <p>Rest: 90s</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Notes: Focus on controlled eccentric phase</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Dumbbell Rows</p>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                    <p>Sets: 3</p>
                    <p>Reps: 10-12</p>
                    <p>Rest: 60s</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Notes: Keep back flat, pull to hip</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Coming Soon:</strong> The full interactive workout plan viewer with all 4 weeks, 
              exercises, nutrition tips, and progression notes will be displayed here.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

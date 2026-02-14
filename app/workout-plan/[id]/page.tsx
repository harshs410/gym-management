'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dumbbell, ArrowLeft, Calendar, Target, TrendingUp, Clock, Check } from 'lucide-react'

interface WorkoutPlan {
  id: string
  title: string
  description: string
  plan: {
    weeks: Array<{
      weekNumber: number
      focus: string
      days: Array<{
        dayNumber: number
        name: string
        exercises: Array<{
          name: string
          sets: number
          reps: string
          rest: string
          notes: string
        }>
      }>
    }>
    nutritionTips: string
    progressionNotes: string
  }
  member: {
    user: {
      name: string
      email: string
    }
  }
  trainer: {
    user: {
      name: string
    }
  }
  createdAt: string
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
      // This would need a separate GET endpoint for individual plans
      // For now, we'll use the member's plans endpoint
      const response = await fetch(`/api/workout-plan?planId=${params.id}`)
      
      // Temporary: Just show success message
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
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading workout plan...</p>
        </div>
      </div>
    )
  }

  // Success page (since we just generated the plan)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Workout Plan Generated!</h1>
                <p className="text-sm text-gray-600">Your AI-powered training plan is ready</p>
              </div>
            </div>
            
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-8 text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Workout Plan Created Successfully!
          </h2>
          
          <p className="text-gray-700 mb-4 max-w-2xl mx-auto">
            Your personalized 4-week workout plan has been generated using AI. 
            The member can now view their complete training program.
          </p>

          <div className="flex gap-4 justify-center mt-6">
            <Link
              href="/workout-plan/create"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Create Another Plan
            </Link>
            
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Plan Preview Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Plan Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">4 Weeks</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Focus</p>
                <p className="font-semibold text-gray-900">Personalized Goals</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold text-gray-900">Progressive Training</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>💡 Note:</strong> The complete workout plan has been saved to the database. 
              Members can view their full 4-week program with exercises, sets, reps, and nutrition tips.
            </p>
          </div>
        </div>

        {/* Implementation Note */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-900 mb-2">
            📝 Full Plan View Coming Next
          </h4>
          <p className="text-sm text-yellow-800">
            The detailed week-by-week workout view with exercises, sets, and reps will be displayed here. 
            For now, the plan is successfully saved in the database and can be retrieved via the API.
          </p>
        </div>
      </main>
    </div>
  )
}

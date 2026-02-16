'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dumbbell, ArrowLeft, Sparkles, User, Calendar, Target, Clock, Zap } from 'lucide-react'

interface Member {
  id: string
  user: {
    name: string
    email: string
  }
  age: number | null
  gender: string | null
}

export default function CreateWorkoutPlanPage() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    memberId: '',
    age: '',
    gender: 'MALE',
    fitnessLevel: 'INTERMEDIATE',
    goals: [] as string[],
    daysPerWeek: 4,
    minutesPerSession: 60,
    equipment: 'Full gym access',
  })

  const goalOptions = [
    'Muscle gain',
    'Fat loss',
    'Strength',
    'Endurance',
    'Flexibility',
    'Athletic performance',
  ]

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      const data = await response.json()
      
      if (response.ok) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setIsLoadingMembers(false)
    }
  }

  const handleMemberChange = (memberId: string) => {
    setFormData({ ...formData, memberId })
    
    // Auto-fill age and gender if available
    const member = members.find(m => m.id === memberId)
    if (member) {
      setFormData(prev => ({
        ...prev,
        memberId,
        age: member.age?.toString() || '',
        gender: member.gender || 'MALE',
      }))
    }
  }

  const toggleGoal = (goal: string) => {
    if (formData.goals.includes(goal)) {
      setFormData({
        ...formData,
        goals: formData.goals.filter(g => g !== goal),
      })
    } else {
      setFormData({
        ...formData,
        goals: [...formData.goals, goal],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.memberId) {
      setError('Please select a member')
      return
    }

    if (formData.goals.length === 0) {
      setError('Please select at least one goal')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to generate workout plan')
        setIsGenerating(false)
        return
      }

      // Redirect to view the plan
      router.push(`/workout-plan/${data.workoutPlan.id}`)
    } catch (err) {
      setError('Network error. Please try again.')
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Workout Plan Generator</h1>
                <p className="text-sm text-gray-600">Powered by Anthropic's claude</p>
              </div>
            </div>
            
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">
                AI-Powered Personalized Training
              </h3>
              <p className="text-sm text-purple-800">
                Our AI analyzes member profile, goals, and fitness level to generate a customized 
                4-week progressive workout plan in seconds. Each plan includes specific exercises, 
                sets, reps, and nutrition tips.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          {/* Member Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Select Member *
            </label>
            <select
              required
              value={formData.memberId}
              onChange={(e) => handleMemberChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              disabled={isLoadingMembers}
            >
              <option value="">Choose a member...</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.user.name} ({member.user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                required
                min="16"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="28"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Fitness Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Zap className="w-4 h-4 inline mr-1" />
              Fitness Level *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, fitnessLevel: level })}
                  className={`p-4 rounded-lg border-2 transition ${
                    formData.fitnessLevel === level
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-medium ${
                    formData.fitnessLevel === level ? 'text-purple-600' : 'text-gray-700'
                  }`}>
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Target className="w-4 h-4 inline mr-1" />
              Training Goals * (Select 1-3)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`p-3 rounded-lg border-2 transition text-sm ${
                    formData.goals.includes(goal)
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Days per Week *
              </label>
              <input
                type="number"
                required
                min="1"
                max="7"
                value={formData.daysPerWeek}
                onChange={(e) => setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Minutes per Session *
              </label>
              <input
                type="number"
                required
                min="15"
                max="180"
                value={formData.minutesPerSession}
                onChange={(e) => setFormData({ ...formData, minutesPerSession: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Equipment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Available *
            </label>
            <input
              type="text"
              required
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="e.g., Full gym, Dumbbells only, Bodyweight"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Plan... (~10 seconds)
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate AI Workout Plan
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}

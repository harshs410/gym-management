import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Dumbbell, Users, Activity, TrendingUp, LogOut, UserPlus, ArrowRight, UserCheck } from 'lucide-react'
import Link from 'next/link'
import CapacityGauge from '@/components/CapacityGauge'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">THRUST</h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/checkin"
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              Check-In
            </Link>
            <Link
              href="/members"
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Members
            </Link>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h2>
          <p className="text-gray-600 mt-2">Here's what's happening with your gym today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Grid - 2 columns on large screens */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Members */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">+12%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">101</h3>
              <p className="text-gray-600 text-sm mt-1">Total Members</p>
              <Link
                href="/members"
                className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Active Today */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-gray-600 text-sm mt-1">Checked In Today</p>
              <Link
                href="/checkin"
                className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                Check-in members <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">+18%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">₹0</h3>
              <p className="text-gray-600 text-sm mt-1">Revenue (This Month)</p>
            </div>
          </div>

          {/* Live Capacity - 1 column on large screens */}
          <div className="lg:col-span-1">
            <CapacityGauge />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/members"
              className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition group"
            >
              <Users className="w-8 h-8 text-red-600 mb-2" />
              <h4 className="font-semibold text-gray-900 group-hover:text-red-600">
                View All Members
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Browse and manage gym members
              </p>
            </Link>

            <Link
              href="/checkin"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
            >
              <UserCheck className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-semibold text-gray-900 group-hover:text-green-600">
                Check-in Members
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Mark member attendance in real-time
              </p>
            </Link>

            <Link
              href="/workout-plan/create"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group"
            >
              <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">
                AI Workout Plans
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Generate personalized training programs
              </p>
            </Link>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            🎉 Phase 4 Complete!
          </h3>
          <p className="text-purple-800 mb-3">
            AI Workout Plan Generator is live! Create personalized 4-week training programs using OpenAI GPT-4.
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-purple-700">
            <p>✅ OpenAI GPT-4 integration</p>
            <p>✅ Member profile form</p>
            <p>✅ 4-week progressive plans</p>
            <p>✅ Exercises, sets, reps</p>
            <p>✅ Nutrition tips</p>
            <p>✅ Saved to database</p>
          </div>
        </div>
      </main>
    </div>
  )
}

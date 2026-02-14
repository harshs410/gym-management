import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Dumbbell, Users, Activity, TrendingUp, LogOut } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  // Redirect if not logged in
  if (!user) {
    redirect('/login')
  }

  // Check if user has admin access
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Members */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
            <p className="text-gray-600 text-sm mt-1">Total Members</p>
          </div>

          {/* Active Today */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
            <p className="text-gray-600 text-sm mt-1">Active Today</p>
          </div>

          {/* Current Capacity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Dumbbell className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">0%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">0 / 100</h3>
            <p className="text-gray-600 text-sm mt-1">Current Capacity</p>
          </div>

          {/* Revenue (This Month) */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            🎉 Phase 1 Complete!
          </h3>
          <p className="text-green-800">
            Authentication system is working! You're logged in as an admin.
          </p>
          <div className="mt-4 space-y-2 text-sm text-green-700">
            <p>✅ JWT authentication enabled</p>
            <p>✅ Password hashing with bcrypt</p>
            <p>✅ Role-based access control</p>
            <p>✅ Protected routes with middleware</p>
          </div>
        </div>
      </main>
    </div>
  )
}

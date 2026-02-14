import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Dumbbell, Calendar, TrendingUp, LogOut, Award, User } from 'lucide-react'
import Link from 'next/link'
import CapacityGauge from '@/components/CapacityGauge'

export default async function MemberDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'MEMBER') {
    redirect('/login')
  }

  // Get member profile
  const memberProfile = await prisma.member.findUnique({
    where: { userId: user.userId },
    include: {
      user: true,
      workoutPlans: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          trainer: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  })

  if (!memberProfile) {
    redirect('/login')
  }

  const latestPlan = memberProfile.workoutPlans[0]
  const isExpired = new Date(memberProfile.expiresAt) < new Date()
  const daysUntilExpiry = Math.ceil(
    (new Date(memberProfile.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">THRUST</h1>
              <p className="text-sm text-gray-600">Member Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500">Member</p>
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
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, {memberProfile.user.name}! 👋</h2>
          <p className="text-gray-600 mt-2">Here's your training overview.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Membership Status - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Membership Status</h3>
                <Award className="w-6 h-6 text-purple-600" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Membership Tier</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    memberProfile.membershipTier === 'VIP' 
                      ? 'bg-purple-100 text-purple-700'
                      : memberProfile.membershipTier === 'PREMIUM'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {memberProfile.membershipTier}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Expires In</p>
                  <p className={`text-2xl font-bold ${
                    isExpired ? 'text-red-600' : daysUntilExpiry < 30 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {isExpired ? 'Expired' : `${daysUntilExpiry} days`}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Expiry Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(memberProfile.expiresAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    memberProfile.isActive && !isExpired
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {memberProfile.isActive && !isExpired ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {daysUntilExpiry < 30 && !isExpired && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Your membership expires soon! Contact the gym to renew.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Gym Capacity - 1 column */}
          <div className="lg:col-span-1">
            <CapacityGauge />
          </div>
        </div>

        {/* Workout Plan Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">My Workout Plan</h3>
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>

          {latestPlan ? (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{latestPlan.title}</h4>
                <p className="text-gray-600">{latestPlan.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-blue-900">{latestPlan.weeks} Weeks</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Fitness Level</p>
                  <p className="text-lg font-semibold text-green-900">
                    {latestPlan.fitnessLevel.charAt(0) + latestPlan.fitnessLevel.slice(1).toLowerCase()}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Trainer</p>
                  <p className="text-lg font-semibold text-purple-900">
                    {latestPlan.trainer.user.name.split(' ')[0]}
                  </p>
                </div>
              </div>

              <Link
                href={`/workout-plan/${latestPlan.id}/view`}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                View Full Plan →
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">No workout plan assigned yet</p>
              <p className="text-sm text-gray-500">Your trainer will create a personalized plan for you soon!</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-ins This Month</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Days Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor((new Date().getTime() - new Date(memberProfile.joinedAt).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(memberProfile.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

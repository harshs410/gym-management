'use client'

import { useState, useEffect } from 'react'
import { Search, UserCheck, UserX, Dumbbell, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CapacityGauge from '@/components/CapacityGauge'

interface Member {
  id: string
  user: {
    name: string
    email: string
  }
  isCheckedIn: boolean
  membershipTier: string
}

export default function CheckInPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [search])

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)

      const response = await fetch(`/api/members?${params}`)
      const data = await response.json()

      if (response.ok) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckIn = async (memberId: string, action: 'checkin' | 'checkout') => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, action }),
      })

      if (response.ok) {
        // Refresh members list
        fetchMembers()
      } else {
        const data = await response.json()
        alert(data.error || 'Check-in failed')
      }
    } catch (error) {
      console.error('Check-in error:', error)
      alert('Failed to check in member')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Check-In Members</h1>
                <p className="text-sm text-gray-600">Mark member attendance</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Search & Members */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search member by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-lg"
                />
              </div>
            </div>

            {/* Members List */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">No members found</p>
                </div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.user.name}</h3>
                      <p className="text-sm text-gray-600">{member.user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        member.membershipTier === 'VIP' 
                          ? 'bg-purple-100 text-purple-700'
                          : member.membershipTier === 'PREMIUM'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {member.membershipTier}
                      </span>
                    </div>

                    {/* Check-in Button */}
                    {member.isCheckedIn ? (
                      <button
                        onClick={() => handleCheckIn(member.id, 'checkout')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                      >
                        <UserX className="w-5 h-5" />
                        Check Out
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(member.id, 'checkin')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        <UserCheck className="w-5 h-5" />
                        Check In
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Capacity Gauge */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CapacityGauge />
              
              {/* Info Card */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tip</h4>
                <p className="text-sm text-blue-800">
                  Search for members and click "Check In" to mark them as present. 
                  The capacity updates in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useVirtualizer } from '@tanstack/react-virtual'
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  X,
  Calendar,
  Mail,
  Phone,
  Dumbbell
} from 'lucide-react'
import Link from 'next/link'
import MemberForm from '@/components/MemberForm'

interface Member {
  id: string
  userId: string
  phone: string | null
  age: number | null
  gender: string | null
  membershipTier: string
  expiresAt: string
  isActive: boolean
  user: {
    id: string
    email: string
    name: string
  }
}

export default function MembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Fetch members
  useEffect(() => {
    fetchMembers()
  }, [search, tierFilter, statusFilter])

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (tierFilter !== 'ALL') params.set('tier', tierFilter)
      if (statusFilter !== 'ALL') params.set('status', statusFilter)

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

  // Delete member
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchMembers()
      } else {
        alert('Failed to delete member')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete member')
    }
  }

  // Virtual scrolling setup
  const parentRef = useMemo(() => ({ current: null as HTMLDivElement | null }), [])
  
  const virtualizer = useVirtualizer({
    count: members.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Height of each row
    overscan: 10,
    scrollMargin: 48,  // ← ADD THIS LINE
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Members</h1>
                <p className="text-sm text-gray-600">Manage gym members</p>
              </div>
            </div>
            
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Add Member Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            {/* Tier Filter */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="ALL">All Tiers</option>
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
              <option value="VIP">VIP</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Member Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{members.length}</span> members found
          </p>
        </div>

        {/* Virtual Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No members found</p>
          </div>
        ) : (
          <div 
            ref={parentRef as any}
            className="h-[600px] overflow-auto bg-white rounded-lg border border-gray-200"

          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {/* Table Header */}
              <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 z-10">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Tier</div>
                <div className="col-span-2">Expires</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Virtual Rows */}
              {virtualItems.map((virtualRow) => {
                const member = members[virtualRow.index]
                const isExpired = new Date(member.expiresAt) < new Date()

                return (
                  <div
                    key={member.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="px-4 py-4 grid grid-cols-12 gap-4 border-b border-gray-100 hover:bg-gray-50 items-center"
                  >
                    <div className="col-span-3 font-medium text-gray-900">
                      {member.user.name}
                    </div>
                    <div className="col-span-3 text-gray-600 text-sm">
                      {member.user.email}
                    </div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.membershipTier === 'VIP' 
                          ? 'bg-purple-100 text-purple-700'
                          : member.membershipTier === 'PREMIUM'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {member.membershipTier}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-gray-600">
                      {new Date(member.expiresAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isExpired
                          ? 'bg-red-100 text-red-700'
                          : member.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {isExpired ? 'Expired' : member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/members/${member.id}/edit`)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.user.name)}
                        className="p-2 hover:bg-red-100 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Create Member Modal */}
      {showCreateModal && (
        <MemberForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchMembers}
        />
      )}
    </div>
  )
}

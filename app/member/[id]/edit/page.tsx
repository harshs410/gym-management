'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import MemberForm from '@/components/MemberForm'

export default function EditMemberPage() {
  const router = useRouter()
  const params = useParams()
  const [member, setMember] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMember()
  }, [])

const fetchMember = async () => {
  try {
    const response = await fetch('/api/members')
    const data = await response.json()
    
    if (response.ok) {
      const foundMember = data.members.find((m: any) => m.id === params.id)
      if (foundMember) {
        setMember(foundMember)
      } else {
        alert('Member not found')
        router.push('/members')
      }
    }
  } catch (error) {
    console.error('Failed to fetch member:', error)
    router.push('/members')
  } finally {
    setIsLoading(false)
  }
}

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading member...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {member && (
        <MemberForm
          member={member}
          onClose={() => router.push('/members')}
          onSuccess={() => router.push('/members')}
        />
      )}
    </div>
  )
}

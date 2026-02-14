'use client'

import { useEffect, useState } from 'react'
import { Activity, Users, TrendingUp, TrendingDown } from 'lucide-react'

interface CapacityData {
  current: number
  max: number
  percentage: number
}

export default function CapacityGauge() {
  const [capacity, setCapacity] = useState<CapacityData>({
    current: 0,
    max: 100,
    percentage: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCapacity()
    
    // Poll every 5 seconds for updates
    const interval = setInterval(fetchCapacity, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchCapacity = async () => {
    try {
      const response = await fetch('/api/checkin')
      const data = await response.json()
      
      if (response.ok) {
        setCapacity(data.capacity)
      }
    } catch (error) {
      console.error('Failed to fetch capacity:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCapacityColor = () => {
    if (capacity.percentage >= 90) return 'text-red-600 bg-red-100'
    if (capacity.percentage >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getCapacityStatus = () => {
    if (capacity.percentage >= 90) return '🔴 Very Busy'
    if (capacity.percentage >= 70) return '🟡 Moderately Busy'
    return '🟢 Available'
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Capacity</h3>
        <Activity className="w-5 h-5 text-red-600 animate-pulse" />
      </div>

      {/* Capacity Display */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {capacity.current} <span className="text-gray-400">/</span> {capacity.max}
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getCapacityColor()}`}>
          {getCapacityStatus()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
            capacity.percentage >= 90
              ? 'bg-red-600'
              : capacity.percentage >= 70
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`}
          style={{ width: `${capacity.percentage}%` }}
        />
      </div>

      {/* Percentage */}
      <div className="text-center mt-2 text-sm text-gray-600">
        {capacity.percentage}% Full
      </div>
    </div>
  )
}

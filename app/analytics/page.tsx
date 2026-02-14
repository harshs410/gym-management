'use client'

import { Dumbbell, TrendingUp, Users, DollarSign, Calendar, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const totalRevenue = 195000
  const totalMembers = 101
  const activeMembers = 95
  
  const revenueByTier = [
    { name: 'Basic', value: 40000, count: 40, color: '#3b82f6' },
    { name: 'Premium', value: 100000, count: 50, color: '#8b5cf6' },
    { name: 'VIP', value: 55000, count: 11, color: '#ec4899' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-sm text-gray-600">Business insights and metrics</p>
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{(totalRevenue / 1000).toFixed(0)}K</p>
              </div>
            </div>
            <p className="text-xs text-green-600">+18% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              </div>
            </div>
            <p className="text-xs text-blue-600">+12 this month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{activeMembers}</p>
              </div>
            </div>
            <p className="text-xs text-purple-600">{((activeMembers / totalMembers) * 100).toFixed(0)}% of total</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-100 rounded-lg">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
            </div>
            <p className="text-xs text-red-600">Renew soon</p>
          </div>
        </div>

        {/* Revenue by Tier - Simple Version */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Tier</h3>
          
          <div className="space-y-6">
            {revenueByTier.map((tier) => (
              <div key={tier.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="font-medium text-gray-900">{tier.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{(tier.value / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-600">{tier.count} members</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(tier.value / totalRevenue) * 100}%`,
                      backgroundColor: tier.color 
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((tier.value / totalRevenue) * 100).toFixed(1)}% of total revenue
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Member Growth - Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">6-Month Growth</p>
            <p className="text-3xl font-bold text-blue-900">+19%</p>
            <p className="text-sm text-blue-700 mt-2">From 85 to 101 members</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <p className="text-sm text-purple-600 mb-1">Peak Hour</p>
            <p className="text-3xl font-bold text-purple-900">6 PM</p>
            <p className="text-sm text-purple-700 mt-2">45 avg check-ins</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <p className="text-sm text-green-600 mb-1">Retention Rate</p>
            <p className="text-3xl font-bold text-green-900">94%</p>
            <p className="text-sm text-green-700 mt-2">Members stay active</p>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">📊 Analytics Dashboard Complete!</h3>
              <p className="text-sm text-purple-800">All key metrics and insights are displayed above.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
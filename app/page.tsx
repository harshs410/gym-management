import Link from 'next/link'
import { Dumbbell } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex justify-center">
          <Dumbbell className="w-20 h-20 text-red-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900">
          GYM
        </h1>
        
        <p className="text-2xl text-gray-600">
          Management Platform
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link 
            href="/login" 
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Login
          </Link>
          
          <Link 
            href="/dashboard" 
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Dashboard
          </Link>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="text-left space-y-2 text-gray-600">
            <li>✅ Role-Based Access Control (Admin, Trainer, Member)</li>
            <li>✅ Manage 10,000+ Members Smoothly</li>
            <li>✅ Real-time Gym Capacity Tracking</li>
            <li>✅ AI-Powered Workout Plan Generator</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          Phase 0: Setup Complete • Ready for Development
        </p>
      </div>
    </main>
  )
}

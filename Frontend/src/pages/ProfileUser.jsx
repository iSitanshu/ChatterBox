import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import { User, Mail, CircleDot } from 'lucide-react'

const ProfileUser = () => {
  const user = useSelector((state) => state.user.user[0])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 flex items-center justify-center text-gray-400">
        <p className="text-lg">No user found. Please sign in.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-white">
      <Navbar />

      <main className="max-w-md mx-auto mt-16 p-8 bg-gray-800 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          {/* Avatar */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-1">
            <div className="bg-gray-900 rounded-full p-3">
              <User className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          {/* Name & Email */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>

          {/* Online Status */}
          <div className="flex items-center space-x-2">
            <CircleDot
              className={`w-3 h-3 ${
                user.online ? 'text-red-400' : 'text-green-500'
              }`}
            />
            <span className="text-sm">
              {user.online ? 'Offline' : 'Online'}
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfileUser

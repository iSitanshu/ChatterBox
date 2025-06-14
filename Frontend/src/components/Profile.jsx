import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle2, LogOut, User } from 'lucide-react'

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    alert('logout')
  }

  return (
    <>
    <div className="relative" ref={menuRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer hover:text-white text-gray-300 transition"
      >
        <UserCircle2 className="w-10 h-10" />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg py-2 z-50">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center px-4 py-2 hover:bg-red-700 cursor-pointer text-red-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default Profile

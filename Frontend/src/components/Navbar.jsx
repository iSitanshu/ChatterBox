import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeStatus } from '../features/status/statusSlice'
import Profile from './Profile'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import axios from 'axios'
  
const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // Assuming user info is stored as an array in state.user.user
  const user = useSelector((state) => state.user.user) || [];

  return (
    <div className="flex items-center justify-between mb-12 p-6  bg-gradient-to-tr from-gray-900 via-black to-gray-800">
      <h1
      onClick={() => navigate('/')} 
      className="text-3xl mt-2.5 font-bold text-blue-400 hover:cursor-pointer">ChatterBox</h1>
      {user && user.length > 0 ? (
        <Profile />
      ) : (
        <button
          onClick={() => dispatch(changeStatus())}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
        >
          SignIn
        </button>
      )}
    </div>
  )
}

export default Navbar
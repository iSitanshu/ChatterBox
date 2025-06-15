import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeCreateRoom, changeStatus } from '../features/status/statusSlice'
import axios from 'axios'
import { addRoom } from '../features/user/userSlice'
import { useNavigate } from 'react-router-dom'

const Create = () => {
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [hostID, setHostID] = useState('')
  const dispatch = useDispatch()
  const room = useSelector((state) => (state.user.room))
  const user = useSelector((state) => (state.user.user))
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    try {
         const response = await axios.post(
           '/api/v1/room/create',
           {
            roomName,
            password,
            hostID: user[0]._id
           }
         );
         dispatch(addRoom(response.data.data.room))
         dispatch(changeCreateRoom())
         alert('Room created successfully!')
       } catch (error) {
         console.error('Error creating post:', error);
       }
     };

  const handleClose = () => {
    dispatch(changeCreateRoom())
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
      
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-11/12 sm:w-96">
        <button 
          onClick={handleClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &#10005;
        </button>
        
        <h2 className="text-xl font-bold mb-4">Create Room</h2>
        <p className="mb-4 text-gray-700">
            Create a new room and invite others to join for seamless collaboration.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
        <label className="block mb-1 font-medium">Room Name:</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  )
}

export default Create
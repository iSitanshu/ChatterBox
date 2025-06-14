import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeJoinRoom } from '../features/status/statusSlice'
import axios from 'axios'
import { addRoom } from '../features/user/userSlice'


const Join = () => {
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => (state.user.user))
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const response = await axios.post(
        '/api/v1/room/join',
        {
        userID: user[0]._id,
        roomName,
        password
        }
        );
        dispatch(addRoom(response.data.data.room))
        dispatch(changeJoinRoom())
        alert('Successfully joined the room.')
        // navigate('/channel')
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message === 'User has already joined the room') {
            alert('You have already joined this room.');
        } else {
            alert('Failed to join the room. Please check the room name and password.');
        }
        console.error('Error creating post:', error);
    }
  }

  const handleClose = () => {
    dispatch(changeJoinRoom())
  }

  return (
    <div className="fixed inset-0 flex p-20 items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
      
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-11/12 sm:w-96">
        <button 
          onClick={handleClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &#10005;
        </button>
        
        <h2 className="text-xl font-bold mb-4">Join Room</h2>
        <p className="mb-4 text-gray-700">
            Please enter the room name and password to join an existing room.
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
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  )
}

export default Join
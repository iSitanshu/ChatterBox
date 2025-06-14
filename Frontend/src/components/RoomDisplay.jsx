import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Plus, User, Users, LogIn } from 'lucide-react'
import { changeCreateRoom, changeJoinRoom } from '../features/status/statusSlice'
import { useNavigate } from 'react-router-dom'
import { currentRoom, currentRoomID } from '../features/room/roomSlice'

const RoomDisplay = ({ activeTab }) => {
  const [rooms, setRooms] = useState([])
  const user = useSelector((state) => state.user.user)
  const room = useSelector((state) => state.room.room)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const fetchRooms = async () => {
    try {
      if (user && user.length > 0) {
        let response
        if (activeTab === 'hosted') {
          response = await axios.post('/api/v1/room/my_rooms', { hostID: user[0]._id })
        } else {
          response = await axios.post('/api/v1/room/channels', { userID: user[0]._id })
        }
        setRooms(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const handleRoomDisplay = async (room) => {
    dispatch(currentRoom(room.roomName))
    dispatch(currentRoomID(room._id))
    navigate('/user/channel')
  }

  useEffect(() => {
    fetchRooms()
  }, [user, activeTab])

  const renderEmptyMessage = () => {
    if (activeTab === 'hosted') {
      return (
        <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-900/20 mb-4">
            <Plus className="h-6 w-6 text-blue-400 hover:cursor-pointer" onClick={() => dispatch(changeCreateRoom())} />
          </div>
          <h3 className="text-lg font-medium text-white">No hosted rooms</h3>
          <p className="mt-1 text-gray-400">Create your first room to get started</p>
        </div>
      )
    } else {
      return (
        <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-900/20 mb-4">
            <LogIn className="h-6 w-6 text-purple-400 hover:cursor-pointer" onClick={() => dispatch(changeJoinRoom())} />
          </div>
          <h3 className="text-lg font-medium text-white">No joined rooms</h3>
          <p className="mt-1 text-gray-400">Join a room to start collaborating</p>
        </div>
      )
    }
  }

  return (
    <div>
      {rooms.length ? (
        rooms.map((r, i) => (
          <div 
            key={i}
            className="flex items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700/30 transition-all duration-200 group"
          >
            <div className={`flex-shrink-0 p-2 rounded-lg border group-hover:border-${activeTab === 'hosted' ? 'blue' : 'purple'}-500 transition-colors
              ${activeTab === 'hosted' ? 'bg-blue-900/20 border-blue-800/50' : 'bg-purple-900/20 border-purple-800/50'}
            `}>
              {activeTab === 'hosted' ? (
                <User className="h-5 w-5 text-blue-400" />
              ) : (
                <Users className="h-5 w-5 text-purple-400" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium text-white">{r.roomName}</h3>
              <span className={`text-xs px-2 py-1 rounded-md ${activeTab === 'hosted' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'}`}>
                {activeTab === 'hosted' ? 'Host' : 'Member'}
              </span>
            </div>
            <button 
            onClick={() => handleRoomDisplay(r)}
            className={`${activeTab === 'hosted' ? 'text-blue-400' : 'text-purple-400'} hover:text-white font-medium text-sm`}>
              {activeTab === 'hosted' ? 'Start' : 'Join'}
            </button>
          </div>
        ))
      ) : (
        renderEmptyMessage()
      )}
    </div>
  )
}

export default RoomDisplay

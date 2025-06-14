import { configureStore } from '@reduxjs/toolkit'
import statusReducer from '../features/status/statusSlice.js'
import userReducer from '../features/user/userSlice.js'
import roomReducer from '../features/room/roomSlice.js'

export default configureStore({
  reducer: {
    status: statusReducer,
    user: userReducer,
    room: roomReducer
  },
})
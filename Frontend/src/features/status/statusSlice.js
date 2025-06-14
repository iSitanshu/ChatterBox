import { createSlice } from '@reduxjs/toolkit'

export const statusSlice = createSlice({
  name: 'status',
  initialState: {
    currentstate: false,
    createRoom: false,
    joinRoom: false
  },
  reducers: {
    changeStatus: (state) => {
      state.currentstate = !state.currentstate;
    },
    changeCreateRoom: (state) => {
      state.createRoom = !state.createRoom;
    },
    changeJoinRoom: (state) => {
      state.joinRoom = !state.joinRoom
    }
  },
})

export const {changeStatus, showStatus, changeCreateRoom, changeJoinRoom} = statusSlice.actions
export default statusSlice.reducer
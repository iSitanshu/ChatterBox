import { createSlice } from "@reduxjs/toolkit";

export const roomSlice = createSlice({
    name: 'room',
    initialState: {
        room: null,
        roomID: null
    },
    reducers: {
        currentRoom: (state, action) => {
            state.room = action.payload
        },
        currentRoomID: (state, action) => {
            state.roomID = action.payload
        }
    } 
})

export const { currentRoom, currentRoomID } = roomSlice.actions
export default roomSlice.reducer
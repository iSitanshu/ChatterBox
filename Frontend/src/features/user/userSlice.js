import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: [],
        room: [],
        online: []
    },
    reducers: {
        addUser: (state, action) => {
            state.user.push(action.payload)
        },
        addRoom: (state, action) => {
            state.room.push(action.payload)
        },
        setOnlineUsers: (state, action) => {
            state.online = action.payload;
        }
    }
})

export const { addUser, addRoom, setOnlineUsers } = userSlice.actions
export default userSlice.reducer
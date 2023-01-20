import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    { id: '0', name:'Ryan L' },
    { id: '1', name: 'Justin Young' },
    { id: '2', name: 'Fahd M'}
]

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {}
})

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;
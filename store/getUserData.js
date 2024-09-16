import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userList: [],
    userData: [],
    userAmountDetails: [],
    authStatus: false,
    authUser: []
}

const getUserData = createSlice({
    name: 'getUserData',
    initialState: initialState,
    reducers: {
        setuserList: (state, action) => {
            state.userList = action.payload
        },
        setuserData: (state, action) => {
            state.userData = action.payload
        },
        setuserAmountDetails: (state, action) => {
            state.userAmountDetails = action.payload
        },
        setauthStatus: (state, action) => {
            state.authStatus = action.payload
        },
        setauthUser: (state, action) => {
            state.authUser = action.payload
        },
    }
})

export const { setuserList, setuserData, setuserAmountDetails, setauthStatus, setauthUser } = getUserData.actions;
  
  export default getUserData.reducer;
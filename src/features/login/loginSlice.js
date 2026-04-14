import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
    name: 'loginError',
    initialState: {
        loginStatus: ""
    },
    reducers: {
        setLoginStatus: state => {
            state.loginStatus = ""
        },
        clearLoginStatus: state => {
            state.loginStatus = ""
        }
    }
})

export const { setLoginStatus, clearLoginStatus } = loginSlice.actions
export default loginSlice.reducer
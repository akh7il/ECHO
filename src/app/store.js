import { configureStore } from "@reduxjs/toolkit";
import loginSlice from '../../src/features/login/loginSlice'

export default configureStore({
    reducer:{
        loginStatus : loginSlice,
    }
})
import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../slices/authSlice"
import appRecucer from "../slices/appSlice"

export default configureStore({
  reducer: {
    auth: authReducer,
    app: appRecucer
  },
});
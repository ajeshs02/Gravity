import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  expiration: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true
      state.expiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    },
    adminLogout: (state) => {
      state.isAuthenticated = false
      state.expiration = null
    },

    checkAdminTokenExpiration: (state) => {
      if (Date.now() >= state.expiration) {
        state.isAuthenticated = false
        state.expiration = null
      }
    },
  },
})

export const { login, adminLogout, update, checkAdminTokenExpiration } =
  adminSlice.actions

export default adminSlice.reducer

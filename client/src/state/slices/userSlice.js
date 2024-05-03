import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: null,
  isAuthenticated: false,
  expiration: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { id } = action.payload
      state.id = id
      state.isAuthenticated = true
      state.expiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    },
    userLogout: (state) => {
      state.id = null
      state.isAuthenticated = false
      state.expiration = null
    },
    checkUserTokenExpiration: (state) => {
      if (Date.now() >= state.expiration) {
        state.id = null
        state.isAuthenticated = false
        state.expiration = null
      }
    },
  },
})

export const { login, userLogout, checkUserTokenExpiration } = userSlice.actions

export default userSlice.reducer

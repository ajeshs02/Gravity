import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  expiration: null,
}

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true
      state.expiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    },
    storeLogout: (state) => {
      state.isAuthenticated = false
      state.expiration = null
    },
    checkStoreTokenExpiration: (state) => {
      if (Date.now() >= state.expiration) {
        state.isAuthenticated = false
        state.expiration = null
      }
    },
  },
})

export const { login, storeLogout, update, checkStoreTokenExpiration } =
  storeSlice.actions

export default storeSlice.reducer

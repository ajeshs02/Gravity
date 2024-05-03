import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  formData: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    description: '',
  },
  page: 'UserRegister',
  loginPage: 'UserLogin',
}
const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setLoginPage: (state, action) => {
      state.loginPage = action.payload
    },
  },
})

export const { setFormData, setPage, setLoginPage } = formSlice.actions

export default formSlice.reducer

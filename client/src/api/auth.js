import axios from 'axios'

// send otp before user registration
export const sendUserOTP = async (userData) => {
  try {
    const { data } = await axios.post('/user/send-otp', userData)
    return data
  } catch (error) {
    console.error('user otp send failed', error)
    return {
      type: error.response.data.error.type,
      message: error.response.data.error.message,
    }
  }
}

// verify otp and register user
export const registerUser = async (formData) => {
  try {
    const { data } = await axios.post('/user/register', formData)

    return data
  } catch (error) {
    console.error('user registration failed', error)
    return {
      type: error.response.data.error.type,
      message: error.response.data.error.message,
    }
  }
}

// user login
export const userLogin = async (formData) => {
  try {
    const { data } = await axios.post('/user/login', formData)
    return data
  } catch (error) {
    console.error('user login error', error)
    return error.response.data
  }
}

// user logout
export const userLogoutApi = async () => {
  try {
    const { data } = await axios.post('/user/logout')
    return data
  } catch (error) {
    console.error('user logout failed', error)
    return error.response.data
  }
}

// send otp before user registration
export const sendStoreOTP = async (storeData) => {
  try {
    const { data } = await axios.post('/store/send-otp', storeData)

    return data
  } catch (error) {
    console.error('store otp send failed', error)
    return {
      type: error.response.data.error.type,
      message: error.response.data.error.message,
    }
  }
}

// verify otp and register user
export const registerStore = async (formData) => {
  try {
    const { data } = await axios.post('/store/register', formData)
    return data
  } catch (error) {
    console.error('store registration failed', error)
    return {
      type: error.response.data.error.type,
      message: error.response.data.error.message,
    }
  }
}

// store login
export const storeLogin = async (formData) => {
  try {
    const { data } = await axios.post('/store/login', formData)
    return data
  } catch (error) {
    console.error('store login failed', error)
    return {
      type: error.response.data.error.type,
      message: error.response.data.error.message,
    }
  }
}

// store logout
export const storeLogoutApi = async () => {
  try {
    const { data } = await axios.post('/store/logout')
    return data
  } catch (error) {
    console.error('store logout failed', error)
    return error.response.data
  }
}

// store logout
export const adminLogoutApi = async () => {
  try {
    const { data } = await axios.post('/admin/logout')
    return data
  } catch (error) {
    console.error('store logout failed', error)
    return error.response.data
  }
}

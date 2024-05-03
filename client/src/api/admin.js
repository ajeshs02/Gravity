import axios from 'axios'
import { delay, handleApiError } from './general'

// get store products
export const adminViewUsers = async (search, page = 1, limit = 10) => {
  try {
    let url = `/admin/users/view-users?search=${search}&page=${page}&limit=${limit}`
    const { data } = await axios.get(url)
    return data
  } catch (error) {
    console.error('error fetching store products', error)
    handleApiError(error)
  }
}

// toggle user block status
export const userBlockToggle = async (id) => {
  try {
    let url = `/admin/users/toggle-block/${id}`
    const { data } = await axios.put(url)
    return data
  } catch (error) {
    console.error('error fetching store products', error)
    handleApiError(error)
  }
}

// get store products
export const adminViewStores = async (search, page = 1, limit = 10) => {
  try {
    let url = `/admin/stores/view-stores?search=${search}&page=${page}&limit=${limit}`
    const { data } = await axios.get(url)
    return data
  } catch (error) {
    console.error('error fetching store products', error)
    handleApiError(error)
  }
}

// toggle user block status
export const storeBlockToggle = async (id) => {
  try {
    let url = `/admin/stores/toggle-block/${id}`
    const { data } = await axios.put(url)
    return data
  } catch (error) {
    console.error('error fetching store products', error)
    handleApiError(error)
  }
}

// get orders
export const fetchOrders = async (page = 1, limit = 10) => {
  try {
    let url = `/admin/orders?&page=${page}&limit=${limit}`
    const { data } = await axios.get(url)
    return data.data
  } catch (error) {
    console.error('error fetching store products', error)
    handleApiError(error)
  }
}

// update order's delivery date
export const updateOrderDeliveryDate = async ({ orderId, deliveryDate }) => {
  // console.log('reached api function', orderId, deliveryDate)
  try {
    let url = `/admin/orders/${orderId}`
    const { data } = await axios.put(url, { deliveryDate })
    // console.log('Update response:', data)
    await delay(300)
    return data
  } catch (error) {
    console.error('Error updating delivery date:', error) // Log the error
    handleApiError(error)
  }
}

// admin login
export const adminLogin = async (formData) => {
  try {
    const { data } = await axios.post('/admin/login', formData)
    return data
  } catch (error) {
    console.error('admin login error', error)
    return error.response.data
  }
}

import { delay, handleApiError } from './general'
import axios from 'axios'

//add product category
export const createCategory = async (name, type) => {
  try {
    const { data } = await axios.post('/store/category', { name, type })
    // console.log('create category: ', data)
    return data
  } catch (error) {
    console.error('error creating product category', error)
    handleApiError(error)
  }
}

// fetch product category
export const getCategory = async (type) => {
  try {
    const { data } = await axios.get(`/store/category`, {
      params: { type },
    })
    // console.log(data)
    return data
  } catch (error) {
    console.error('error fetching product category', error)
    handleApiError(error)
  }
}

// add new product
export const addNewProduct = async (formData) => {
  try {
    const { data } = await axios.post('/store/product/add-product', formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    })
    return data
  } catch (error) {
    console.error('error fetching product category', error)
    handleApiError(error)
  }
}

// update product
export const updateProduct = async (id, formData) => {
  try {
    const { data } = await axios.put(
      `/store/product/update-product/${id}`,
      formData
    )
    return data
  } catch (error) {
    console.error('error fetching product category', error)
    handleApiError(error)
  }
}
// delete product
export const deleteProduct = async (id, formData) => {
  try {
    const { data } = await axios.delete(`/store/product/delete/${id}`)
    return data
  } catch (error) {
    console.error('error fetching product category', error)
    handleApiError(error)
  }
}

// get store products categories
export const getProductCategories = async () => {
  try {
    const { data } = await axios.get('/store/product/categories')
    return data
  } catch (error) {
    console.error('error fetching store products', error)
    handleApiError(error)
  }
}

// get store products
export const getStoreProducts = async (category, page = 1, limit = 8) => {
  try {
    let includeDeleted = category === 'Deleted'
    let url = `/store/product?page=${page}&limit=${limit}&deleted=${includeDeleted}`
    if (category !== 'all' && category !== 'Deleted') {
      url += `&category=${category}`
    }
    const { data } = await axios.get(url)
    return data
  } catch (error) {
    console.error('error fetching store products', error)
    handleApiError(error)
  }
}

// Get specific product by ID
export const getProductById = async (productId) => {
  try {
    const url = `/store/product/${productId}`

    const { data } = await axios.get(url)
    await delay(400)
    return data.product
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}`, error)
    handleApiError(error)
  }
}

// fetch product reviews
export const getStoreProductReviews = async (productId) => {
  try {
    const { data } = await axios.get(`/store/product/${productId}/reviews`)
    await delay(500)
    return data.reviews
  } catch (error) {
    console.error('Error fetching store profile:', error)
    handleApiError(error)
  }
}

// store profile
export const getStoreProfile = async () => {
  try {
    const { data } = await axios.get(`/store/profile`)
    await delay(300)
    return data.store
  } catch (error) {
    console.error('Error fetching store profile:', error)
    handleApiError(error)
  }
}

// user profile
export const getUserProfile = async (userId) => {
  try {
    const { data } = await axios.get(`/store/user/${userId}`)
    await delay(300)
    return data.store
  } catch (error) {
    console.error('Error fetching store profile:', error)
    handleApiError(error)
  }
}

//  fetch store orders
export const fetchStoreOrders = async () => {
  try {
    const { data } = await axios.get('/store/orders')
    await delay(500)
    return data.orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

// Store Profile image update
export const storeProfileImageChange = async (formData) => {
  try {
    const { data } = await axios.put('/store/update-profile-image', formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    })
    return data
  } catch (error) {
    console.error('error fetching product category', error)
    handleApiError(error)
  }
}

// Store Profile Update
export const storeProfileUpdate = async (formData) => {
  console.log('store profile update', formData)
  try {
    const { data } = await axios.put('/store/profile', formData)
    return data
  } catch (error) {
    console.error('error fetching product category', error)
    handleApiError(error)
  }
}

// Store Product image add
export const storeProductImageAdd = async ({ formData, productId }) => {
  try {
    const { data } = await axios.put(
      `/store/product/add-product-image/${productId}`,
      formData,
      {
        headers: { 'Content-type': 'multipart/form-data' },
      }
    )
    return data
  } catch (error) {
    console.error('error adding product image', error)
    handleApiError(error)
  }
}

// Store Product image update
export const storeProductImageUpdate = async ({ formData, productId }) => {
  // console.log('api reached', formData, productId)
  try {
    const { data } = await axios.put(
      `/store/product/update-product-image/${productId}`,
      formData,
      {
        headers: { 'Content-type': 'multipart/form-data' },
      }
    )
    return data
  } catch (error) {
    console.error('error fetching product category', error)
    handleApiError(error)
  }
}

// Store Product image delete
export const storeProductImageDelete = async ({
  productId,
  imageIndex,
  imagePublicId,
}) => {
  try {
    const { data } = await axios.put(
      `/store/product/delete-product-image/${productId}`,
      { imageIndex, imagePublicId }
    )
    return data
  } catch (error) {
    console.error('error deleting product image', error)
    handleApiError(error)
  }
}

//Store Initialize user chat
export const storeMessageUser = async (userId) => {
  try {
    const { data } = await axios.post(`/store/initiateChat/${userId}`)
    return data
  } catch (error) {
    console.error('error initiating chat with user', error)
    handleApiError(error)
  }
}

//Store fetch all private chats
export const storeFetchChats = async () => {
  try {
    const { data } = await axios.get(`/store/chats`)
    return data.data
  } catch (error) {
    console.error('error fetching chats', error)
    handleApiError(error)
  }
}

//Store fetch messages with user
export const storeFetchMessages = async (userId) => {
  try {
    const { data } = await axios.get(`/store/messages/${userId}`)
    return data
  } catch (error) {
    console.error('error fetching messages', error)
    handleApiError(error)
  }
}

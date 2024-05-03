import axios from 'axios'
import { delay, handleApiError } from './general'

// get products
export const getProducts = async ({
  category,
  brand,
  wishlist,
  sortBy,
  order,
  page = 1,
  limit = 8,
  storeId,
  search,
}) => {
  try {
    let url = `/user/product?`

    if (search) {
      url += `&search=${search}`
    }

    if (category && category !== 'All' && category !== 'Wish-Listed') {
      url += `&category=${category}`
    }

    if (brand && brand !== 'all') {
      url += `&brand=${brand}`
    }

    if (sortBy && sortBy !== 'wishListed') {
      url += `&sortBy=${sortBy}`
    }

    if (order) {
      url += `&order=${order}`
    }

    if (storeId) {
      url += `&storeId=${storeId}`
    }

    if (wishlist) {
      url += `&wishlist=${wishlist}`
    }

    url += `&page=${page}&limit=${limit}`

    const { data } = await axios.get(url)
    await delay(200)
    return data
  } catch (error) {
    console.error('Error fetching products', error)
    handleApiError(error)
  }
}

// get store products categories
export const getProductCategories = async (type) => {
  try {
    const { data } = await axios.get(`/user/product/categories?&type=${type}`)
    return data
  } catch (error) {
    console.error('error fetching store products', error)
    handleApiError(error)
  }
}

// Get specific product by ID
export const getProductById = async (productId) => {
  try {
    const url = `/user/product/${productId}`

    const { data } = await axios.get(url)
    await delay(400)

    return data.product
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}`, error)
    handleApiError(error)
  }
}

// fetch stores
export const getStores = async ({ page = 1, limit = 8, isFollowing }) => {
  try {
    const url = '/user/store'

    const { data } = await axios.get(url, {
      params: {
        page,
        limit,
        isFollowing,
      },
    })
    await delay(200)

    return data
  } catch (error) {
    console.error('Error fetching stores:', error)
    handleApiError(error)
  }
}

export const getStoreProfile = async (storeId) => {
  try {
    const { data } = await axios.get(`/user/store/${storeId}`)
    await delay(300)
    return data.store
  } catch (error) {
    console.error('Error fetching store profile:', error)
    handleApiError(error)
  }
}

export const getStoreProducts = async ({ storeId, page = 1 }) => {
  try {
    const { data } = await axios.get(
      `/user/store/${storeId}/products?&page=${page}`
    )
    await delay(500)
    return data
  } catch (error) {
    console.error('Error fetching store profile:', error)
    handleApiError(error)
  }
}

// view cart
export const viewCart = async () => {
  try {
    const { data } = await axios.get(`/user/cart`)
    await delay(500)
    return data.cartItems
  } catch (error) {
    console.error('Error viewing cart:', error)
    throw error
  }
}

// add to cart
export const addToCart = async ({ productId }) => {
  try {
    const { data } = await axios.post(`/user/cart/add/${productId}`)
    await delay(500)
    return data
  } catch (error) {
    console.error('Error adding cart:', error)
    handleApiError(error)
  }
}

// update cart
export const updateCartItemQuantity = async ({ productId, action }) => {
  try {
    const { data } = await axios.put(`/user/cart/update/${productId}`, {
      action,
    })
    return data
  } catch (error) {
    console.error('Error updating cart item quantity:', error)
    throw error
  }
}

// deleteCart
export const deleteItemFromCart = async ({ productId }) => {
  try {
    const { data } = await axios.patch(`/user/cart/delete/${productId}`)
    return data
  } catch (error) {
    console.error('Error deleting cart item:', error)
    throw error
  }
}

// fetch product reviews
export const getProductReviews = async (productId) => {
  try {
    const { data } = await axios.get(`/user/product/${productId}/reviews`)
    await delay(500)
    return data.reviews
  } catch (error) {
    console.error('Error fetching store profile:', error)
    handleApiError(error)
  }
}

// add review
export const addReview = async ({ productId, rating, review }) => {
  try {
    const { data } = await axios.post(`/user/product/add-review/${productId}`, {
      rating,
      review,
    })
    await delay(500)
    return data
  } catch (error) {
    console.error('Error fetching store profile:', error)
    handleApiError(error)
  }
}

// delete review
// Delete review
export const deleteReview = async (reviewId) => {
  try {
    const { data } = await axios.delete(
      `/user/product/delete-review/${reviewId}`
    )
    await delay(500)
    return data
  } catch (error) {
    console.error('Error deleting review:', error)
    handleApiError(error)
  }
}

// fetch user profile
export const getUserProfile = async () => {
  try {
    const { data } = await axios.get(`/user/profile`)
    await delay(300)
    return data.user
  } catch (error) {
    console.error('Error fetching store profile:', error)
    handleApiError(error)
  }
}

// fetch address
export const fetchAddress = async () => {
  try {
    const { data } = await axios.get('/user/address')
    // console.log(data)
    await delay(300)
    return data
  } catch (error) {
    console.error('Error fetching address:', error)
    throw new Error('Failed to fetch address')
  }
}

//add address
export const addAddress = async (addressDetails) => {
  // console.log('add address api', addressDetails)
  try {
    const { data } = await axios.post('/user/address/add', {
      addressDetails,
    })
    return data
  } catch (error) {
    console.error('Error adding address:', error)
    throw new Error('Failed to add address')
  }
}

//update address
export const updateAddress = async (addressDetails) => {
  // console.log('update address api', addressDetails)
  try {
    const { data } = await axios.put('/user/address/update', {
      addressDetails,
    })

    // console.log('api address updated successfully', data)
    return data
  } catch (error) {
    console.error('Error updating address:', error)
    throw new Error('Failed to update address')
  }
}

// create order
export const handlePay = async (useWallet) => {
  try {
    const orderURL = 'user/payment/new-order'
    const { data } = await axios.post(orderURL, { useWallet })
    // console.log('data from handlePay API', data)
    return data
  } catch (error) {
    console.error(error)
  }
}

// fetch orders
export const fetchOrders = async () => {
  try {
    const { data } = await axios.get('/user/orders')
    await delay(500)
    return data.orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

// request order cancellation
export const requestOrderCancellation = async (orderId, reason) => {
  try {
    const { data } = await axios.post(`/user/orders/cancel/${orderId}`, {
      reason,
    })
    return data
  } catch (error) {
    console.error('Error requesting order cancellation:', error)
    throw new Error('Failed to request order cancellation')
  }
}

// Profile image update
export const userProfileImageChange = async (formData) => {
  try {
    const { data } = await axios.put('/user/update-profile-image', formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    })
    return data
  } catch (error) {
    console.error('error fetching product category', error)
    handleApiError(error)
  }
}
// User Profile Update
export const userProfileUpdate = async (formData) => {
  try {
    const { data } = await axios.put('/user/profile', formData)
    return data
  } catch (error) {
    console.error('error fetching product category', error)
    handleApiError(error)
  }
}

//user follow/un follow store
export const userFOllowStore = async (storeId) => {
  try {
    const { data } = await axios.post(`/user/store/follow/${storeId}`)
    return data
  } catch (error) {
    console.error('error following store', error)
    handleApiError(error)
  }
}

//user add/remove wishlist
export const fetchWishlist = async () => {
  try {
    const { data } = await axios.get(`/user/product/wishlist/fetch`)
    return data
  } catch (error) {
    console.error('error following store', error)
    handleApiError(error)
  }
}

//user add/remove wishlist
export const updateWishList = async (productId) => {
  try {
    const { data } = await axios.patch(`/user/product/wishlist/${productId}`)
    return data
  } catch (error) {
    console.error('error following store', error)
    handleApiError(error)
  }
}

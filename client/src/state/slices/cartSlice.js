import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    totalQuantity: 0,
    totalPrice: 0,
  },
  reducers: {
    setCart: (state, action) => {
      const { totalQuantity, totalPrice } = action.payload
      state.totalQuantity = totalQuantity
      state.totalPrice = totalPrice
    },

    updateCart: (state, action) => {
      const { act, totalPrice, totalQuantity } = action.payload

      if (act === 'inc') {
        state.totalQuantity += 1
      } else if (act === 'dec' && state.totalQuantity > 1) {
        state.totalQuantity -= 1
      }

      state.totalPrice = totalPrice
    },
    deleteCartItem: (state, action) => {
      state.totalQuantity = action.payload.totalQuantity
      state.totalPrice = action.payload.totalPrice
    },
  },
})

export const { setCart, updateCart, deleteCartItem } = cartSlice.actions

export default cartSlice.reducer

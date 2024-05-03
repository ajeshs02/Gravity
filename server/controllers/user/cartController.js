import Cart from '../../models/cartModel.js'
import Product from '../../models/productModel.js'

//@desc Get all cart items
//@route GET/api/v1/user/cart
//@access Private
const viewCart = async (req, res) => {
  const userId = req.user.id

  try {
    let cartItems = await Cart.findOne({ user: userId }).populate(
      'products.product'
    )

    if (!cartItems) {
      cartItems = { products: [] }
      return res.status(200).json({
        message: 'Your cart is empty',
        success: true,
        cartItems,
      })
    }

    res.status(200).json({
      cartItems,
      success: true,
      message: 'Cart found successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
}

//@desc Add to cart
//@route POST/api/v1/user/cart/add/:productId
//@access Private
const addToCart = async (req, res) => {
  const { productId } = req.params
  const userId = req.user.id

  // console.log('product id', productId)

  if (!productId) {
    return res.status(400).json({
      message: 'Invalid product details',
      success: false,
    })
  }

  try {
    let userCart = await Cart.findOne({ user: userId })
    if (!userCart) {
      userCart = await Cart.create({ user: userId, products: [] })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
      })
    }

    const existingProduct = userCart.products.find((item) =>
      item.product.equals(productId)
    )

    if (existingProduct) {
      existingProduct.quantity += 1
    } else {
      userCart.products.push({
        product: productId,
        quantity: 1,
      })
    }

    userCart.totalPrice = userCart.products.reduce((total, item) => {
      const productPrice = product.price * item.quantity
      return total + productPrice
    }, 0)

    userCart.totalQuantity = userCart.products.reduce(
      (total, item) => total + item.quantity,
      0
    )

    // console.log('user cart', userCart)

    const newCart = await userCart.save()

    res.status(200).json({
      message: 'Product added to the cart successfully',
      success: true,
      cart: newCart,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'An error occurred while adding the product to the cart',
      success: false,
    })
  }
}

//@desc Update quantity of a product in the cart
//@route PUT/api/v1/user/cart/update/:productId
//@access Private
const updateCart = async (req, res) => {
  const { productId } = req.params
  const userId = req.user.id
  const { action } = req.body

  // console.log(action)

  if (!productId || !action) {
    return res.status(400).json({
      message: 'Invalid product details or actions',
      success: false,
    })
  }

  try {
    let userCart = await Cart.findOne({ user: userId }).populate(
      'products.product'
    )
    if (!userCart || !userCart.products || userCart.products.length === 0) {
      return res.status(404).json({
        message: 'Cart not found or is empty',
        success: false,
      })
    }

    const existingProduct = userCart.products.find((item) =>
      item.product.equals(productId)
    )

    if (!existingProduct) {
      return res.status(404).json({
        message: 'Product not found in the cart',
        success: false,
      })
    }

    if (action === 'inc') {
      existingProduct.quantity += 1
    } else if (action === 'dec') {
      existingProduct.quantity -= 1
      if (existingProduct.quantity === 0) {
        userCart.products = userCart.products.filter(
          (item) => !item.product.equals(productId)
        )
      }
    }

    userCart.totalPrice = userCart.products.reduce((total, item) => {
      const productPrice = item.product.price * item.quantity
      return total + productPrice
    }, 0)

    userCart.totalQuantity = userCart.products.reduce(
      (total, item) => total + item.quantity,
      0
    )

    const cart = await userCart.save()

    res.status(200).json({
      message: 'Cart qty updated successfully',
      success: true,
      cart,
      updatedQty: existingProduct.quantity,
      totalQuantity: userCart.totalQuantity,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
}

//@desc Delete a product from the cart
//@route PATCH /api/v1/cart/delete/:productId
//@access Private
const deleteCartItem = async (req, res) => {
  const { productId } = req.params
  const userId = req.user.id

  if (!productId) {
    return res.status(400).json({
      message: 'Invalid product details',
      success: false,
    })
  }

  try {
    let userCart = await Cart.findOne({ user: userId }).populate(
      'products.product'
    )

    if (!userCart || !userCart.products || userCart.products.length === 0) {
      return res.status(404).json({
        message: 'Cart not found or is empty',
        success: false,
      })
    }

    const existingProductIndex = userCart.products.findIndex((item) =>
      item.product.equals(productId)
    )

    if (existingProductIndex === -1) {
      return res.status(404).json({
        message: 'Product not found in the cart',
        success: false,
      })
    }

    // Remove the product from the array
    userCart.products.splice(existingProductIndex, 1)

    userCart.totalPrice = userCart.products.reduce((total, item) => {
      const productPrice = item.product.price * item.quantity
      return total + productPrice
    }, 0)

    userCart.totalQuantity = userCart.products.reduce(
      (total, item) => total + item.quantity,
      0
    )

    const cart = await userCart.save()

    res.status(200).json({
      message: 'Product removed from the cart successfully',
      success: true,
      cart,
      totalQuantity: userCart.totalQuantity,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
}

export { viewCart, addToCart, updateCart, deleteCartItem }

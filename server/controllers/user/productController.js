import Product from '../../models/productModel.js'
import Category from '../../models/categoryModel.js'
import Wishlist from '../../models/wishlistModel.js'
import Follower from '../../models/followersModel.js'
import Store from '../../models/storeModel.js'

//@desc Get All Product Categories
//@route GET /api/v1/user/product/categories
//@access public
export const getAllProductCategories = async (req, res) => {
  try {
    const { type } = req.query
    let categories = await Category.find({ type }).sort('name')

    categories = categories.map((category) => category.name)

    return res.status(200).json({
      success: true,
      message: 'All product categories fetched successfully',
      categories,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

//@desc Fetch Products based on Query Criteria
//@route GET /api/v1/user/product
//@access public
export const fetchProducts = async (req, res) => {
  const userId = req.user.id
  const category = req.query.category
  const brand = req.query.brand
  const storeId = req.query.storeId
  const sortBy = req.query.sortBy
  const order = req.query.order === 'desc' ? -1 : 1
  const wishList = req.query.wishlist
  let search = req.query.search || ''
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8
  // const limit = 1

  search = search.replace(/\+/g, ' ')

  try {
    let query = { softDelete: false }
    let sortCriteria = {}

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    } else {
      if (category) {
        query.category = category
      }

      if (brand) {
        query.brand = brand
      }

      if (storeId) {
        query.storeId = storeId
      }

      if (wishList === 'true') {
        const wishlist = await Wishlist.findOne({ user: userId }).populate(
          'products'
        )
        const productIds = wishlist.products.map((product) => product._id)
        query._id = { $in: productIds }
      }

      if (sortBy) {
        sortCriteria[sortBy] = order
      }

      if (sortBy === 'likes' || sortBy === 'avgRating') {
        sortCriteria[sortBy] = -1
      }
    }

    const totalProducts = await Product.countDocuments(query)

    let products = await Product.find(query)
      .sort(sortCriteria)
      .limit(limit)
      .skip((page - 1) * limit)

    products = await Promise.all(
      products.map(async (product) => {
        const store = await Store.findById(product.storeId)
        return store && !store.isBlocked ? product : null
      })
    )

    // Remove null values from the products array
    products = products.filter((product) => product !== null)

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully based on query criteria.',
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

//@desc Get Specific Product details
//@route GET /api/v1/user/product/:id
//@access public
export const getProductById = async (req, res) => {
  const { productId } = req.params

  try {
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Product details fetched successfully',
      product,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

//@desc Fetch user's wishlisted products
//@route GET /api/v1/user/product/wishlist
//@access private
export const fetchWishlist = async (req, res) => {
  const userId = req.user.id

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'products',
      select: '_id',
    })

    return res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully.',
      wishlist,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Error fetching wishlist',
      success: false,
    })
  }
}

//@desc Add/Remove from wishlist
//@route POST /api/v1/user/product/wishlist/:productId
//@access Private
export const addToWishlist = async (req, res) => {
  const { productId } = req.params
  const userId = req.user.id

  try {
    // Check if the user has a wishlist
    let wishlist = await Wishlist.findOne({ user: userId })

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] })
      return res.status(201).json({
        success: true,
        message: 'Product added to wishlist successfully',
      })
    }

    const productIndex = wishlist.products.indexOf(productId)
    if (productIndex !== -1) {
      wishlist.products.splice(productIndex, 1)
      await wishlist.save()
      return res.status(200).json({
        success: true,
        isAdded: false,
        message: 'Product removed from wishlist successfully',
      })
    } else {
      wishlist.products.push(productId)
      await wishlist.save()
      return res.status(201).json({
        success: true,
        isAdded: true,
        message: 'Product added to wishlist successfully',
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Error adding/removing product from wishlist',
      success: false,
    })
  }
}

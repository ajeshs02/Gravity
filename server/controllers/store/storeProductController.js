import Product from '../../models/productModel.js'
import Review from '../../models/reviewModel.js'
import cloudinary from '../../utils/cloudinary.js'

//@desc Add Product
//@route POST/api/v1/store/add-product
//@access private
export const addProduct = async (req, res) => {
  const { name, category, brand, description, price, stock, discount } =
    req.body

  const storeId = req.store._id

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'At least one image is required' })
  }

  const images = req.files.map((file) => ({
    url: file.url,
    public_id: file.public_id,
  }))

  const product = new Product({
    storeId,
    name,
    category,
    brand,
    description,
    discount,
    price,
    stock,
    images,
  })

  try {
    const result = await product.save()

    return res.status(201).json({
      message: 'Product created successfully',
      success: true,
      product: result,
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

//@desc Update Product
//@route PUT/api/v1/store/update-product/:id
//@access private
export const updateProduct = async (req, res) => {
  const productId = req.params.id
  const { name, category, brand, description, price, stock, discount } =
    req.body

  try {
    // Check if the product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          type: 'NotFound',
          message: 'Product not found',
        },
      })
    }

    // Update product fields
    product.name = name
    product.category = category
    product.brand = brand
    product.description = description
    product.price = price
    product.stock = stock
    product.discount = discount

    // Save the updated product
    const updatedProduct = await product.save()

    return res.status(200).json({
      message: 'Product updated successfully',
      success: true,
      product: updatedProduct,
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

//@desc Delete Product
//@route DELETE/api/v1/store/product/delete/:productId
//@access private
export const softDeleteProduct = async (req, res) => {
  const { productId } = req.params

  try {
    // Check if the product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' })
    }

    // Toggle the softDelete value
    product.softDelete = !product.softDelete
    await product.save()

    return res.status(200).json({
      success: true,
      message: 'Soft delete successfully',
      softDelete: product.softDelete,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}

//@desc Get Product Categories
//@route GET /api/v1/store/categories
//@access private
export const getProductCategories = async (req, res) => {
  const storeId = req.store._id

  try {
    let categories = await Product.distinct('category', { storeId })

    categories = ['all', ...categories]

    return res.status(200).json({
      success: true,
      message: 'Store products categories fetched successfully',
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

//@desc Fetch All Products
//@route GET /api/v1/store/product
//@access private
export const fetchStoreProducts = async (req, res) => {
  const storeId = req.store._id
  const category = req.query.category
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8
  const deleted = req.query.deleted || false // Check if to include deleted products

  try {
    let query = { storeId, softDelete: deleted }

    if (category) {
      query.category = category
    }

    const totalProducts = await Product.countDocuments(query)

    const products = await Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)

    return res.status(200).json({
      success: true,
      message: 'Store products fetched successfully',
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
//@route GET /api/v1/store/product/:id
//@access public
export const getProductById = async (req, res) => {
  const { id: productId } = req.params

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

//@desc Get Reviews for a Specific Product
//@route GET/api/v1/store/product/:id/reviews
//@access public
export const getStoreProductReviews = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      })
    }

    const reviews = await Review.find({ product: id }).populate('user')

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      reviews,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Could not fetch Reviews: ' + error.message,
    })
  }
}

//@desc Get Reviews for a Specific Product
//@route GET/api/v1/store/product/:id/reviews
//@access public
export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      })
    }

    const reviews = await Review.find({ product: id })

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      reviews,
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

//@desc Add Product Image
//@route POST /api/v1/store/product/add-product-image/:productId
//@access Private
export const addProductImage = async (req, res) => {
  const productId = req.params.productId

  if (!req.file) {
    return res.status(400).json({ error: 'Product image is required' })
  }

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Add the new image to the product's images array
    let newImage = {
      url: req.file.url,
      public_id: req.file.public_id,
    }

    product.images.push(newImage)

    await product.save()

    return res.status(200).json({
      success: true,
      message: 'Product image added successfully',
      product: product,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error while adding product image',
    })
  }
}

//@desc Update Product Images
//@route PUT /api/v1/store/product/update-product-image/:productId
//@access Private
export const updateProductImage = async (req, res) => {
  const productId = req.params.productId
  const { imageIndex, imagePublicId } = req.body

  // console.log(productId, imageIndex, imagePublicId)

  if (!req.file) {
    return res.status(400).json({ error: 'Product image is required' })
  }

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    if (
      product.images[imageIndex] &&
      product.images[imageIndex].public_id === imagePublicId
    ) {
      await cloudinary.uploader.destroy(imagePublicId)
    }

    // Update the product's image at the given index
    let updatedImage = {
      url: req.file.url,
      public_id: req.file.public_id,
    }

    // console.log('updatedImage: ', updatedImage)

    product.images[imageIndex] = updatedImage

    await product.save()

    // console.log('product updated', product)

    return res.status(200).json({
      success: true,
      message: 'Product image updated successfully',
      product: product,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating product image',
    })
  }
}

//@desc Delete Product Image
//@route PUT /api/v1/store/product/delete-product-image/:productId
//@access Private
export const deleteProductImage = async (req, res) => {
  const productId = req.params.productId
  const { imageIndex, imagePublicId } = req.body

  // console.log(imageIndex, imagePublicId)

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // If the product has only one image, return immediately
    if (product.images.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'Product must have at least one image',
      })
    }

    // Delete the image from Cloudinary
    try {
      await cloudinary.uploader.destroy(imagePublicId)
    } catch (error) {
      console.error('image destroy failed', error)
    }

    // Remove the image from the product's images array
    product.images.splice(imageIndex, 1)

    await product.save()

    return res.status(200).json({
      success: true,
      message: 'Product image deleted successfully',
      product: product,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product image',
    })
  }
}

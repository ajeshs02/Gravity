import dotenv from 'dotenv'
dotenv.config()
import User from '../../models/userModel.js'
import Product from '../../models/productModel.js'
import Review from '../../models/reviewModel.js'

//@desc Get Reviews for a Specific Product
//@route GET/api/v1/user/product/:id/reviews
//@access public
const getProductReviews = async (req, res) => {
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

//@desc Add a review to  product
//@route POST /api/v1/user/product/add-review/:productId
//@access Private
const addReview = async (req, res) => {
  const { productId } = req.params
  const { rating, review } = req.body
  const userId = req.user.id

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    })
    if (existingReview) {
      return res.status(400).json({
        errorMessage: 'Review already exists',
        success: false,
        message: 'You have already reviewed this product',
      })
    }

    const user = await User.findById(userId)

    const newReview = await Review.create({
      user: userId,
      product: productId,
      name: user.name,
      rating,
      review,
    })

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: newReview,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review: ' + error.message,
    })
  }
}

//@desc Delete a review from a product
//@route DELETE /api/v1/user/product/delete-review/:reviewId
//@access Private
const deleteReview = async (req, res) => {
  const { reviewId } = req.params

  try {
    // Find the review by ID
    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }

    // Delete the review
    await Review.deleteOne({ _id: reviewId })

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting review: ' + error.message,
    })
  }
}
export { getProductReviews, addReview, deleteReview }

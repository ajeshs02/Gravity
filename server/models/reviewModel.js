import mongoose from 'mongoose'
import Product from './productModel.js'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      enum: [1, 2, 3, 4, 5],
    },
    review: {
      type: String,
      required: [true, 'Review is required'],
      maxLength: [500, 'Review cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
)

reviewSchema.pre('remove', async function (next) {
  try {
    // Find the product associated with the review
    const product = await Product.findById(this.product)
    if (!product) {
      return
    }

    // Find all reviews associated with the product
    const reviews = await Review.find({ product: product._id })

    // Calculate the total number of reviews and total sum of ratings
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0)
    const numOfReviews = reviews.length

    // Calculate the average rating
    const avgRating = numOfReviews > 0 ? totalRatings / numOfReviews : 0

    // Update the product's average rating and number of reviews
    product.avgRating = avgRating
    product.numOfReviews = numOfReviews

    // Save the product with the updated average rating and number of reviews
    await product.save()

    next()
  } catch (error) {
    console.log('Error updating product average rating:', error)
    next(error)
  }
})

reviewSchema.post('save', async function (doc, next) {
  try {
    // Find the product associated with the review
    const product = await Product.findById(doc.product)
    if (!product) {
      return
    }

    // Find all reviews associated with the product
    const reviews = await Review.find({ product: product._id })

    // Calculate the total number of reviews and total sum of ratings
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0)
    const numOfReviews = reviews.length

    // Calculate the average rating
    const avgRating = numOfReviews > 0 ? totalRatings / numOfReviews : 0

    // Update the product's average rating and number of reviews
    product.avgRating = avgRating
    product.numOfReviews = numOfReviews

    // Save the product with the updated average rating and number of reviews
    await product.save()

    next()
  } catch (error) {
    console.log('Error updating product average rating:', error)
    next(error)
  }
})

reviewSchema.post('findByIdAndUpdate', async function () {
  // 'this' gives you access to the query that was executed
  const reviewId = this.getQuery()._id

  // Find the updated review
  const updatedReview = await Review.findById(reviewId)
  if (!updatedReview) {
    return
  }

  // Find the product associated with the review
  const product = await Product.findById(updatedReview.product)
  if (!product) {
    return
  }

  // Find all reviews associated with the product
  const reviews = await Review.find({ product: product._id })

  // Calculate the total number of reviews and total sum of ratings
  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0)
  const numOfReviews = reviews.length

  // Calculate the average rating
  const avgRating = numOfReviews > 0 ? totalRatings / numOfReviews : 0

  // Update the product's average rating and number of reviews
  product.avgRating = avgRating
  product.numOfReviews = numOfReviews

  // Save the product with the updated average rating and number of reviews
  await product.save()
})

const Review = mongoose.model('Review', reviewSchema)
export default Review

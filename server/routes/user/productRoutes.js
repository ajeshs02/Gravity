import { Router } from 'express'
import {
  addToWishlist,
  fetchProducts,
  fetchWishlist,
  getAllProductCategories,
  getProductById,
} from '../../controllers/user/productController.js'
import {
  addReview,
  deleteReview,
  getProductReviews,
} from '../../controllers/user/reviewController.js'
import { validateUserToken } from '../../middlewares/authMiddleware.js'

const router = Router()

router.get('/', validateUserToken, fetchProducts)
router.get('/categories', getAllProductCategories)
router.get('/:productId', getProductById)
router.get('/:id/reviews', getProductReviews)
router.post('/add-review/:productId', validateUserToken, addReview)
router.delete('/delete-review/:reviewId', validateUserToken, deleteReview)
router.get('/wishlist/fetch', validateUserToken, fetchWishlist)
router.patch('/wishlist/:productId', validateUserToken, addToWishlist)

export { router as userProductRouter }

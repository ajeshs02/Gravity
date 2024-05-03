import { Router } from 'express'
import {
  addProduct,
  getProductCategories,
  fetchStoreProducts,
  getProductById,
  getStoreProductReviews,
  updateProduct,
  softDeleteProduct,
  updateProductImage,
  deleteProductImage,
  addProductImage,
} from '../../controllers/store/storeProductController.js'
import { upload } from '../../middlewares/multer.js'
import { validateStoreToken } from '../../middlewares/authMiddleware.js'
import {
  productUploadMiddleware,
  uploadMiddleware,
} from '../../middlewares/imageUploader.js'

const router = Router()

router.post(
  '/add-product',
  validateStoreToken,
  upload.array('images', 4),
  uploadMiddleware,
  addProduct
)
router.put('/update-product/:id', validateStoreToken, updateProduct)
router.delete('/delete/:productId', validateStoreToken, softDeleteProduct)
router.get('/categories', validateStoreToken, getProductCategories)
router.get('/', validateStoreToken, fetchStoreProducts)
router.get('/:id', validateStoreToken, getProductById)
router.get('/:id/reviews', getStoreProductReviews)
router.put(
  '/add-product-image/:productId',
  validateStoreToken,
  upload.single('image'),
  productUploadMiddleware,
  addProductImage
)
router.put(
  '/update-product-image/:productId',
  validateStoreToken,
  upload.single('image'),
  productUploadMiddleware,
  updateProductImage
)
router.put(
  '/delete-product-image/:productId',
  validateStoreToken,
  deleteProductImage
)

export { router as storeProductRouter }

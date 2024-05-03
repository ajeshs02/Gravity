import { Router } from 'express'
import {
  addToCart,
  viewCart,
  updateCart,
  deleteCartItem,
} from '../../controllers/user/cartController.js'
import { validateUserToken } from '../../middlewares/authMiddleware.js'

const router = Router()

router.get('/', validateUserToken, viewCart)
router.post('/add/:productId', validateUserToken, addToCart)
router.put('/update/:productId', validateUserToken, updateCart)
router.patch('/delete/:productId', validateUserToken, deleteCartItem)

export { router as userCartRouter }

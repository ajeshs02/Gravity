import express from 'express'
import { validateUserToken } from '../../middlewares/authMiddleware.js'
import {
  cancelOrder,
  getOrders,
} from '../../controllers/user/ordersController.js'
const router = express.Router()

router.get('/', validateUserToken, getOrders)
router.post('/cancel/:orderId', validateUserToken, cancelOrder)

export { router as userOrdersRouter }

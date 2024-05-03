import express from 'express'
const router = express.Router()

import {
  createOrder,
  confirmPayment,
} from '../../controllers/user/paymentController.js'
import { validateUserToken } from '../../middlewares/authMiddleware.js'

router.post('/new-order', validateUserToken, createOrder)
router.post('/verify', validateUserToken, confirmPayment)

export { router as userPaymentRouter }

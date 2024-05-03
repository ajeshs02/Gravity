import express from 'express'
import { isAdmin } from '../../middlewares/authMiddleware.js'
import {
  fetchOrders,
  updateOrderDeliveryDate,
} from '../../controllers/admin/adminOrdersController.js'

const router = express.Router()

router.get('/', fetchOrders)
router.put('/:orderId', updateOrderDeliveryDate)

export { router as adminOrderRouter }

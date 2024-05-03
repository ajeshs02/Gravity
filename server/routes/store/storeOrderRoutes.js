import express from 'express'
import { validateStoreToken } from '../../middlewares/authMiddleware.js'
import { getStoreOrders } from '../../controllers/store/ordersController.js'
const router = express.Router()

router.get('/', validateStoreToken, getStoreOrders)

export { router as storeOrderRoutes }

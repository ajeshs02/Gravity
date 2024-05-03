import { Router } from 'express'

import { validateStoreToken } from '../../middlewares/authMiddleware.js'
import {
  fetchTotalIncomeForMonth,
  fetchMostSoldProducts,
  fetchTotalFollowers,
  salesPerCategory,
} from '../../controllers/store/dashboardController.js'

const router = Router()

router.get('/totalIncome', validateStoreToken, fetchTotalIncomeForMonth)
router.get('/mostSold', validateStoreToken, fetchMostSoldProducts)
router.get('/followers', validateStoreToken, fetchTotalFollowers)
router.get('/salesPerCategory', validateStoreToken, salesPerCategory)

export { router as storeDashboardRouter }

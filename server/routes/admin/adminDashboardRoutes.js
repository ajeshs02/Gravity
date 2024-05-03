import { Router } from 'express'
import {
  fetchMostBoughtProducts,
  fetchTotalIncomeForMonth,
  fetchTotalIncomePerStore,
  fetchTotalIncomePerStorePerMonth,
  fetchTotalUsers,
  salesPerCategory,
} from '../../controllers/admin/dashboardController.js'

const router = Router()

// Routes for admin dashboard

// GET /api/v1/admin/dashboard/sales-per-category - Fetch sales per category
router.get('/sales-per-category', salesPerCategory)

// GET /api/v1/admin/dashboard/total-income - Fetch total income for the month
router.get('/total-income', fetchTotalIncomeForMonth)

// GET /api/v1/admin/dashboard/total-income-per-store - Fetch total income per store
router.get('/total-income-per-store', fetchTotalIncomePerStore)

// GET /api/v1/admin/dashboard/income/store/month - Fetch total income per store per month
router.get('/income/store/month', fetchTotalIncomePerStorePerMonth)

// GET /api/v1/admin/dashboard/most-bought - Fetch the most bought product
router.get('/most-bought', fetchMostBoughtProducts)

// GET /api/v1/admin/dashboard/total-users - Fetch total number of users
router.get('/total-users', fetchTotalUsers)

export { router as adminDashboardRouter }

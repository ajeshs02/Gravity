import express from 'express'
import { isAdmin } from '../../middlewares/authMiddleware.js'

import {
  printReport,
  toggleStoreBlockStatus,
  viewAllStores,
} from '../../controllers/admin/adminStoreController.js'

const router = express.Router()

router.get('/view-stores', viewAllStores)
router.put('/toggle-block/:storeId', toggleStoreBlockStatus)
router.get('/income/store/month/pdf', printReport)

export { router as adminStoreRouter }

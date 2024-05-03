import express from 'express'
import { isAdmin } from '../../middlewares/authMiddleware.js'
import {
  toggleUserBlockStatus,
  viewAllUsers,
} from '../../controllers/admin/adminUserController.js'

const router = express.Router()

router.get('/view-users', viewAllUsers)
router.put('/toggle-block/:userId', toggleUserBlockStatus)

export { router as adminUserRouter }

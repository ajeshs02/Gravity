import express from 'express'

import {
  adminLogin,
  adminLogout,
} from '../../controllers/admin/adminController.js'

const router = express.Router()

router.post('/login', adminLogin)
router.post('/logout', adminLogout)

export { router as adminRouter }

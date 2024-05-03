import { Router } from 'express'

import {
  fetchAddress,
  addAddress,
  updateAddress,
} from '../../controllers/user/addressController.js'

import { validateUserToken } from '../../middlewares/authMiddleware.js'

const router = Router()

router.get('/', validateUserToken, fetchAddress)
router.post('/add', validateUserToken, addAddress)
router.put('/update', validateUserToken, updateAddress)

export { router as userAddressRouter }

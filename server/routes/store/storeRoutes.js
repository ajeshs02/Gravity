import { Router } from 'express'
import {
  sendOTP,
  registerStore,
  loginStore,
  logoutStore,
  fetchStoreProfile,
  updateStoreProfile,
  updateStoreProfileImg,
} from '../../controllers/store/storeController.js'
import { validateStoreToken } from '../../middlewares/authMiddleware.js'

import { storeUploadMiddleware } from '../../middlewares/imageUploader.js'
import { upload } from '../../middlewares/multer.js'

const router = Router()

router.post('/send-otp', sendOTP)
router.post('/register', registerStore)
router.post('/login', loginStore)
router.post('/logout', logoutStore)
router.get('/profile', validateStoreToken, fetchStoreProfile)
router.put('/profile', validateStoreToken, updateStoreProfile)
router.put(
  '/update-profile-image',
  validateStoreToken,
  upload.single('image'),
  storeUploadMiddleware,
  updateStoreProfileImg
)
export { router as storeRouter }

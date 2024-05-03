import { Router } from 'express'
import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  sendOTP,
  updateUserProfile,
  updateUserProfileImg,
} from '../../controllers/user/userController.js'

import { validateUserToken } from '../../middlewares/authMiddleware.js'
import { userUploadMiddleware } from '../../middlewares/imageUploader.js'
import { upload } from '../../middlewares/multer.js'

const router = Router()

router.post('/send-otp', sendOTP)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/profile', validateUserToken, getProfile)
router.put(
  '/update-profile-image',
  validateUserToken,
  upload.single('image'),
  userUploadMiddleware,
  updateUserProfileImg
)
router.put('/profile', validateUserToken, updateUserProfile)

export { router as userRouter }

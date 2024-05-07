import { Router } from 'express'
import { fetchUserDetails } from '../../controllers/store/storeUserController.js'

const router = Router()

router.get('/:userId', fetchUserDetails)

export { router as storeUserRouter }

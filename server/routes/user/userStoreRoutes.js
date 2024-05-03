import { Router } from 'express'
import {
  fetchStores,
  fetchStoreDetails,
  fetchStoreProducts,
  followStore,
} from '../../controllers/user/userStoreController.js'
import { validateUserToken } from '../../middlewares/authMiddleware.js'

const router = Router()

router.get('/', validateUserToken, fetchStores)
router.get('/:storeId', fetchStoreDetails)
router.get('/:storeId/products', fetchStoreProducts)
router.post('/follow/:storeId', validateUserToken, followStore)

export { router as userStoreRouter }

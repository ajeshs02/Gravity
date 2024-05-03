import { Router } from 'express'
import {
  addProductCategory,
  getProductCategory,
} from '../../controllers/store/categoryController.js'

const router = Router()

router.post('/', addProductCategory)
router.get('/', getProductCategory)

export { router as productCategoryRouter }

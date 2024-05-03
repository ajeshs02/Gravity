import Category from '../../models/categoryModel.js'
import { handleError } from '../../utils/handleError.js'

//@desc   Add Product Category
//@route  POST/api/stores/product/category
//@access Private
const addProductCategory = async (req, res) => {
  const { name, type } = req.body

  // console.log('server', name, type)

  try {
    const newCategories = await Category.create({ name, type })

    res.status(201).json({
      message: 'Category added successfully',
      success: true,
      newCategories,
    })
  } catch (error) {
    handleError(error)
  }
}

//@desc   Fetch Product Category
//@route  GET/api/stores/product/category
//@access Private
const getProductCategory = async (req, res) => {
  const { type } = req.query

  try {
    const categories = await Category.find({ type })

    // console.log('db categories', categories)

    res.status(200).json({
      message: 'categories fetched successfully',
      success: true,
      categories,
    })
  } catch (error) {
    handleError(error)
  }
}

export { addProductCategory, getProductCategory }

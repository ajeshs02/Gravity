import mongoose from 'mongoose'
import Order from '../../models/ordersModel.js'
import Product from '../../models/productModel.js'
import Store from '../../models/storeModel.js'
import Transaction from '../../models/transactionModel.js'
import Follower from '../../models/followersModel.js'

//@desc Fetch total followers
//@route GET /api/v1/store/dashboard/followers
//@access private
export const fetchTotalFollowers = async (req, res) => {
  const storeId = req.store.id

  try {
    const followers = await Follower.aggregate([
      {
        $match: {
          store: new mongoose.Types.ObjectId(storeId),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const totalFollowersCount = await Follower.countDocuments({
      store: storeId,
    })

    return res.status(200).json({
      success: true,
      followersOverTime: followers,
      totalFollowersCount,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

//@desc Fetch most sold products
//@route GET /api/v1/store/dashboard/mostSold
//@access private
export const fetchMostSoldProducts = async (req, res) => {
  const storeId = req.store.id

  try {
    const ordersExist = await Order.exists({
      'items.storeId': new mongoose.Types.ObjectId(storeId),
    })
    if (!ordersExist) {
      return res.status(200).json({
        success: true,
        message: 'No orders found for this store.',
        mostSoldProducts: [],
      })
    }

    const orders = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.storeId': new mongoose.Types.ObjectId(storeId) } },
      { $group: { _id: '$items.product', total: { $sum: '$items.quantity' } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ])

    const mostSoldProducts = await Promise.all(
      orders.map(async (order) => {
        const product = await Product.findById(order._id)
        return { product, quantity: order.total }
      })
    )

    return res.status(200).json({
      success: true,
      mostSoldProducts,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

// @desc Fetch total income per month for the current year
// @route GET /api/v1/store/dashboard/totalIncome
// @access private
export const fetchTotalIncomeForMonth = async (req, res) => {
  const storeId = req.store.id
  const currentYear = new Date().getFullYear()

  try {
    const transactions = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(currentYear, 0),
            $lt: new Date(currentYear + 1, 0),
          },
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'orderId',
          foreignField: 'razorpayOrderId',
          as: 'order',
        },
      },
      {
        $unwind: '$order',
      },
      {
        $match: {
          'order.items.storeId': new mongoose.Types.ObjectId(storeId),
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalIncome: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const totalIncome = Array(12).fill(0)
    transactions.forEach((transaction) => {
      totalIncome[transaction._id - 1] = transaction.totalIncome
    })

    return res.status(200).json({
      success: true,
      totalIncome,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

//@desc Fetch total sales per category for a specific store
//@route GET /api/v1/store/dashboard/salesPerCategory
//@access private
export const salesPerCategory = async (req, res) => {
  const storeId = req.store.id

  try {
    const productsExist = await Product.exists({
      storeId: new mongoose.Types.ObjectId(storeId),
    })
    if (!productsExist) {
      return res.status(200).json({
        success: true,
        message: 'No products found for this store.',
        salesPerCategory: [],
      })
    }

    const salesData = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.storeId': new mongoose.Types.ObjectId(storeId) } },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productData',
        },
      },
      { $unwind: '$productData' },
      {
        $group: {
          _id: '$productData.category',
          totalSales: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSales: -1 } },
    ])

    return res.status(200).json({
      success: true,
      salesPerCategory: salesData,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

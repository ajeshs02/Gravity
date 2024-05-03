import mongoose from 'mongoose'
import Order from '../../models/ordersModel.js'
import Product from '../../models/productModel.js'
import Store from '../../models/storeModel.js'
import Transaction from '../../models/transactionModel.js'
import User from '../../models/userModel.js'

//@desc Fetch total income per month
//@route GET /api/v1/admin/dashboard/total-income
//@access private
export const fetchTotalIncomeForMonth = async (req, res) => {
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

//@desc Fetch total income per store
//@route GET /api/v1/admin/dashboard/total-income-per-store
//@access private
export const fetchTotalIncomePerStore = async (req, res) => {
  try {
    const totalIncomePerStore = await Transaction.aggregate([
      {
        $match: { status: 'completed' },
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
        $group: {
          _id: '$order.items.storeId',
          totalIncome: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: '_id',
          foreignField: '_id',
          as: 'store',
        },
      },
      {
        $unwind: '$store',
      },
    ])

    return res.status(200).json({
      success: true,
      totalIncomePerStore,
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

//@desc Fetch total income per store per month
//@route GET /api/v1/admin/dashboard/income/store/month
//@access private
export const fetchTotalIncomePerStorePerMonth = async (req, res) => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  try {
    const transactions = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(currentYear, currentMonth),
            $lt: new Date(currentYear, currentMonth + 1),
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
        $group: {
          _id: {
            store: '$order.items.storeId',
          },
          totalIncome: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.store': 1 } },
    ])

    return res.status(200).json({
      success: true,
      totalIncomePerStoreCurrentMonth: transactions,
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

//@desc Most bought product
//@route GET /api/v1/admin/dashboard/most-bought
//@access private
export const fetchMostBoughtProducts = async (req, res) => {
  // Rename the function to fetchMostBoughtProducts
  try {
    const ordersExist = await Order.exists({})
    if (!ordersExist) {
      return res.status(200).json({
        success: true,
        message: 'No orders found.',
        mostBoughtProducts: [], // Change the field to mostBoughtProducts
      })
    }

    const orders = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', total: { $sum: '$items.quantity' } } },
      { $sort: { total: -1 } },
      { $limit: 5 }, // Change the limit to 5 to get the top 5 most bought products
    ])

    const mostBoughtProducts = await Promise.all(
      // Change the variable to mostBoughtProducts
      orders.map(async (order) => {
        const product = await Product.findById(order._id)
        return { product, quantity: order.total }
      })
    )

    return res.status(200).json({
      success: true,
      mostBoughtProducts, // Change the field to mostBoughtProducts
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

//@desc Fetch total users
//@route GET /api/v1/admin/dashboard/total-users
//@access private
export const fetchTotalUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const totalUsersCount = await User.countDocuments({})

    return res.status(200).json({
      success: true,
      usersOverTime: users, // Add a new field usersOverTime
      totalUsersCount,
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

//@desc Fetch sales per category
//@route GET /api/v1/admin/dashboard/sales-per-category
//@access private
export const salesPerCategory = async (req, res) => {
  try {
    const productsExist = await Product.exists({})
    if (!productsExist) {
      return res.status(200).json({
        success: true,
        message: 'No products found.',
        salesPerCategory: [],
      })
    }

    const salesData = await Order.aggregate([
      { $unwind: '$items' },
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

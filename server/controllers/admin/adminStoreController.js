import Store from '../../models/storeModel.js'
import Transaction from '../../models/transactionModel.js'
import { fetchTotalIncomePerStorePerMonth } from './dashboardController.js'

//@desc View all Stores
//@route GET/api/v1/admin/stores/view-stores
//@access private
export const viewAllStores = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8
  const searchQuery = req.query.search || ''

  try {
    const totalStores = await Store.countDocuments({
      $or: [
        { storeName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { mobile: { $regex: searchQuery, $options: 'i' } },
      ],
    })

    const stores = await Store.find({
      $or: [
        { storeName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { mobile: { $regex: searchQuery, $options: 'i' } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    res.status(200).json({
      message: 'Stores fetched successfully',
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalStores / limit),
      stores,
    })
  } catch (error) {
    handleError(error)
  }
}

//@desc Toggle Store Block Status
//@route PUT /api/v1/admin/stores/toggle-block/:storeId
//@access private
export const toggleStoreBlockStatus = async (req, res) => {
  const { storeId } = req.params

  try {
    // Find the store by ID
    const store = await Store.findById(storeId)

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      })
    }

    // Toggle the isBlocked status to the opposite of its current value
    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      { $set: { isBlocked: !store.isBlocked } },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: 'Store block status toggled successfully',
      store: {
        _id: updatedStore._id,
        isBlocked: updatedStore.isBlocked,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      error: 'Server error',
    })
  }
}

//@desc Download pdf
//@route GET /api/v1/admin/stores/income/store/month/pdf
//@access private
export const printReport = async (req, res) => {
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
        $unwind: '$order.items',
      },
      {
        $group: {
          _id: {
            store: '$order.items.storeId',
            order: '$order._id',
          },
          amount: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.store',
          totalIncome: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json(transactions)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

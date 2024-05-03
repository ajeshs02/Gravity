import Order from '../../models/ordersModel.js'

//@desc Get store orders
//@route GET /api/v1/store/orders
//@access private
export const getStoreOrders = async (req, res) => {
  const storeId = req.store.id
  try {
    const orders = await Order.find({ 'items.storeId': storeId })
      .populate({
        path: 'user',
      })
      .populate({
        path: 'items.product',
        populate: {
          path: 'storeId',
        },
      })
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: 'Store orders fetched successfully',
      orders: orders,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

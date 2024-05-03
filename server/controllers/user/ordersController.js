import Orders from '../../models/ordersModel.js'
import Wallet from '../../models/walletModel.js'
import User from '../../models/userModel.js'

//@desc Get orders of the user
//@route GET /api/v1/user/orders
//@access Private
const getOrders = async (req, res) => {
  const userId = req.user.id

  try {
    const orders = await Orders.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .populate('items.product')
      .populate('shippingAddress')
      .exec()

    res.status(200).json({
      message: 'Orders fetched successfully',
      success: true,
      orders,
    })
  } catch (error) {
    console.error('Server error while fetching orders:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message,
    })
  }
}

//@desc Request order cancellation
//@route POST  /api/v1/user/orders/cancel/:orderId
//@access Private
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    const { reason } = req.body
    const userId = req.user.id

    const order = await Orders.findById(orderId)

    const user = await User.findById(userId)

    // console.log(order)

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' })
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({
        message: 'Order cannot be cancelled as product already delivered',
      })
    }

    let userWallet = await Wallet.findOne({ userId: order.user })

    if (!userWallet) {
      userWallet = await Wallet.create({ userId: order.user, balance: 0 })
    }

    userWallet.balance += order.total
    userWallet.history.push({
      amount: order.total,
      type: 'addition',
      orderDetails: order._id,
    })

    order.isCancelled = true
    order.reason = reason
    order.status = 'Cancelled'

    await order.save()

    // await orderCancelMail(user.email, order)

    res.status(200).json({
      success: true,
      message: 'Order cancellation requested successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export { getOrders, cancelOrder }

import Order from '../../models/ordersModel.js'

//@desc Fetch all orders
//@route GET /api/v1/admin/orders
//@access private
export const fetchOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'items.product',
        select: 'name storeId category brand price images',
        populate: {
          path: 'storeId',
          select: 'storeName',
        },
      })
      .populate({
        path: 'shippingAddress',
        select: 'addressDetails',
      })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      error: 'Server error',
    })
  }
}

//@desc Update order delivery date
//@route PUT /api/v1/admin/orders/:orderId
//@access private
export const updateOrderDeliveryDate = async (req, res) => {
  try {
    const { orderId } = req.params
    const { deliveryDate } = req.body

    // Validate if the delivery date is provided
    if (!deliveryDate) {
      return res.status(400).json({
        success: false,
        error: 'Delivery date is required',
      })
    }

    // Find the order by ID and update the delivery date
    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryDate },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      })
    }

    res.status(200).json({
      message: 'Date updated successfully',
      success: true,
      data: order,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      error: 'Server error',
    })
  }
}

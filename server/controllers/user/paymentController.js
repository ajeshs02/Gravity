import crypto from 'crypto'
import Cart from '../../models/cartModel.js'
import Product from '../../models/productModel.js'
import Address from '../../models/addressModel.js'
import Wallet from '../../models/walletModel.js'
import Order from '../../models/ordersModel.js'
import Transaction from '../../models/transactionModel.js'
import User from '../../models/userModel.js'
import { createOrderFn } from '../../utils/razorpay.js'
import { mailSender } from '../../utils/nodemailer.js'
// import { orderSuccessMail } from '../Utils/nodemailer.js'

//@desc Place the order
//@route POST/api/v1/user/payment/new-order
//@access private
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id
    const { useWallet } = req.body

    const cart = await Cart.findOne({ user: userId })

    // console.log('cart: ', cart)

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found.' })
    }

    const address = await Address.findOne({ user: userId })

    if (!address) {
      return res
        .status(404)
        .json({ success: false, error: 'Address not found.' })
    }

    const products = await Promise.all(
      cart.products.map(async (item) => {
        const product = await Product.findById(item.product)
        return {
          product: item.product,
          storeId: product.storeId,
          quantity: item.quantity,
          price: product.price,
          status: 'pending',
          deliveryDate: null,
        }
      })
    )

    const wallet = await Wallet.findOne({ userId })

    let total = cart.totalPrice
    let deductionAmount = 0

    if (useWallet && wallet) {
      if (total > wallet.balance) {
        deductionAmount = wallet.balance
        total -= wallet.balance
        wallet.balance = 0
      } else {
        deductionAmount = total
        wallet.balance -= total
        total = 0
      }
    }

    const order = await createOrderFn(total)

    if (!order) {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to create the order.' })
    }

    const newOrder = new Order({
      user: userId,
      items: products,
      totalPrice: total,
      status: 'pending',
      shippingAddress: address._id,
      paymentStatus: 'pending',
      deliveryDate: null,
      razorpayOrderId: order.id,
    })
    const savedOrder = await newOrder.save()
    if (useWallet && wallet) {
      wallet.history.push({
        amount: deductionAmount,
        type: 'deduction',
        orderDetails: savedOrder._id,
      })
      await wallet.save()
    }

    res.status(200).json({
      message: 'order created successfully',
      success: true,
      savedOrder,
    })
  } catch (error) {
    console.error('server error in the create order controller : ', error)
  }
}

//@desc confirm payment
//@route POST/api/v1/payment/verify
//@access private
const confirmPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RZP_KEY)
      .update(sign.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed',
      })
    }

    // Populate the user field in the order
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id })
      .populate('items.product')
      .populate('user') // Populate the user field

    if (order) {
      order.paymentStatus = 'completed'
      await order.save()

      const transaction = new Transaction({
        user: order.user,
        order: order._id,
        amount: order.totalPrice,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        timestamp: new Date(),
        signature: razorpay_signature,
        status: 'completed',
        paymentMethod: order.paymentMethod,
      })
      const savedTransaction = await transaction.save()

      // Craft the email body with order details
      const emailBody = `<h2>Order Placed Successfully</h2>
                         <h3>Order ID: ${order._id}</h3>
                         <h3>Total Price: ${order.totalPrice}</h3>
                         <h3>Payment Method: ${order.paymentMethod}</h3>
                         <p>Thank you for shopping with Gravshop!</p>`

      // Send email to the user
      await mailSender(order.user.email, 'Order Confirmation', emailBody)

      res.status(200).json({
        success: true,
        message: 'Payment successful',
        savedTransaction,
      })
    } else {
      res.status(404).json({
        success: false,
        error: 'Order not found',
      })
    }
  } catch (error) {
    console.error('Something went wrong during payment: ', error)
    res.status(500).json({
      success: false,
      error: 'Something went wrong during payment',
    })
  }
}

export { createOrder, confirmPayment }

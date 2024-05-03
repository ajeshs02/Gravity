import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        storeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Store',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['online'],
      default: 'online',
      required: true,
    },

    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    deliveryDate: {
      type: Date,
    },
    razorpayOrderId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', ordersSchema)
export default Order

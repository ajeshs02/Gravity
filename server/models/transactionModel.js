import mongoose from 'mongoose'

const transactionsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['online'],
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
)

const Transaction = mongoose.model('Transaction', transactionsSchema)
export default Transaction

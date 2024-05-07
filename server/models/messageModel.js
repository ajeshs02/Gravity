import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    model: {
      type: String,
      required: true,
      enum: ['User', 'Store'],
    },
  },
  conversationId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const Message = mongoose.model('Message', MessageSchema)
export default Message

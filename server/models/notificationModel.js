import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const Notification = mongoose.model('Notification', NotificationSchema)
export default Notification

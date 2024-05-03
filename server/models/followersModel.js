import mongoose from 'mongoose'

const followerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
  },
  { timestamps: true }
)

const Follower = mongoose.model('Follower', followerSchema)
export default Follower

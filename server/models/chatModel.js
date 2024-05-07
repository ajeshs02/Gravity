import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true,
  },
  members: [
    {
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
  ],
})

const Chat = mongoose.model('Chat', ChatSchema)
export default Chat

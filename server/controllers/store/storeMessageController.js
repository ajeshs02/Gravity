import Chat from '../../models/chatModel.js'
import Message from '../../models/messageModel.js'
import { io } from '../../socket/socket.js'

//@desc   Initiate Chat by Store
//@route  POST/api/v1/store/initiateChat/:userId
//@access Private/Store
export const storeInitiateChat = async (req, res) => {
  try {
    const { userId } = req.params

    const conversationId = `${userId}-${req.store.id}`

    let existingChat = await Chat.findOne({ conversationId })

    if (!existingChat) {
      existingChat = new Chat({
        conversationId,
        members: [
          { id: userId, model: 'User' },
          { id: req.store.id, model: 'Store' },
        ],
      })

      await existingChat.save()
    }

    res.status(200).json({
      success: true,
      message: 'Chat initiated successfully',
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

//@desc   Get Chats by Store
//@route  GET/api/v1/store/chats
//@access Private/Store
export const storeGetChats = async (req, res) => {
  try {
    const chats = await Chat.find({ 'members.id': req.store.id }).populate({
      path: 'members.id',
      model: 'User',
      select: 'name image',
    })

    const filteredChats = chats.filter((chat) =>
      chat.members.some((member) => member.model === 'User')
    )

    res.status(200).json({
      success: true,
      data: filteredChats,
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

//@desc   Send Message by Store
//@route  POST/api/v1/store/message
//@access Private/Store
export const storeSendMessage = async (req, res) => {
  try {
    const { userId, content } = req.body

    const conversationId = `${userId}-${req.store.id}`

    const message = new Message({
      content,
      sender: { id: req.store.id, model: 'Store' },
      conversationId,
    })

    const newMessage = await message.save()

    res.status(201).json({
      success: true,
      data: newMessage,
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

//@desc   Get Messages by Store
//@route  GET/api/v1/store/messages/:conversationId
//@access Private/Store
export const storeGetMessages = async (req, res) => {
  try {
    const { conversationId } = req.params

    const messages = await Message.find({ conversationId }).sort('timestamp')

    res.status(200).json({
      success: true,
      data: messages,
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

import Chat from '../../models/chatModel.js'
import Message from '../../models/messageModel.js'
import { io } from '../../socket/socket.js'

//@desc   Initiate Chat by User
//@route  POST/api/v1/user/initiateChat/:storeId
//@access Private/User
export const userInitiateChat = async (req, res) => {
  try {
    const { storeId } = req.params

    // Generate a conversationId
    const conversationId = `${req.user.id}-${storeId}`

    let existingChat = await Chat.findOne({ conversationId })

    if (!existingChat) {
      // Create a new chat
      existingChat = new Chat({
        conversationId,
        members: [
          { id: req.user.id, model: 'User' },
          { id: storeId, model: 'Store' },
        ],
      })

      // Save the chat
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

//@desc   Get Chats by User
//@route  GET/api/v1/user/chats
//@access Private/User
export const userGetChats = async (req, res) => {
  try {
    const chats = await Chat.find({ 'members.id': req.user.id }).populate({
      path: 'members.id',
      model: 'Store',
      select: 'storeName image',
    })

    const filteredChats = chats.filter((chat) =>
      chat.members.some((member) => member.model === 'Store')
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

//@desc   Send Message by User
//@route  POST/api/v1/user/message
//@access Private/User
export const userSendMessage = async (req, res) => {
  try {
    const { storeId, content } = req.body

    // console.log('storeId: ', storeId)

    const conversationId = `${req.user.id}-${storeId}`

    const message = new Message({
      content,
      sender: { id: req.user.id, model: 'User' },
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

//@desc   Get Messages by User
//@route  GET/api/v1/user/messages/:conversationId
//@access Private/User
export const userGetMessages = async (req, res) => {
  try {
    const { conversationId } = req.params

    // console.log('conversationId', conversationId)

    const messages = await Message.find({ conversationId }).sort('timestamp')

    // console.log('get messages', messages)

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

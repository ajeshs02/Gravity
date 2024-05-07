import { Router } from 'express'
import {
  userGetChats,
  userSendMessage,
  userGetMessages,
  userInitiateChat,
} from '../../controllers/user/userMessageController.js'

import { validateUserToken } from '../../middlewares/authMiddleware.js'

const router = Router()

router.get('/chats', validateUserToken, userGetChats)
router.post('/initiateChat/:storeId', validateUserToken, userInitiateChat)
router.post('/message', validateUserToken, userSendMessage)
router.get('/messages/:conversationId', validateUserToken, userGetMessages)

export { router as userMessageRoute }

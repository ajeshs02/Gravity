import { Router } from 'express'
import { validateStoreToken } from '../../middlewares/authMiddleware.js'
import {
  storeGetChats,
  storeInitiateChat,
  storeSendMessage,
  storeGetMessages,
} from '../../controllers/store/storeMessageController.js'

const router = Router()

router.get('/chats', validateStoreToken, storeGetChats)
router.post('/initiateChat/:storeId', validateStoreToken, storeInitiateChat)
router.post('/message', validateStoreToken, storeSendMessage)
router.get('/messages/:conversationId', validateStoreToken, storeGetMessages)

export { router as storeMessageRoute }

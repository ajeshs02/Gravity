import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { getStoreProfile } from '../../api/user'
import { useQuery } from '@tanstack/react-query'
import UserMessages from '../../components/user/UserMessages'
import { useSocket } from '../../context/SocketContext'
import { IoMdSend } from 'react-icons/io'
import StoreChatProfile from '../../components/user/StoreChatProfile'
import { CircularProgress } from '@mui/material'

const UserMessagePage = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const { conversationId } = useParams()
  const { socket } = useSocket()

  const storeId = conversationId.split('-')[1]
  const userId = conversationId.split('-')[0]

  const { data: store, isLoading: isProfileLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => getStoreProfile(storeId),
  })

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`/user/messages/${conversationId}`)
      setMessages(res.data.data)
    }

    fetchMessages()
  }, [storeId])

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', conversationId)
    }
  }, [socket, conversationId])

  const handleSend = async () => {
    const message = {
      content: input,
      storeId: storeId,
    }

    const { data } = await axios.post('/user/message', message)

    // Emit the message
    socket.emit('sendMessage', data.data)

    setInput('')
  }

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        // console.log('Received new message', message)
        setMessages((prevMessages) => [...prevMessages, message])
      })
    }

    return () => {
      if (socket) {
        socket.off('newMessage')
      }
    }
  }, [socket])

  useEffect(() => {
    const setWindowHeight = () => {
      const windowHeight = window.innerHeight
      const secondDivElement = document.getElementById('chat')

      // Set the height of the second div to match the window height
      secondDivElement.style.height = `${windowHeight - 80}px`
    }

    // Call the function when the page loads or when the window is resized
    window.addEventListener('load', setWindowHeight)
    window.addEventListener('resize', setWindowHeight)

    return () => {
      window.removeEventListener('load', setWindowHeight)
      window.removeEventListener('resize', setWindowHeight)
    }
  }, [])

  return (
    <div
      id="chat"
      className="flex"
      style={{ height: window.innerHeight - 80 + 'px' }}
    >
      {isProfileLoading ? (
        <div className="w-full h-72 flex justify-center items-center gap-y-4 font-medium ">
          <CircularProgress style={{ scale: '1.5' }} />
        </div>
      ) : (
        <>
          <div className="w-3/5 max-md:w-full relative h-full border-r border-uAccent/50">
            <div className="text-xl h-[15%] min-h-12 flex items-center bg-slate-300 mr-2 rounded-lg mb-5  font-bold p-2 border-b">
              <div className="h-3/4 aspect-square rounded-full overflow-hidden mr-2 ">
                <img
                  src={store.image.url}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {store?.storeName}
            </div>
            <UserMessages messages={messages} />
            <div className="flex  h-[15%] min-h-10 mt-auto items-center p-2 border-t">
              <input
                className="flex-grow border px-2 h-14 rounded-xl  focus:outline-uAccent border-uAccent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && input) {
                    handleSend()
                    e.preventDefault()
                  }
                }}
                placeholder="Type a message ..."
              />
              <button
                className="ml-2 px-4 py-1 h-14 rounded bg-uAccent text-white"
                onClick={handleSend}
                disabled={!input}
              >
                <IoMdSend className="h-full" />
              </button>
            </div>
          </div>
          <div className="w-2/5 flex max-md:hidden justify-center">
            <StoreChatProfile
              store={store}
              isProfileLoading={isProfileLoading}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default UserMessagePage

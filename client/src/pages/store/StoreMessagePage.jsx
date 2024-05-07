import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { getUserProfile } from '../../api/store' // replace with your actual API
import { useQuery } from '@tanstack/react-query'
import StoreMessages from '../../components/store/StoreMessages' // replace with your actual component
import { useSocket } from '../../context/SocketContext'
import { IoMdSend } from 'react-icons/io'
import UserChatProfile from '../../components/store/UserChatProfile'
import { CircularProgress } from '@mui/material'

const StoreMessagePage = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const { conversationId } = useParams()
  const { socket } = useSocket()

  const userId = conversationId.split('-')[0]

  const { data: user, isLoading: isProfileLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserProfile(userId),
  })

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`/store/messages/${conversationId}`)
      setMessages(res.data.data)
    }

    fetchMessages()
  }, [userId])

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', conversationId)
    }
  }, [socket, conversationId])

  const handleSend = async () => {
    const message = {
      content: input,
      userId: userId,
    }

    const { data } = await axios.post('/store/message', message)

    socket.emit('sendMessage', data.data)

    setInput('')
  }

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
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

      secondDivElement.style.height = `${windowHeight - 98}px`
    }

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
      style={{ height: window.innerHeight - 98 + 'px' }}
    >
      {isProfileLoading ? (
        <div className="w-full h-72 flex justify-center items-center gap-y-4 font-medium ">
          <CircularProgress style={{ scale: '1.5' }} />
        </div>
      ) : (
        <>
          <div className="w-3/5 max-md:w-full  relative h-full border-r border-sAccent/50 ">
            <div className="text-xl h-[15%] min-h-12 flex items-center  bg-slate-300 mr-2 rounded-lg mb-5  font-bold p-2 border-b">
              <div className="h-3/4 aspect-square rounded-full overflow-hidden mr-2 ">
                <img
                  src={user.image.url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {user?.name}
            </div>
            <StoreMessages messages={messages} />

            <div className="flex  h-[15%]  mt-auto  items-center p-2 border-t">
              <input
                className="flex-grow border px-2 h-14 rounded-xl focus:outline-sAccent border-sAccent"
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
                className="ml-2 px-4 py-1 h-14 rounded bg-sAccent text-white"
                onClick={handleSend}
                aria-label="send message"
                disabled={!input}
              >
                <IoMdSend className="h-full" />
              </button>
            </div>
          </div>

          <div className="w-2/5 flex max-md:hidden  justify-center">
            <UserChatProfile user={user} isProfileLoading={isProfileLoading} />
          </div>
        </>
      )}
    </div>
  )
}

export default StoreMessagePage

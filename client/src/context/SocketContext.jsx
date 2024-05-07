import React, { createContext, useContext, useEffect, useState } from 'react'
import socketio from 'socket.io-client'

const getSocket = () => {
  return socketio(import.meta.env.VITE_SOCKET_URI)
}

const SocketContext = createContext({
  socket: null,
})

const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    setSocket(getSocket())
  }, [])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export { SocketProvider, useSocket }

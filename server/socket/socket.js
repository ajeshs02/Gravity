import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: ['http://localhost:3000', 'https://gravity-3xtg.onrender.com'],
  },
})

io.on('connection', (socket) => {
  // console.log('a socket connected', socket.id)

  socket.on('joinRoom', (conversationId) => {
    socket.join(conversationId)
  })

  socket.on('sendMessage', (data) => {
    io.to(data.conversationId).emit('newMessage', data)
  })

  // socket.on('disconnect', () => {
  //   console.log('user disconnected', socket.id)
  // })
})

export { app, io, server }

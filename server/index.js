require('dotenv').config()
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Stockage des participants connectés
const participants = new Map()

io.on('connection', (socket) => {
  const { userId, guildId } = socket.handshake.query

  // Vérifier que l'utilisateur appartient au bon serveur Discord
  if (guildId !== process.env.NEXT_PUBLIC_DISCORD_GUILD_ID) {
    socket.disconnect()
    return
  }

  // Ajouter le participant à la liste
  participants.set(socket.id, {
    id: userId,
    socketId: socket.id
  })

  // Envoyer la liste mise à jour à tous les clients
  io.emit('participants:update', Array.from(participants.values()))

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    participants.delete(socket.id)
    io.emit('participants:update', Array.from(participants.values()))
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
}) 
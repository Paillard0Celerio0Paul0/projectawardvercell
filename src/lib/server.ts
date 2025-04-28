import { createServer } from 'http'
import { Server as ServerIO } from 'socket.io'

const httpServer = createServer()

// Stocker le serveur HTTP dans l'objet global
;(global as any).httpServer = httpServer

// Initialiser Socket.IO
const io = new ServerIO(httpServer, {
  path: '/api/socket/io',
  addTrailingSlash: false,
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Stocker Socket.IO dans l'objet global
;(global as any).io = io

// Démarrer le serveur HTTP
const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 
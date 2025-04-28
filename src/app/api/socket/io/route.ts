import { Server as NetServer } from 'http'
import { NextRequest } from 'next/server'
import { Server as ServerIO } from 'socket.io'

// Extension du type NetServer pour inclure la propriété io
declare module 'http' {
  interface Server {
    io?: ServerIO
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

let io: ServerIO | null = null

export async function GET(req: NextRequest) {
  if (!io) {
    console.log('Initialisation du serveur Socket.IO...')
    const httpServer = (global as any).httpServer
    if (!httpServer) {
      return new Response('Server not initialized', { status: 500 })
    }

    io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    // Stockage des participants connectés
    const participants = new Map()

    io.on('connection', (socket) => {
      console.log('Nouvelle connexion Socket.IO')
      const { userId, guildId } = socket.handshake.query

      // Vérifier que l'utilisateur appartient au bon serveur Discord
      if (guildId !== process.env.NEXT_PUBLIC_DISCORD_GUILD_ID) {
        console.log('Connexion refusée: mauvais serveur Discord')
        socket.disconnect()
        return
      }

      // Ajouter le participant à la liste
      participants.set(socket.id, {
        id: userId,
        socketId: socket.id
      })

      console.log('Participant ajouté:', userId)

      // Envoyer la liste mise à jour à tous les clients
      io?.emit('participants:update', Array.from(participants.values()))

      // Gérer la déconnexion
      socket.on('disconnect', () => {
        console.log('Déconnexion:', userId)
        participants.delete(socket.id)
        io?.emit('participants:update', Array.from(participants.values()))
      })
    })
  }

  return new Response('Socket.IO server initialized', { status: 200 })
} 
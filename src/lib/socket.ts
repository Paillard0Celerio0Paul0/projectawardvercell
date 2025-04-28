import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initializeSocket = (userId: string, guildId: string) => {
  if (!socket) {
    socket = io({
      path: '/api/socket/io',
      addTrailingSlash: false,
      query: {
        userId,
        guildId
      }
    })
  }
  return socket
}

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized')
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
} 
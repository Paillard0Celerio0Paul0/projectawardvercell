'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { io } from 'socket.io-client'

export default function SocketTest() {
  const { data: session, status } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return

    const socket = io({
      path: '/api/socket/io',
      addTrailingSlash: false,
      query: {
        userId: session.user.id,
        guildId: process.env.NEXT_PUBLIC_DISCORD_GUILD_ID
      }
    })

    socket.on('connect', () => {
      console.log('Connecté au serveur Socket.IO')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Déconnecté du serveur Socket.IO')
      setIsConnected(false)
    })

    socket.on('participants:update', (updatedParticipants) => {
      console.log('Participants mis à jour:', updatedParticipants)
      setParticipants(updatedParticipants)
    })

    return () => {
      socket.disconnect()
    }
  }, [status, session])

  if (status !== 'authenticated') {
    return (
      <div className="p-4">
        <p className="text-red-500">Veuillez vous connecter pour voir les participants.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Participants connectés à la salle de vote</h2>
      <div className="mb-4">
        <p>État de la connexion: {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}</p>
      </div>
      <div>
        <h3 className="font-bold mb-2">Liste des participants:</h3>
        {participants.length === 0 ? (
          <p className="text-gray-500">Aucun participant connecté pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {participants.map((participant) => (
              <li key={participant.id} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>{participant.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 
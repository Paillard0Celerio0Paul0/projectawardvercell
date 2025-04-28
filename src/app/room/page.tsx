'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import UserProfile from '@/components/UserProfile'
import ParticipantsList from '@/components/ParticipantsList'
import { io } from 'socket.io-client'

interface Participant {
  id: string
  name: string
  image: string
  isCurrentUser?: boolean
}

export default function RoomPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (!session?.user?.id) return

    console.log('Tentative de connexion Socket.IO...')
    const socket = io('http://localhost:3001', {
      path: '/api/socket/io',
      addTrailingSlash: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      query: {
        userId: session.user.id,
        guildId: process.env.NEXT_PUBLIC_DISCORD_GUILD_ID,
        name: session.user.name,
        image: session.user.image
      }
    })

    socket.on('connect', () => {
      console.log('Connected to socket server')
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    socket.on('participants:update', (updatedParticipants: Participant[]) => {
      console.log('Participants updated:', updatedParticipants)
      const participantsWithCurrentUser = updatedParticipants.map((participant: Participant) => ({
        ...participant,
        isCurrentUser: participant.id === session.user.id
      }))
      setParticipants(participantsWithCurrentUser)
    })

    return () => {
      console.log('Déconnexion du socket...')
      socket.disconnect()
    }
  }, [session])

  if (status === 'loading') {
    return <div>Chargement...</div>
  }

  return (
    <main className="min-h-screen relative">
      <UserProfile />
      
      <div className="absolute top-0 left-0 w-[15vw] min-w-[200px] h-full p-4">
        <ParticipantsList 
          participants={participants}
        />
      </div>

      <div className="ml-[15vw] min-h-screen flex flex-col">
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <h1 className="text-2xl">ROOM GORKI AWARDS 2025</h1>
        </div>
        <div className="flex-1 p-8 mt-20">
          {/* Contenu principal de la room */}
        </div>
      </div>
    </main>
  )
} 
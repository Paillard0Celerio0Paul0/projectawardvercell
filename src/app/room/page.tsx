'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import UserProfile from '@/components/UserProfile'
import ParticipantsList from '@/components/ParticipantsList'
import { io } from 'socket.io-client'

export default function RoomPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [socket, setSocket] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (!session?.user?.id) return

    const newSocket = io({
      path: '/api/socket/io',
      addTrailingSlash: false,
      query: {
        userId: session.user.id,
        guildId: process.env.NEXT_PUBLIC_DISCORD_GUILD_ID
      }
    })

    newSocket.on('connect', () => {
      console.log('Connected to socket server')
    })

    newSocket.on('participants:update', (updatedParticipants) => {
      setParticipants(updatedParticipants)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
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
          participants={[
            {
              id: session?.user?.id || '',
              name: session?.user?.name || '',
              image: session?.user?.image || '',
              isCurrentUser: true
            },
            ...participants
          ]} 
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
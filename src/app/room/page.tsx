'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import UserProfile from '@/components/UserProfile'
import ParticipantsList from '@/components/ParticipantsList'
import { io } from 'socket.io-client'
import SocketTest from '@/components/SocketTest'

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
    if (!session?.user) return

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
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
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Salle de vote</h1>
        <SocketTest />
      </div>
    </main>
  )
} 
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import UserProfile from '@/components/UserProfile'
import ParticipantsList from '@/components/ParticipantsList'
import { pusherClient } from '@/lib/pusher'

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
  const [connectionStatus, setConnectionStatus] = useState<string>('connecting')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (!session?.user?.id || !pusherClient) return

    // Vérification des variables d'environnement
    console.log('Vérification des variables d\'environnement:')
    console.log('NEXT_PUBLIC_PUSHER_KEY:', process.env.NEXT_PUBLIC_PUSHER_KEY)
    console.log('NEXT_PUBLIC_PUSHER_CLUSTER:', process.env.NEXT_PUBLIC_PUSHER_CLUSTER)
    console.log('NEXT_PUBLIC_DISCORD_GUILD_ID:', process.env.NEXT_PUBLIC_DISCORD_GUILD_ID)

    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.error('Variables d\'environnement Pusher manquantes')
      setConnectionStatus('error')
      return
    }

    console.log('Initialisation de Pusher...')
    const channel = pusherClient.subscribe('gorki-awards-2025')

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Abonnement Pusher réussi')
      setConnectionStatus('connected')
    })

    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('Erreur d\'abonnement Pusher:', error)
      setConnectionStatus('error')
    })

    channel.bind('participants:update', (updatedParticipants: Participant[]) => {
      console.log('Participants mis à jour:', updatedParticipants)
      const participantsWithCurrentUser = updatedParticipants.map((participant: Participant) => ({
        ...participant,
        isCurrentUser: participant.id === session.user.id
      }))
      setParticipants(participantsWithCurrentUser)
    })

    // Envoyer les informations de l'utilisateur au serveur
    console.log('Envoi des informations utilisateur...')
    fetch('/api/socket/io', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.user.id,
        guildId: process.env.NEXT_PUBLIC_DISCORD_GUILD_ID,
        name: session.user.name,
        image: session.user.image
      }),
    }).then(response => {
      console.log('Réponse du serveur:', response.status)
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des informations')
      }
    }).catch(error => {
      console.error('Erreur:', error)
    })

    return () => {
      console.log('Nettoyage de la connexion Pusher...')
      // Supprimer l'utilisateur de la liste des participants
      fetch('/api/socket/io', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id
        }),
      })
      if (pusherClient) {
        pusherClient.unsubscribe('gorki-awards-2025')
      }
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
          <p className="text-sm text-gray-500">Statut de connexion: {connectionStatus}</p>
        </div>
        <div className="flex-1 p-8 mt-20">
          {/* Contenu principal de la room */}
        </div>
      </div>
    </main>
  )
} 
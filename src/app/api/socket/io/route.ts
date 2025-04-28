import { NextRequest } from 'next/server'
import { pusherServer } from '@/lib/pusher'

const ROOM_ID = 'gorki-awards-2025'
const participants = new Map()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { userId, guildId, name, image } = await req.json()

    // Vérifier que l'utilisateur appartient au bon serveur Discord
    if (guildId !== process.env.NEXT_PUBLIC_DISCORD_GUILD_ID) {
      return new Response('Mauvais serveur Discord', { status: 403 })
    }

    // Vérifier si l'utilisateur est déjà dans la liste
    const existingParticipant = Array.from(participants.values()).find(p => p.id === userId)
    if (existingParticipant) {
      return new Response('Utilisateur déjà connecté', { status: 200 })
    }

    // Ajouter le participant à la liste
    participants.set(userId, {
      id: userId,
      name,
      image
    })

    console.log('Nouveau participant:', userId)
    console.log('Nombre total de participants:', participants.size)

    // Envoyer la liste mise à jour à tous les clients
    await pusherServer?.trigger(ROOM_ID, 'participants:update', Array.from(participants.values()))

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Error handling socket connection:', error)
    return new Response('Error handling socket connection', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json()

    // Supprimer le participant de la liste
    participants.delete(userId)

    console.log('Participant déconnecté:', userId)
    console.log('Nombre total de participants:', participants.size)

    // Envoyer la liste mise à jour à tous les clients
    await pusherServer?.trigger(ROOM_ID, 'participants:update', Array.from(participants.values()))

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Error handling socket disconnection:', error)
    return new Response('Error handling socket disconnection', { status: 500 })
  }
} 
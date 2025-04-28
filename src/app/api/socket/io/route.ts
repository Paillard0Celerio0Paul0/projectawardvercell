import { NextRequest } from 'next/server'
import { pusherServer } from '@/lib/pusher'

const ROOM_ID = 'gorki-awards-2025'
const participants = new Map()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { userId, guildId, name, image, socketId } = await req.json()

    // Vérifier que l'utilisateur appartient au bon serveur Discord
    if (guildId !== process.env.NEXT_PUBLIC_DISCORD_GUILD_ID) {
      return new Response('Mauvais serveur Discord', { status: 403 })
    }

    // Ajouter le participant à la liste
    participants.set(socketId, {
      id: userId,
      socketId,
      name,
      image
    })

    // Envoyer la liste mise à jour à tous les clients
    await pusherServer.trigger(ROOM_ID, 'participants:update', Array.from(participants.values()))

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Error handling socket connection:', error)
    return new Response('Error handling socket connection', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { socketId } = await req.json()

    // Supprimer le participant de la liste
    participants.delete(socketId)

    // Envoyer la liste mise à jour à tous les clients
    await pusherServer.trigger(ROOM_ID, 'participants:update', Array.from(participants.values()))

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Error handling socket disconnection:', error)
    return new Response('Error handling socket disconnection', { status: 500 })
  }
} 
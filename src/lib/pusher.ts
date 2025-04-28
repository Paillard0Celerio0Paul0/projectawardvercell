import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Configuration côté client
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
    throw new Error('NEXT_PUBLIC_PUSHER_KEY is not defined')
  }

  if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
    throw new Error('NEXT_PUBLIC_PUSHER_CLUSTER is not defined')
  }
}

// Configuration côté serveur
if (typeof window === 'undefined') {
  if (!process.env.PUSHER_APP_ID) {
    throw new Error('PUSHER_APP_ID is not defined')
  }

  if (!process.env.PUSHER_SECRET) {
    throw new Error('PUSHER_SECRET is not defined')
  }
}

export const pusherServer = typeof window === 'undefined' ? new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true
}) : null

export const pusherClient = typeof window !== 'undefined' ? new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    forceTLS: true
  }
) : null 
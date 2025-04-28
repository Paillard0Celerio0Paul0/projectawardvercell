'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function UserProfile() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <div className="fixed top-4 right-4 flex items-center gap-4">
      {session.user.image && (
        <Image
          src={session.user.image}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      <span className="text-sm font-medium">{session.user.name}</span>
      <button
        onClick={() => signOut()}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all duration-300 shadow hover:shadow-md cursor-pointer text-sm"
      >
        Se déconnecter
      </button>
    </div>
  )
} 
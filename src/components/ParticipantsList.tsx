'use client'

import Image from 'next/image'

interface Participant {
  id: string
  name: string
  image: string
  isCurrentUser?: boolean
}

interface ParticipantsListProps {
  participants: Participant[]
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <div className="h-full bg-gray-800/50 rounded-lg p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Participants ({participants.length})</h2>
      <div className="space-y-3">
        {participants.map((participant) => (
          <div 
            key={participant.id} 
            className={`flex items-center gap-3 p-2 rounded-lg ${
              participant.isCurrentUser ? 'bg-blue-500/20' : ''
            }`}
          >
            {participant.image && (
              <Image
                src={participant.image}
                alt={participant.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="text-sm">
              {participant.name}
              {participant.isCurrentUser && ' (Vous)'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 
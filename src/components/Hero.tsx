'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleLogin = () => {
    router.push('/api/auth/signin/discord')
  }

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                Nouveau
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <span>Projet Award 2024</span>
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Votez pour vos projets préférés
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Participez à la sélection des meilleurs projets de l&apos;année. Votre voix compte !
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            {status === 'unauthenticated' && (
              <Button
                onClick={handleLogin}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                SE CONNECTER AVEC DISCORD
              </Button>
            )}
            {status === 'authenticated' && (
              <Button
                onClick={() => router.push('/vote')}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                ACCÉDER AU VOTE
              </Button>
            )}
            <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
              En savoir plus <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 
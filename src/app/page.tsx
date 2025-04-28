'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSession, signIn } from 'next-auth/react'
import UserProfile from '@/components/UserProfile'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 relative">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        {/* Suppression du titre en haut à gauche */}
      </div>

      <div className="relative flex flex-col items-center gap-8 z-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl text-center leading-tight tracking-wider"
        >
          GORKI<br />AWARDS<br />2025
        </motion.h1>
        
        {!session ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-30"
          >
            <button
              onClick={() => signIn('discord')}
              className="group flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-lg transition-all duration-300 w-fit shadow-lg hover:shadow-xl cursor-pointer relative z-40 text-xs"
            >
              <Image
                src="/discord-logo.svg"
                alt="Discord Logo"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="whitespace-nowrap">
                SE CONNECTER AVEC DISCORD
              </span>
            </button>
          </motion.div>
        ) : (
          <>
            <UserProfile />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                href="/room"
                className="group flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300 w-fit shadow-lg hover:shadow-xl cursor-pointer text-xs"
              >
                <span className="whitespace-nowrap">
                  REJOINDRE LA ROOM
                </span>
              </Link>
            </motion.div>
          </>
        )}
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left">
        {/* Espace réservé pour le fond */}
      </div>
    </main>
  )
}

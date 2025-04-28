import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gorki Awards 2025',
  description: 'Gorki Awards 2025 - Cérémonie des récompenses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${pressStart2P.className} min-h-screen relative`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

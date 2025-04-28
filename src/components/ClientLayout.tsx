'use client'

import Background from '@/components/Background'
import Providers from '@/components/Providers'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Background />
      {children}
    </Providers>
  )
} 
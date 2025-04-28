import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

interface DiscordProfile {
  id: string
  username: string
  email: string
  image_url: string
}

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = (profile as DiscordProfile).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.accessToken = token.accessToken as string
      }
      return session
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'discord') {
        // Vérifier que l'utilisateur appartient au bon serveur Discord
        const guildId = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID
        if (!guildId) return false

        try {
          const response = await fetch(`https://discord.com/api/users/@me/guilds`, {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          })
          const guilds = await response.json()
          return guilds.some((guild: any) => guild.id === guildId)
        } catch (error) {
          console.error('Erreur lors de la vérification du serveur Discord:', error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }

// Extension du type Session pour inclure l'ID et le token d'accès
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      accessToken: string
    }
  }
} 
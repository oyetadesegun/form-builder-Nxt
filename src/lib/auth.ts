import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcrypt"

export const authOptions: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        login: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<any> => {
        if (!credentials?.login || !credentials?.password) return null

        try {
          // Find user by email OR username
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.login as string },
                { username: credentials.login as string },
              ],
            },
          })

          if (!user) return null

          const passwordValid = await compare(
            credentials.password as string,
            user.password
          )

          if (!passwordValid) return null

          // ✅ Return user fields we want in the token/session
          return {
            id: user.id.toString(),
            email: user.email,
            username: user.username,
            names: user.names,
            phone: user.phone,
            role: user.role, // ✅ include role
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.names = user.names
        token.phone = user.phone
        token.role = user.role // ✅ capture role in JWT
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.names = token.names as string
        session.user.phone = token.phone as string
        session.user.role = token.role as string // ✅ attach role to session
      }

      return session
    },
  },

  pages: {
    signIn: "/sign-in",
    newUser: "/welcome",
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)

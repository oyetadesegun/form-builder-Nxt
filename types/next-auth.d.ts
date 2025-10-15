import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      names: string
      phone: string
      role: string // ✅ add role type
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    email: string
    username: string
    names: string
    phone: string
    role: string // ✅ include here
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    names: string
    phone: string
    role: string
  }
}

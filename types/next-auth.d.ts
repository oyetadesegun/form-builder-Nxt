import "next-auth"
import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      names: string
      phone: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username: string
    names: string
    phone: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    names: string
    phone: string
  }
}
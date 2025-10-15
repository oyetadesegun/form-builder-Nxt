"use client"

import Link from "next/link"
import { Button, buttonVariants } from "./ui/button"
import { HandMetal } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import Logo from "./Logo"


export default function Navbar() {
  const { data: session } = useSession()

  return (
    <div className="bg-zinc-100 py-2 border-b border-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between">
             <Logo/>
        {session?.user ? (
          <Button onClick={() => signOut({
            redirect: true,
            redirectTo:`${window.location.origin}/sign-in`
          })}>Sign out</Button>
        ) : (
          <Link className={buttonVariants()} href="/sign-in">
            Sign in
          </Link>
        )}
      </div>
    </div>
  )
}

'use client'

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User as UserIcon, UserCircle } from "lucide-react"
import { capitalize } from "@/lib/format"

interface UserButtonProps {
  afterSignOutUrl?: string
}

export default function UserButton({ afterSignOutUrl = "/" }: UserButtonProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const user = session?.user

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Avatar (from shadcn/ui) */}
      <Avatar className="h-9 w-9 cursor-pointer ring-1 ring-transparent hover:ring-blue-500/40 transition">
        {user?.image ? (
          <AvatarImage src={user.image} alt={user.name || "User"} />
        ) : (
          <AvatarFallback>
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : <UserIcon className="w-4 h-4 text-gray-500" />}
          </AvatarFallback>
        )}
      </Avatar>

      {/* Hover Popup */}
      <AnimatePresence>
        {open && user && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 shadow-xl rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700 text-sm">
              <p className="font-medium">{user.names}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-500">
                {capitalize(user?.role) ?? "No role"}
              </p>

            </div>

            <div className="flex flex-col p-1">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
              >
                <UserCircle className="w-4 h-4" /> Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: afterSignOutUrl })}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

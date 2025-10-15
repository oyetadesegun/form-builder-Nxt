import { auth } from "@/lib/auth"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session?.user) {
    return <div>Please log in</div>
  }

  return <div>Welcome to {session.user.username}</div>
}

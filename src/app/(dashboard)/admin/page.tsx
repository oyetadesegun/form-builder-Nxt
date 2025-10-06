import React from 'react'
import getServerSession from "next-auth"
import { authOptions } from '@/lib/auth'

const AdminDashboard = async() => {
    const session = await getServerSession(authOptions)
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard
import { Spinner } from '@/components/ui/spinner'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex items-center justify-center w-full h-full'><Spinner className='animate-spin h-12 w-12'/></div>
  )
}

export default Loading
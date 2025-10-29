import React from 'react'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

const PublishFormBtn = () => {
  return (
    <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
        <Send className='h-4 w-4'/>
        Publish
    </Button>
  )
}

export default PublishFormBtn
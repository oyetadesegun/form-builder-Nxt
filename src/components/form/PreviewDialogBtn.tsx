import React from 'react'
import { Button } from '../ui/button'
import { LucideView } from 'lucide-react'

const PreviewDialogBtn = () => {
  return (
    <Button variant={"outline"} className='gap-2'>
        <LucideView className='h-4 w-4'/>
        Preview</Button>
  )
}

export default PreviewDialogBtn
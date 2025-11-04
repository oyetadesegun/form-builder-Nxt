import React, { useTransition } from 'react'
import { Button } from '../ui/button'
import { Save } from 'lucide-react'
import useDesigner from './hooks/useDesigner'
import { UpdateFormContent } from '@/actions/form'
import { toast } from 'sonner'
import {FaSpinner} from 'react-icons/fa'

const SaveFormBtn = ({id, name, agentPrice, userPrice}:{id: number, name: string, agentPrice: number, userPrice: number}) => {
  const {elements} = useDesigner()
  const [loading, startTransition] = useTransition()

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, name, agentPrice, userPrice, jsonElements)
        toast("Success", {
              description: "Your form has been saved"
            })
    } catch (error) {
      toast("Error", {
              description: "Something went wrong",
            })
    }
  }
  return (
    <Button variant={'outline'} className='gap-2' disabled={loading} onClick={() => {
      startTransition(updateFormContent)
    }}>
        <Save className='h-4 w-4'/>
        Save
        {loading && <FaSpinner className='animate-spin'/>}
    </Button>
  )
}

export default SaveFormBtn
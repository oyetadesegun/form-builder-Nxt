import React, { useTransition } from 'react'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
 } from '../ui/alert-dialog'
 import { toast } from 'sonner'
import { FaIcons } from 'react-icons/fa'
import { PublishForm } from '@/actions/form'
import {useRouter} from 'next/navigation'

const PublishFormBtn = ({id}:{id: number}) => {
  const [loading, startTransition] = useTransition()
const router = useRouter()
  async function publishForm(){
    try {
      await PublishForm(id)
       toast("Success", {
                    description: "Your form has been Published"
                  })
                  router.refresh()
    } catch (error) {
      toast("Error", {
                    description: "Something went wrong",
                  })
    }
  }
  return (<AlertDialog>
    
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
            <Send className='h-4 w-4'/>
            Publish
        </Button>
        
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
          This action cnnot be undone. After publishing you will not be able to edit this form. <br/> <br/>
          <span className='font-medium'>
            By publishing the form you will make it available yto the public and you will be able to collect submissions.
          </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={e =>{
            e.preventDefault();
            startTransition(publishForm);
          }}>Proceed {loading && <FaIcons className='animate-spin'/>}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
  </AlertDialog>
  )
}

export default PublishFormBtn
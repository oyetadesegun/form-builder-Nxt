import { GetFormById } from "@/actions/form"
import FormBuilder from "@/components/form/FormBuilder"

 export default async function BuilderPage({ params }: {
    params: {
        id: string
    }
}) {
    const {id} = await params
const form = await GetFormById(parseInt(id))
if(!form)
    throw new Error("form not found")
    return <FormBuilder form={form}/>
}
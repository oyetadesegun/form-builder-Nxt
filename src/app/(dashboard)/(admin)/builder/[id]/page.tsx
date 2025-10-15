import { GetFormById } from "@/actions/form"

export async  function FormBuilder({ params }: {
    params: {
        id: string
    }
}) {
    const {id} = params
const form = await GetFormById(Number(id))
    return <></>
}
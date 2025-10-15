import z from "zod"

export const formSchema = z.object({
  name: z.string().min(4, { message: "Form name must be at least 4 characters." }),
  description: z.string().max(200, { message: "Description must be under 200 characters." }).optional(),
  agentPrice: z
    .number({ invalid_type_error: "Agent price must be a number." })
    .min(0, { message: "Agent price cannot be negative." }),
  userPrice: z
    .number({ invalid_type_error: "User price must be a number." })
    .min(0, { message: "User price cannot be negative." }),
})

export type FormSchemaType = z.infer<typeof formSchema>
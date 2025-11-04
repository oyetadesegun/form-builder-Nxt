"use client"

import {
  Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger, DialogFooter,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Spinner } from "../ui/spinner"
import { toast } from "sonner"
import { formSchema, FormSchemaType } from "@/schema/form"
import { CreateForm } from "@/actions/form"
import { useState } from "react"
import { FilePlus } from "lucide-react"
import {useRouter} from "next/navigation";

//
// ✅ 2️⃣ Component
//
const CreateFormBtn = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      agentPrice: 0,
      userPrice: 0,
    },
  })

  async function onSubmit(values: FormSchemaType) {
    try {
      const formId = await CreateForm(values)
      toast("Success", {
        description: "Form created successfully"
      })
      form.reset()
      setOpen(false)
      router.push(`/builder/${formId}`)           
    } catch (error) {
      toast("Error", {
        description: "Something went wrong, please try again later.",
      })

    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4 bg-background"><FilePlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Create new form</p></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>
            Create a new form to start collecting responses.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter form name" {...field} />
                  </FormControl>
                  <FormMessage /> {/* ✅ Shows error under input */}
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Describe the purpose of this form (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prices */}
            <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="agentPrice"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Agent Price</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userPrice"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>User Price</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <DialogFooter>
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={form.formState.isSubmitting}
              >
                {!form.formState.isSubmitting ? (
                  <span>Save</span>
                ) : (
                  <Spinner className="animate-spin" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormBtn

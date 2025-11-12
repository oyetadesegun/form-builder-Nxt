"use client"

import React, { useEffect, useState } from "react"
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements"
import { IoMdCheckbox } from "react-icons/io"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useDesigner from "../hooks/useDesigner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
const type: ElementsType = "CheckboxField"
const extraAttributes = {
    label: "Checkbox field",
    helperText: "",
    required: false
}
const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false)

});
export const CheckboxFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: IoMdCheckbox,
        label: "Checkbox Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (formElement: FormElementInstance, currentValue: string): boolean => {
        const element = formElement as CustomInstance;
        if(element.extraAttributes.required){
            return currentValue !== "true"
        }
        return true;
    }
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function FormComponent({ elementInstance, submitValue, isInvalid, defaultValue }: { elementInstance: FormElementInstance, submitValue?: SubmitFunction, isInvalid?: boolean, defaultValue?: string }) {
    const element = elementInstance as CustomInstance;
    const [value, setValue] = useState<boolean>( defaultValue==="true" ? true:false)
    const [error, setError] = useState(false)

    useEffect(()=>{
        setError(isInvalid=== true)
    },[isInvalid])
    const { label, required, placeHolder, helperText } = element.extraAttributes;

    return <div className="flex flex-col gap-2 w-full">
        <Label className={cn(error && "text-red-500")}>{label}
            {required && "*"}
        </Label>
        <Input className={cn(error && "border-red-500")} placeholder={placeHolder} onChange={e => setValue(e.target.value)}
            onBlur={(e) => {
                if (!submitValue) return;
                const valid = CheckboxFieldFormElement.validate(element, e.target.value)
                setError(!valid)
                if(!valid) return;
                submitValue(element.id, e.target.value);
            }}
            value={value} />
        {helperText && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>}
    </div>

}
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance;
    const { label, required,  helperText } = element.extraAttributes;

    const id = `checkbox-${element.id}`
    return <div className="flex items-top space-x-2">
        <Checkbox id={id}/>
        <div className="grid gap-1.5 leading-none">
            <Label htmlFor={id}>{label}
                {required && "*"}
            </Label>
            {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
        </div>
    </div>

}
function PropertiesComponent({
    elementInstance
}: {
    elementInstance: FormElementInstance

}) {
    const element = elementInstance as CustomInstance;
    const { updateElement } = useDesigner();
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
            placeHolder: element.extraAttributes.placeHolder
        }
    })
    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form]);
    function applyChanges(values: propertiesFormSchemaType) {
        const { label, helperText, placeHolder, required } = values
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                helperText,
                placeHolder,
                required,

            }
        })
    }
    return <Form {...form}>
        <form onBlur={form.handleSubmit(applyChanges)} onSubmit={(e) => {
            e.preventDefault();
        }} className="space-y-3">
            <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Label
                        </FormLabel>
                        <FormControl>
                            <Input {...field} onKeyDown={e => {
                                if (e.key === "Enter") e.currentTarget.blur()
                            }} />
                        </FormControl>
                        <FormDescription>
                            The label of the field.<br /> It will be displayed above the field
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="placeHolder"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            PlaceHolder
                        </FormLabel>
                        <FormControl>
                            <Input {...field} onKeyDown={e => {
                                if (e.key === "Enter") e.currentTarget.blur()
                            }} />
                        </FormControl>
                        <FormDescription>
                            The placeholder of the field.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="helperText"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Helper Text
                        </FormLabel>
                        <FormControl>
                            <Input {...field} onKeyDown={e => {
                                if (e.key === "Enter") e.currentTarget.blur()
                            }} />
                        </FormControl>
                        <FormDescription>
                            The helpertext of the field.<br /> It will be displayed below the field
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>
                                required
                            </FormLabel>

                            <FormDescription>
                                The required of the field.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
        </form>
    </Form>
}
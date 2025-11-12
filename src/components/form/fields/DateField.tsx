"use client"

import React, { useEffect, useState } from "react"
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useDesigner from "../hooks/useDesigner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { BsFillCalendarDateFill } from "react-icons/bs"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
const type: ElementsType = "DateField"
const extraAttributes = {
    label: "Date field",
    helperText: "Pick a date",
    required: false,
}
const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),

});
export const DateFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: BsFillCalendarDateFill,
        label: "Date Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (formElement: FormElementInstance, currentValue: string): boolean => {
        const element = formElement as CustomInstance;
        if (element.extraAttributes.required) {
            return currentValue.length > 0;
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
    const [date, setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined)
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])
    const { label, required, placeHolder, helperText } = element.extraAttributes;

    return <div className="flex flex-col gap-2 w-full">
        <Label className={cn(error && "text-red-500")}>{label}
            {required && "*"}
        </Label>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    error && "border-red-500")}>
                    <CalendarIcon className="mr-2 h-4 w-4 " />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
  <div className="flex items-center justify-between mb-2">
    {/* Month selector */}
    <select
      value={date ? date.getMonth() : new Date().getMonth()}
      onChange={(e) => {
        const newDate = new Date(
          date?.getFullYear() ?? new Date().getFullYear(),
          Number(e.target.value),
          date?.getDate() ?? 1
        );
        setDate(newDate);
      }}
      className="border rounded-md px-2 py-1 text-sm"
    >
      {[
        "January","February","March","April","May","June",
        "July","August","September","October","November","December",
      ].map((m, i) => (
        <option key={i} value={i}>{m}</option>
      ))}
    </select>

    {/* Year input for fast navigation */}
    <input
      type="number"
      placeholder="Year"
      value={date ? date.getFullYear() : ""}
      onChange={(e) => {
        const year = Number(e.target.value);
        if (year > 1900 && year <= new Date().getFullYear()) {
          const newDate = new Date(year, date?.getMonth() ?? 0, date?.getDate() ?? 1);
          setDate(newDate);
        }
      }}
      className="w-20 border rounded-md px-2 py-1 text-sm text-center"
    />
  </div>

  {/* Calendar grid itself */}
  <Calendar
    mode="single"
    selected={date}
    onSelect={(date) => {
      setDate(date);
      if (!submitValue) return;
      const value = date?.toISOString() || "";
      const valid = DateFieldFormElement.validate(element, value);
      setError(!valid);
      submitValue(element.id, value);
    }}
    month={date}
    onMonthChange={(m) => setDate(m)}
    captionLayout="dropdown" // this helps for keyboard month nav
    fromYear={1900}
    toYear={new Date().getFullYear()}
    initialFocus
  />
</PopoverContent>

        </Popover>
        {helperText && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>}
    </div>

}
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance;
    const { label, required, placeHolder, helperText } = element.extraAttributes;
    return <div className="flex flex-col gap-2 w-full">
        <Label>{label}
            {required && "*"}
        </Label>
        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4 " />
            <span>Pick a date</span>
        </Button>
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
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
        }
    })
    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form]);
    function applyChanges(values: propertiesFormSchemaType) {
        const { label, helperText, required } = values
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                helperText,
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
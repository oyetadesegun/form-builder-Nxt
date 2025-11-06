"use client"

import React, { useEffect, useState } from "react"
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements"
import { RiSeparator } from "react-icons/ri"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useDesigner from "../hooks/useDesigner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
const type: ElementsType = "SeparatorField"

export const SeparatorFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type
    }),
    designerBtnElement: {
        icon: RiSeparator,
        label: "Separator field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: () => true
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    return <div className="flex flex-col gap-2 w-full">
        <Label className="text-muted-foreground">Separator field
            <Separator/>
        </Label>
    </div>

}
function FormComponent({ elementInstance }: { elementInstance: FormElementInstance}) {

    return <Separator/>

}

function PropertiesComponent({
    elementInstance
}: {
    elementInstance: FormElementInstance

}) {
    return <p>No properties for this element</p>
}
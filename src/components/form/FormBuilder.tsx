"use client"
import { Form } from "@prisma/client";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import DragOverlayWrapper from './DragOverlayWrapper';
import { DndContext } from "@dnd-kit/core";

export default  function FormBuilder({form}:{form:Form}){
return <DndContext>
<main className="flex flex-col w-full">
<nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
    <h2 className="truncate font-medium">
        <span className="flex items-center gap-2">Form name: {form.name}</span>
    </h2>
    <div className="flex items-center gap-2">
        <PreviewDialogBtn/>
        {!form.published && (
            <>
            <SaveFormBtn/>
            <PublishFormBtn/>
            </>
        )}
    </div>
</nav>
<div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-screen bg-accent bg-[url(/jupiter.svg)] dark:bg-[url(/jupiter-dark.svg)]">
<Designer/>
</div>
</main >
<DragOverlayWrapper/>
</DndContext>
}
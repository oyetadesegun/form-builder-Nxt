"use client"
import { Form } from "@prisma/client";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import DragOverlayWrapper from './DragOverlayWrapper';
import { DndContext, MouseSensor, useSensors, TouchSensor, useSensor } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import useDesigner from "./hooks/useDesigner";
import {ImSpinner2} from "react-icons/im"
import { Button } from "../ui/button";
import {toast} from 'sonner'
import Link from "next/link";
import {BsArrowLeft, BsArrowRight} from "react-icons/bs"
import Confetti from 'react-confetti'
export default  function FormBuilder({form}:{form:Form}){
    const {setElements} = useDesigner();
    const [isReady, setIsReady] = useState(false)
    const [formName, setFormName] = useState(form.name)
    const [agentPrice, setAgentPrice] = useState(form.agentPrice || 0)
    const [userPrice, setUserPrice] = useState(form.userPrice || 0)
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint:{
            distance: 10,

        }
    })
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint:{
            delay: 300,
            tolerance:5,
        }
    })
    const sensors = useSensors(mouseSensor, touchSensor)
     useEffect(() => {
    if (isReady) return;

    try {
      const elements = JSON.parse(form.content);
      setElements(elements);
    } catch (error) {
      console.error("Invalid JSON in form.content:", error);
    }

    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout);
  }, [form, setElements, isReady]);
    if (!isReady){
        <div className="flex flex-col items-center justify-center w-full h-full">
            <ImSpinner2 className="animate-spin h-12 w-12 "/>
        </div>
    }
    const shareUrl =`${window.location.origin}/submit/${form.shareURL}`
    if(form.published){
      return (
        <>
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000}/>
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="max-w-md">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
               🎊🎊🎊Form Published🎊🎊🎊
            </h1>
            <h2 className="text-2xl">Share this form</h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              Anyone with the link can view and submit the form
            </h3>
            <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
              <Input className="w-full" readOnly value={shareUrl}/>
              <Button className="mt-2 w-full" onClick={()=>{
                navigator.clipboard.writeText(shareUrl);
              toast("Copied!", {
              description: "Link copied to clipboard"
            })
              }}>Copy link</Button>
            </div>
            <div className="flex justify-between">
              <Button variant={"link"} asChild>
                <Link href={"/admin"} className="gap-2">
                <BsArrowLeft/>
                Go back Home
                </Link>
              </Button>
              <Button variant={"link"} asChild>
                <Link href={`/forms/${form.id}`} className="gap-2">
                Form Details
                <BsArrowRight/>
                </Link>
              </Button>
            </div>
          </div>

        </div>
        </>
      )
    }
return <DndContext sensors={sensors}>
<main className="flex flex-col w-full">
<nav className="flex justify-between border-b-2 p-4 gap-3 items-center flex-wrap">
    <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Form name:</span>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full"
            />
            <p>Agent Price:</p>
            <Input
              value={agentPrice}
              onChange={(e) => setAgentPrice(Number(e.target.value))}
              placeholder="Agent price"
              className="w-28"
            />
            <p>User Price:</p>
            <Input
              value={userPrice}
              onChange={(e) => setUserPrice(Number(e.target.value))}
              placeholder="User price"
              className="w-28"
            />
    </div>
    <div className="flex items-center gap-2">
        <PreviewDialogBtn/>
        {!form.published && (
            <>
            <SaveFormBtn
  id={form.id}
  name={formName}
  agentPrice={agentPrice}
  userPrice={userPrice}
/>

            <PublishFormBtn id={form.id}/>
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
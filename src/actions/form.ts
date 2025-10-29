"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formSchema, FormSchemaType } from "@/schema/form"

//
// 🔹 Helper to ensure the user is authenticated
//
async function checkUser() {
  const session = await auth()
  if (!session?.user) {
    throw new Error("User not authenticated")
  }
  return session.user
}
export async function GetForms(){
    const user = await checkUser();
    return await prisma.form.findMany({
        where:{
            userId : parseInt(user.id)
        },
        orderBy:{
            createdAt: "desc"
        }
    })
}
export async function GetFormById(id: number){
   const user = await checkUser()
  return await prisma.form.findUnique({
    where:{id: id}
  })
}
//
// 🔹 Get total number of forms by the authenticated user
//
export async function GetFormCount() {
  const user = await checkUser()
  return prisma.form.count({
    where: { userId: Number(user.id) },
  })
}

//
// 🔹 Get aggregated statistics for the user's forms
//
export async function GetFormStats() {
  const user = await checkUser()

  const stats = await prisma.form.aggregate({
    where: { userId: Number(user.id) },
    _sum: {
      visits: true,
      submissions: true,
      amountGenerated: true,
      paymentCount: true,
      jobDone: true,
    },
  })

  // ✅ Safely handle potential null values from Prisma aggregates
  const sum = stats._sum ?? {}
  const visits = sum.visits ?? 0
  const submissions = sum.submissions ?? 0
  const amountGenerated = sum.amountGenerated ?? 0
  const paymentCount = sum.paymentCount ?? 0
  const jobDone = sum.jobDone ?? 0

  const workRate = jobDone > 0 ? (submissions / jobDone) * 100 : 0
  const jobOutside = paymentCount - submissions

  return { visits, submissions, amountGenerated, paymentCount, jobDone, workRate, jobOutside }
}

//
// 🔹 Create a new form for the authenticated user
//
export async function CreateForm(data: FormSchemaType) {
  const validation = formSchema.safeParse(data)
  if (!validation.success) {
    throw new Error("Form not valid")
  }

  const user = await checkUser()

  const newForm = await prisma.form.create({
    data: {
      name: data.name,
      description: data.description || "",
      agentPrice: data.agentPrice,
      userPrice: data.userPrice,
      userId: Number(user.id),
    },
  })

  console.log(`✅ Form created: ${newForm.name}`)
  return newForm
}

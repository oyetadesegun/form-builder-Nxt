"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formSchema, FormSchemaType } from "@/schema/form"

//
// 🔹 FIXED: Helper to ensure the user is authenticated and exists in DB
//
async function checkUser() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("User not authenticated")
  }

  // Verify user exists in database
  const dbUser = await prisma.user.findUnique({
    where: { 
      email: session.user.email 
    }
  })

  if (!dbUser) {
    throw new Error("User not found in database")
  }

  return dbUser
}

export async function GetForms(){
  const user = await checkUser();
  return await prisma.form.findMany({
    where: {
      userId: user.id // No need to parse, it's already a number
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

export async function GetFormById(id: number){
  const user = await checkUser()
  return await prisma.form.findUnique({
    where: { 
      id: id,
      userId: user.id // Ensure user can only access their own forms
    }
  })
}

export async function GetFormCount() {
  const user = await checkUser()
  return prisma.form.count({
    where: { userId: user.id },
  })
}

export async function GetFormStats() {
  const user = await checkUser()

  const stats = await prisma.form.aggregate({
    where: { userId: user.id },
    _sum: {
      visits: true,
      submissions: true,
      amountGenerated: true,
      paymentCount: true,
      jobDone: true,
    },
  })

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
// 🔹 FIXED: Create form with verified user ID
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
      userId: user.id, // This is now a verified database user ID
    },
  })

  console.log(`✅ Form created: ${newForm.name} for user ${user.id}`)
  return newForm
}

export async function UpdateFormContent(id: number, name: string, agentPrice: number, userPrice: number, jsonContent: string) {
  const user = await checkUser();

  return await prisma.form.update({
    where: {
      userId: user.id,
      id
    },
    data: {
      name: name,
      agentPrice: agentPrice,
      userPrice: userPrice,
      content: jsonContent
    }
  })
}

export async function PublishForm(id: number) {
  const user = await checkUser();

  return await prisma.form.update({
    data: {
      
      published: true,
    },
    where: {
      userId: user.id,
      id
    }
  })
}

export async function GetFormContentByUrl(formUrl: string) {
  const form = await prisma.form.findFirst({
    where: {
      shareURL: formUrl
    }
  });
  
  if (!form) {
    throw new Error("Form not found");
  }
  
  return await prisma.form.update({
    select: {
      content: true
    },
    data: {
      visits: {
        increment: 1
      }
    },
    where: {
      id: form.id
    }
  });
}

export async function SubmitForm(formUrl: string,content:string){
return await prisma.form.update({
  data:{
    submissions: {
      increment: 1
    },
    FormSubmission:{
      create:{
        content
      }
    }
  },
  where:{
    shareURL : formUrl,
    published: true
  }
})
}
export async function GetFormWithSubmissions(id:number){
    const user = await checkUser();
    return prisma.form.findUnique({
      where:{
        id,
        userId: user.id
      },
      include: {
        FormSubmission: true
      }
    })
}
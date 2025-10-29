import { GetFormCount, GetForms, GetFormStats } from "@/actions/form"
import CreateFormBtn from "@/components/form/CreateFormBtn";
import { NgnFn } from "@/components/CurrencyFormatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription,CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@prisma/client";
import { formatDistance } from "date-fns";
import { Book, BookOpenCheck, Users, TicketCheck, User2, Wallet, Pencil, ShoppingCart, CheckCheck,ArrowRight, SquarePen } from "lucide-react";
import Link from "next/link";
import { ReactNode, Suspense } from "react";


export default async function AdminDashboard() {


  return <div className="container pt-4">
    <Suspense fallback={<StatsCards loading={true} />}>
      <CardStatsWrapper />
    </Suspense>
    <Separator className="my-6" />
    <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
    <Separator className="my-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2 auto-rows-[200px]">
      <CreateFormBtn />

      <Suspense fallback={[1, 2, 3, 4].map((el) => (<FormCardSkeleton key={el} />))}>
        <FormCards />
      </Suspense>
    </div>
  </div>
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  const formCount = await GetFormCount();

  return <StatsCards loading={false} data={stats} formCount={formCount} />
}
interface StatsCardsProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  formCount?: Awaited<ReturnType<typeof GetFormCount>>
  loading: boolean
}
function StatsCards(props: StatsCardsProps) {
  const { data, formCount, loading } = props;
  return (
    <div className="w-full pt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="All Forms Created"
        icon={<Book className="text-blue-600" />} helperText="All Forms"
        value={formCount?.toLocaleString() || "0"}
        loading={loading}
        className="shadow-md shadow-blue-600" />

      <StatsCard title="Total Submission"
        icon={<BookOpenCheck className="text-blue-600" />}
        helperText={`submitted out of ${data?.paymentCount.toLocaleString()} forms`}
        value={`${data?.submissions.toLocaleString()}` || ""}
        loading={loading}
        className="shadow-md shadow-blue-600" />

      <StatsCard title="Total Payments"
        icon={<TicketCheck className="text-blue-600" />}
        helperText={`from ${data?.paymentCount.toLocaleString()} paid jobs`}
        value={`${NgnFn(data?.amountGenerated ?? 0)}` || ""}
        loading={loading}
        className="shadow-md shadow-blue-600" />

      <StatsCard title="Total Completed Jobs"
        icon={<TicketCheck className="text-blue-600" />}
        helperText={`out of ${data?.submissions.toLocaleString()} form submitted`}
        value={`${data?.jobDone.toLocaleString()}` || ""}
        loading={loading}
        className="shadow-md shadow-blue-600" />
    </div>
  )
}
interface StatsCardProps {
  title: string,
  icon: ReactNode,
  helperText: string,
  value: string,
  loading: boolean,
  className: string
}
function StatsCard({ icon, title, helperText, value, loading, className }: StatsCardProps) {
  return (<Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {loading && (
          <Skeleton>
            <span className="opacity-0">0</span>
          </Skeleton>
        )}
        {!loading && value}
      </div>
      <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
    </CardContent>
  </Card>

  )
}

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary/20 h-[190px] w-full" />
}

async function FormCards() {
  const forms = await GetForms()
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  )
}

function FormCard({ form }: { form: Form }) {
  return <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 justify-between">
        <span className="truncate font-bold" >{form.name}</span>
        {form.published? <Badge>Published</Badge>:<Badge variant={"destructive"}>Draft</Badge>}
      </CardTitle>
      <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
        {formatDistance(form.createdAt, new Date(), {addSuffix:true})}
        
          <span className="flex items-center gap-2">
            <Users className="text-muted-foreground"/>
            <span>{NgnFn(form.agentPrice)}
               </span>
             <User2 className="text-muted-foreground"/><span>{NgnFn(form.userPrice)} </span>
          </span>
          
      </CardDescription>
    </CardHeader>
    <CardContent className="h-[20px] truncate text-sm  text-muted-foreground">
      {form.description || "No description provided"}
    </CardContent>

    <CardFooter>
<div className="flex w-full items-center justify-between">
      <div className="flex mt-2 gap-1">
<ShoppingCart className="text-muted-foreground"/>
            <span className="text-muted-foreground">{form.paymentCount}
               </span>
        <Wallet className="text-muted-foreground"/>  <span className="text-muted-foreground">{NgnFn(form.amountGenerated)}
               </span> 
               <CheckCheck className="text-muted-foreground"/>  <span className="text-muted-foreground">{form.jobDone}/{form.submissions}
               </span>  
        </div>
  <div>
      {form.published ? <Button asChild className="w-full mt-2 text-md gap-4">
        <Link href={`/forms/${form.id}`}>
        View submissions <ArrowRight/>
        </Link>
      </Button>:<Button variant={"secondary"} asChild className="w-full mt-2 text-md gap-4">
        <Link href={`/builder/${form.id}`}>
        Edit Form <SquarePen/>
        </Link>
      </Button>}
      </div></div>
    </CardFooter>
  </Card>
}
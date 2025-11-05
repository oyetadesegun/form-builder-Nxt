import { GetFormById, GetFormWithSubmissions } from "@/actions/form"
import FormBuilder from "@/components/form/FormBuilder"
import FormLinkShare from "@/components/form/FormLinkShare"
import VisitBtn from "@/components/form/VisitBtn"
import { StatsCard } from "../../admin/page"
import { NgnFn } from "@/components/CurrencyFormatter";
import { Book, BookOpenCheck, Users, TicketCheck, User2, Wallet, Pencil, ShoppingCart, CheckCheck, ArrowRight, SquarePen } from "lucide-react";
import { ElementsType, FormElementInstance } from "@/components/form/FormElements"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistance } from "date-fns"
import { ReactNode } from "react"


export default async function FormDetailPage({ params }: {
    params: {
        id: string
    }
}) {

    const { id } = await params
    const form = await GetFormById(parseInt(id))
    if (!form)
        throw new Error("form not found")
    const { visits, submissions, jobDone, paymentCount, amountGenerated } = form;

    const workRate = jobDone > 0 ? (submissions / jobDone) * 100 : 0
    const jobOutside = paymentCount - submissions

    return <><div className="py-10 border-t border-b border-muted">
        <div className="flex justify-between container">
            <h1 className="text-4xl font-bold truncate">{form.name}</h1>
            <VisitBtn shareUrl={form.shareURL} />
        </div>
    </div>

        <div className="py-4 border-b border-muted">
            <div className="container flex gap-2 items-center justify-between">
                <FormLinkShare shareUrl={form.shareURL} />
            </div>
        </div>
        <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
            <StatsCard title="All Forms Created"
                icon={<Book className="text-blue-600" />} helperText="All Forms"
                value={visits.toLocaleString() || "0"}
                loading={false}
                className="shadow-md shadow-blue-600" />

            <StatsCard title="Total Submission"
                icon={<BookOpenCheck className="text-blue-600" />}
                helperText={`submitted out of ${paymentCount.toLocaleString()} forms`}
                value={`${submissions.toLocaleString()}` || ""}
                loading={false}
                className="shadow-md shadow-blue-600" />

            <StatsCard title="Total Payments"
                icon={<TicketCheck className="text-blue-600" />}
                helperText={`from ${paymentCount.toLocaleString()} paid jobs`}
                value={`${NgnFn(amountGenerated ?? 0)}` || ""}
                loading={false}
                className="shadow-md shadow-blue-600" />

            <StatsCard title="Total Completed Jobs"
                icon={<TicketCheck className="text-blue-600" />}
                helperText={`out of ${submissions.toLocaleString()} form submitted`}
                value={`${jobDone.toLocaleString()}` || ""}
                loading={false}
                className="shadow-md shadow-blue-600" />
        </div>
        <div className="container pt-10">
            <SubmissionsTable id={form.id} />
        </div>
    </>
}

type Row = {[key: string]: string} & {
    submittedAt: Date;
}
async function SubmissionsTable({ id }: { id: number }) {
    const form = await GetFormWithSubmissions(id)
    if (!form) { throw new Error("form not found") }
    const FormElements = JSON.parse(form.content) as FormElementInstance[];
    const columns: {
        id: string;
        label: string;
        required: boolean;
        type: ElementsType
    }[] = [];
    FormElements.forEach(element => {
        switch (element.type) {
            case "TextField":
                columns.push(
                    {
                        id: element.id,
                        label: element.extraAttributes?.label,
                        required: element.extraAttributes?.required,
                        type: element.type
                    }
                );
                break;
                default:
                    break;
        }
    })
    const rows: Row[] =[];
    form.FormSubmission.forEach(submission =>{
        const content = JSON.parse(submission.content)
        rows.push({
            ...content,
            submittedAt:submission.createdAt
        })
    })
    return <>
        <h1 className="text-2xl font-bold my-4">Submissions</h1>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map(column =>(
                            <TableHead key={column.id}>{column.label}</TableHead>
                        ))}
                        <TableHead className="text-muted-foreground text-right uppercase">Submitted at</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                        {
                            rows.map((row, index) =>(
                                <TableRow key={index}>
                                    {columns.map(column =>(
                                        <RowCell key={column.id} type={column.type} value={row[column.id]}/>
                                    ))}
                                    <TableCell className="text-muted-foreground text-right">
                                        {formatDistance(row.submittedAt, new Date(), {addSuffix: true})}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                </TableBody>
            </Table>
        </div>
    </>
}

function RowCell({ type, value}:{type: ElementsType; value: string}){
    let node: ReactNode = value;
    switch(type){
        case "TextField":
            if(!value) break;
            
    }
    return <TableCell>
        {node}
    </TableCell>
}
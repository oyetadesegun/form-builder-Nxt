export default function FormBuilder({ form }: { form: Form }) {
  const [formName, setFormName] = useState(form.name)
  const [agentPrice, setAgentPrice] = useState(form.agentPrice || 0)
  const [userPrice, setUserPrice] = useState(form.userPrice || 0)
  const [isPending, startTransition] = useTransition()

  async function handleUpdate() {
    startTransition(async () => {
      try {
        await UpdateForm(form.id, {
          name: formName,
          agentPrice,
          userPrice,
        })
        toast.success("Form updated successfully")
      } catch (err) {
        console.error(err)
        toast.error("Failed to update form")
      }
    })
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Form name:</span>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-48"
            />
            <Input
              type="number"
              value={agentPrice}
              onChange={(e) => setAgentPrice(Number(e.target.value))}
              placeholder="Agent price"
              className="w-28"
            />
            <Input
              type="number"
              value={userPrice}
              onChange={(e) => setUserPrice(Number(e.target.value))}
              placeholder="User price"
              className="w-28"
            />
          </div>

          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn onClick={handleUpdate} disabled={isPending} />
                <PublishFormBtn onClick={handleUpdate} disabled={isPending} />
              </>
            )}
          </div>
        </nav>

        <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-screen bg-accent bg-[url(/jupiter.svg)] dark:bg-[url(/jupiter-dark.svg)]">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  )
}
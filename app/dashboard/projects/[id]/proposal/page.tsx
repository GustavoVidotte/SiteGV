import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProposalForm } from "@/components/proposals/proposal-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function CreateProposalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    redirect("/auth/login")
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("created_by", userData.user.id)
    .single()

  if (error || !project) {
    notFound()
  }

  // Check if proposal already exists
  const { data: existingProposal } = await supabase.from("proposals").select("*").eq("project_id", id).single()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">{existingProposal ? "Editar Proposta" : "Criar Proposta"}</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <ProposalForm project={project} existingProposal={existingProposal} />
        </div>
      </main>
    </div>
  )
}

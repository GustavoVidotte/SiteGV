import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProposalView } from "@/components/proposals/proposal-view"

export default async function ProposalViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id } = await params
  const { token } = await searchParams
  const supabase = await createClient()

  const { data: proposal, error } = await supabase
    .from("proposals")
    .select(
      `
      *,
      project:projects(
        *,
        creator:profiles!projects_created_by_fkey(full_name, email, company_name)
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error || !proposal) {
    notFound()
  }

  // Verify token matches client_id
  const isValidToken = token && proposal.project.client_id === token

  return (
    <div className="min-h-screen bg-background">
      <ProposalView proposal={proposal} isValidToken={isValidToken} />
    </div>
  )
}

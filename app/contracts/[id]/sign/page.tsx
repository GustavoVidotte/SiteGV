import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ContractSignView } from "@/components/contracts/contract-sign-view"

export default async function ContractSignPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id } = await params
  const { token } = await searchParams
  const supabase = await createClient()

  const { data: contract, error } = await supabase
    .from("contracts")
    .select(
      `
      *,
      project:projects(
        *,
        creator:profiles!projects_created_by_fkey(full_name, email, company_name),
        client:profiles!projects_client_id_fkey(full_name, email, company_name)
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error || !contract) {
    notFound()
  }

  // Verify token matches client_id
  const isValidToken = token && contract.project.client_id === token

  return (
    <div className="min-h-screen bg-background">
      <ContractSignView contract={contract} isValidToken={isValidToken} />
    </div>
  )
}

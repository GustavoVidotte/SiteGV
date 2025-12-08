import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PaymentCheckout } from "@/components/payments/payment-checkout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function PaymentPage({
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
    .select(
      `
      *,
      client:profiles!projects_client_id_fkey(full_name, email)
    `,
    )
    .eq("id", id)
    .single()

  if (error || !project) {
    notFound()
  }

  // Get contract
  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("project_id", id)
    .eq("status", "signed")
    .single()

  if (!contract) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Contrato não assinado</h1>
          <p className="text-muted-foreground mb-6">O contrato precisa ser assinado antes de processar o pagamento.</p>
          <Button asChild>
            <Link href={`/dashboard/projects/${id}`}>Voltar ao Projeto</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Check if payment already exists
  const { data: existingPayment } = await supabase.from("payments").select("*").eq("project_id", id).single()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Pagamento do Projeto</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <PaymentCheckout project={project} contract={contract} existingPayment={existingPayment} />
        </div>
      </main>
    </div>
  )
}

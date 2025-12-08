import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Download, Calendar, DollarSign, Hash } from "lucide-react"

export default async function InvoicePage({
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

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select(
      `
      *,
      client:profiles!projects_client_id_fkey(full_name, email, company_name),
      creator:profiles!projects_created_by_fkey(full_name, email, company_name)
    `,
    )
    .eq("id", id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // Get payment and invoice
  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("project_id", id)
    .eq("status", "completed")
    .single()

  if (!payment) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nota Fiscal não disponível</h1>
          <p className="text-muted-foreground mb-6">A nota fiscal será gerada após a confirmação do pagamento.</p>
          <Button asChild>
            <Link href={`/dashboard/projects/${id}`}>Voltar ao Projeto</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { data: invoice } = await supabase.from("invoices").select("*").eq("payment_id", payment.id).single()

  if (!invoice) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Nota Fiscal</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-3xl">NOTA FISCAL</CardTitle>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span className="font-mono">{invoice.invoice_number}</span>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do Emissor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">{project.creator?.company_name || "GV Software"}</p>
              <p className="text-sm text-muted-foreground">{project.creator?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">{project.client?.full_name || project.client?.email}</p>
              {project.client?.company_name && <p className="text-sm">{project.client.company_name}</p>}
              <p className="text-sm text-muted-foreground">{project.client?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Descrição dos Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">{project.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(invoice.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(invoice.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data de Emissão</p>
                    <p className="font-semibold">{new Date(invoice.issue_date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-semibold text-green-600">Pago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center">
              <Button size="lg" disabled>
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF (Em breve)
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                A funcionalidade de download de PDF será implementada em breve
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

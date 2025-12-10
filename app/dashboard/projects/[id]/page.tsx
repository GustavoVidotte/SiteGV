import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  User,
  DollarSign,
  Edit,
  Send,
  FileText,
  ExternalLink,
  ListTodo,
  FileSignature,
  Receipt,
} from "lucide-react"
import type { Project } from "@/lib/types/database"

const statusLabels: Record<Project["status"], string> = {
  draft: "Rascunho",
  proposal_sent: "Proposta Enviada",
  accepted: "Aceito",
  in_progress: "Em Andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
}

const statusColors: Record<Project["status"], string> = {
  draft: "bg-gray-500",
  proposal_sent: "bg-blue-500",
  accepted: "bg-green-500",
  in_progress: "bg-amber-500",
  completed: "bg-emerald-500",
  cancelled: "bg-red-500",
}

export default async function ProjectDetailPage({
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
      client:profiles!projects_client_id_fkey(full_name, email),
      creator:profiles!projects_created_by_fkey(full_name, email)
    `,
    )
    .eq("id", id)
    .single()

  if (error || !project) {
    notFound()
  }

  const { data: proposal } = await supabase.from("proposals").select("*").eq("project_id", id).single()

  const { data: contract } = await supabase.from("contracts").select("*").eq("project_id", id).single()

  const { data: payment } = await supabase.from("payments").select("*").eq("project_id", id).single()

  const { data: invoice } = await supabase.from("invoices").select("*").eq("project_id", id).single()

  const { count: tasksCount } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("project_id", id)

  const isOwner = project.created_by === userData.user.id

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Detalhes do Projeto</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{project.title}</CardTitle>
                  <Badge className={statusColors[project.status as Project["status"]]}>
                    {statusLabels[project.status as Project["status"]]}
                  </Badge>
                </div>
                {isOwner && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/projects/${id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Prazo:</span>
                    <span>{new Date(project.deadline).toLocaleDateString("pt-BR")}</span>
                  </div>

                  {project.total_value && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">Valor:</span>
                      <span>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(project.total_value)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Criado por:</span>
                    <span>{project.creator?.full_name || project.creator?.email}</span>
                  </div>

                  {project.client && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">Cliente:</span>
                      <span>{project.client.full_name || project.client.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                {contract?.status === "signed" && (
                  <>
                    {payment && payment.status === "completed" && invoice && (
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href={`/dashboard/projects/${id}/invoice`}>
                          <Receipt className="mr-2 h-4 w-4" />
                          Ver Nota Fiscal
                        </Link>
                      </Button>
                    )}
                  </>
                )}

                {isOwner && proposal?.status === "accepted" && (
                  <>
                    {!contract && (
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href={`/dashboard/projects/${id}/contract`}>
                          <FileSignature className="mr-2 h-4 w-4" />
                          Gerar Contrato
                        </Link>
                      </Button>
                    )}

                    {contract && (
                      <div className="flex gap-4">
                        <Button asChild variant="outline">
                          <Link href={`/dashboard/projects/${id}/contract`}>
                            <FileText className="mr-2 h-4 w-4" />
                            {contract.status === "draft" ? "Continuar Editando Contrato" : "Ver Contrato"}
                          </Link>
                        </Button>
                        {contract.status !== "draft" && (
                          <Button asChild variant="outline">
                            <Link href={`/contracts/${contract.id}/sign?token=${project.client_id}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Link para Assinatura
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}

                {(project.status === "accepted" || project.status === "in_progress") && (
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={`/dashboard/projects/${id}/tasks`}>
                      <ListTodo className="mr-2 h-4 w-4" />
                      Gerenciar Tarefas
                      {tasksCount !== null && tasksCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {tasksCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                )}

                {isOwner && (
                  <>
                    {!proposal && project.status === "draft" && (
                      <Button asChild>
                        <Link href={`/dashboard/projects/${id}/proposal`}>
                          <Send className="mr-2 h-4 w-4" />
                          Criar Proposta
                        </Link>
                      </Button>
                    )}

                    {proposal && (
                      <div className="flex gap-4">
                        <Button asChild variant="outline">
                          <Link href={`/dashboard/projects/${id}/proposal`}>
                            <FileText className="mr-2 h-4 w-4" />
                            {proposal.status === "draft" ? "Continuar Editando" : "Ver Proposta"}
                          </Link>
                        </Button>
                        {proposal.status !== "draft" && (
                          <Button asChild variant="outline">
                            <Link href={`/proposals/${proposal.id}/view?token=${project.client_id}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Link do Cliente
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import type { Project } from "@/lib/types/database"

interface ProjectsListProps {
  userId: string
}

const statusColors: Record<Project["status"], string> = {
  draft: "bg-gray-500",
  proposal_sent: "bg-blue-500",
  accepted: "bg-green-500",
  in_progress: "bg-amber-500",
  completed: "bg-emerald-500",
  cancelled: "bg-red-500",
}

const statusLabels: Record<Project["status"], string> = {
  draft: "Rascunho",
  proposal_sent: "Proposta Enviada",
  accepted: "Aceito",
  in_progress: "Em Andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
}

export async function ProjectsList({ userId }: ProjectsListProps) {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      *,
      client:profiles!projects_client_id_fkey(full_name, email),
      creator:profiles!projects_created_by_fkey(full_name)
    `,
    )
    .or(`created_by.eq.${userId},client_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum projeto encontrado</p>
          <Button asChild>
            <Link href="/dashboard/projects/new">Criar Primeiro Projeto</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: any) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
              <Badge className={statusColors[project.status as Project["status"]]}>
                {statusLabels[project.status as Project["status"]]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(project.deadline).toLocaleDateString("pt-BR")}</span>
              </div>
              {project.client && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{project.client.full_name || project.client.email}</span>
                </div>
              )}
              {project.total_value && (
                <div className="text-sm font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(project.total_value)}
                </div>
              )}
            </div>
            <Button asChild className="w-full">
              <Link href={`/dashboard/projects/${project.id}`}>Ver Detalhes</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

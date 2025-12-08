"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, User, MoreVertical, Trash2 } from "lucide-react"
import type { Task } from "@/lib/types/database"

interface TaskCardProps {
  task: any
}

const priorityColors: Record<Task["priority"], string> = {
  low: "bg-blue-500",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
}

const priorityLabels: Record<Task["priority"], string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
}

const statusOptions: { value: Task["status"]; label: string }[] = [
  { value: "todo", label: "A Fazer" },
  { value: "in_progress", label: "Em Andamento" },
  { value: "review", label: "Em Revisão" },
  { value: "completed", label: "Concluída" },
]

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: Task["status"]) => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id)

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erro ao atualizar tarefa")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return

    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("tasks").delete().eq("id", task.id)

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erro ao excluir tarefa")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium line-clamp-2">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  disabled={isLoading || task.status === option.value}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} disabled={isLoading} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge className={`${priorityColors[task.priority]} w-fit`}>{priorityLabels[task.priority]}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}
        {task.due_date && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.due_date).toLocaleDateString("pt-BR")}</span>
          </div>
        )}
        {task.assigned && (
          <div className="flex items-center gap-2 text-xs">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{task.assigned.full_name || task.assigned.email}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

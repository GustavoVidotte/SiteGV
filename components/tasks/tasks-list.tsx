import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TaskCard } from "@/components/tasks/task-card"
import type { Task } from "@/lib/types/database"

interface TasksListProps {
  projectId: string
  userId: string
}

const statusLabels: Record<Task["status"], string> = {
  todo: "A Fazer",
  in_progress: "Em Andamento",
  review: "Em Revisão",
  completed: "Concluída",
}

const statusGroups = [
  { status: "todo" as const, label: "A Fazer" },
  { status: "in_progress" as const, label: "Em Andamento" },
  { status: "review" as const, label: "Em Revisão" },
  { status: "completed" as const, label: "Concluídas" },
]

export async function TasksList({ projectId, userId }: TasksListProps) {
  const supabase = await createClient()

  const { data: tasks } = await supabase
    .from("tasks")
    .select(
      `
      *,
      assigned:profiles!tasks_assigned_to_fkey(full_name, email)
    `,
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Nenhuma tarefa criada ainda. Clique em "Nova Tarefa" para começar.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {statusGroups.map((group) => {
        const groupTasks = tasks.filter((task: any) => task.status === group.status)

        return (
          <div key={group.status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{group.label}</h3>
              <Badge variant="secondary">{groupTasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {groupTasks.map((task: any) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {groupTasks.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">Nenhuma tarefa</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

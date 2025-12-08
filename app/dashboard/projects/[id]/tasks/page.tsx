import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TasksList } from "@/components/tasks/tasks-list"
import { TaskCreateDialog } from "@/components/tasks/task-create-dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ProjectTasksPage({
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

  const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error || !project) {
    notFound()
  }

  // Get all team members (creator and assigned users)
  const { data: teamMembers } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .or(`id.eq.${project.created_by},id.eq.${project.client_id}`)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Tarefas do Projeto</h1>
        <div className="ml-auto">
          <TaskCreateDialog projectId={id} teamMembers={teamMembers || []} />
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <TasksList projectId={id} userId={userData.user.id} />
        </div>
      </main>
    </div>
  )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectForm } from "@/components/projects/project-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewProjectPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Novo Projeto</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <ProjectForm userId={data.user.id} />
        </div>
      </main>
    </div>
  )
}

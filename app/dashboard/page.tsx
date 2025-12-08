import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectsList } from "@/components/projects/projects-list"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, LogOut } from "lucide-react"
import Image from "next/image"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

      <header className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-4 px-6">
          <div className="flex flex-1 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 hover-lift">
              <Image src="/images/gv-logo.png" alt="GV Software" width={40} height={40} className="animate-glow" />
              <div>
                <h1 className="text-xl font-bold text-white">GV Software</h1>
                <p className="text-xs text-purple-300">Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Button asChild className="gradient-tech hover-lift border-0">
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Projeto
                </Link>
              </Button>
              <form
                action={async () => {
                  "use server"
                  const supabase = await createClient()
                  await supabase.auth.signOut()
                  redirect("/auth/login")
                }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="glass border-white/10 hover:bg-red-500/20 bg-transparent"
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header section com animação */}
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold tracking-tight text-white">Dashboard</h2>
            <p className="text-gray-400 mt-2">Visão geral dos seus projetos e atividades</p>
          </div>

          {/* Stats com animação */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <DashboardStats userId={data.user.id} />
          </div>

          {/* Projects section */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">Projetos</h3>
            </div>
            <ProjectsList userId={data.user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

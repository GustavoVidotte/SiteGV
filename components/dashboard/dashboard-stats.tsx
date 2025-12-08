import { createClient } from "@/lib/supabase/server"
import { Briefcase, Clock, CheckCircle, DollarSign } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("status, total_value")
    .or(`created_by.eq.${userId},client_id.eq.${userId}`)

  const totalProjects = projects?.length || 0
  const inProgressProjects = projects?.filter((p) => p.status === "in_progress").length || 0
  const completedProjects = projects?.filter((p) => p.status === "completed").length || 0
  const totalRevenue = projects?.reduce((sum, p) => sum + (p.total_value || 0), 0) || 0

  const stats = [
    {
      title: "Total de Projetos",
      value: totalProjects,
      icon: Briefcase,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "Em Andamento",
      value: inProgressProjects,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      title: "Concluídos",
      value: completedProjects,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      title: "Receita Total",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(totalRevenue),
      icon: DollarSign,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className="glass-card rounded-2xl p-6 hover-lift group animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-400">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} group-hover:scale-110 transition-transform`}
            >
              <stat.icon className={`h-6 w-6 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
            </div>
          </div>
          {/* Decorative gradient line */}
          <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${stat.gradient} opacity-50`} />
        </div>
      ))}
    </div>
  )
}

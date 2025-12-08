"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  FolderOpen,
  Code2,
  Info,
  MessageSquare,
  Mail,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Star,
  Eye,
  Menu,
  CloverIcon as CloseIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type Project = {
  id: string
  title: string
  description: string
  image_url: string
  project_url: string
  github_url: string
  technologies: string[]
  is_featured: boolean
  display_order: number
}

type Skill = {
  id: string
  name: string
  icon: string
  color: string
  category: string
  display_order: number
}

type About = {
  id: string
  title: string
  description: string
  projects_count: number
  clients_count: number
  years_experience: number
}

type Feedback = {
  id: string
  client_name: string
  client_company: string
  client_email: string
  rating: number
  message: string
  project_name: string
  is_approved: boolean
  is_featured: boolean
  created_at: string
}

type Contact = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  subject: string
  budget: string
  deadline: string
  message: string
  is_read: boolean
  created_at: string
}

type AdminDashboardProps = {
  user: { email?: string }
  initialProjects: Project[]
  initialSkills: Skill[]
  initialAbout: About | null
  initialFeedbacks: Feedback[]
  initialContacts: Contact[]
}

export default function AdminDashboard({
  user,
  initialProjects,
  initialSkills,
  initialAbout,
  initialFeedbacks,
  initialContacts,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [about, setAbout] = useState<About | null>(initialAbout)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks)
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projetos", icon: FolderOpen },
    { id: "skills", label: "Habilidades", icon: Code2 },
    { id: "about", label: "Sobre", icon: Info },
    { id: "feedbacks", label: "Feedbacks", icon: MessageSquare },
    { id: "contacts", label: "Contatos", icon: Mail },
  ]

  const stats = [
    { label: "Projetos", value: projects.length, color: "from-purple-500 to-purple-700" },
    { label: "Habilidades", value: skills.length, color: "from-blue-500 to-blue-700" },
    { label: "Feedbacks", value: feedbacks.filter((f) => f.is_approved).length, color: "from-green-500 to-green-700" },
    { label: "Contatos", value: contacts.filter((c) => !c.is_read).length, color: "from-orange-500 to-orange-700" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0a0118]">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-xl rounded-lg text-white"
      >
        {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Image src="/images/gv-logo-3d.png" alt="GV Software" width={40} height={40} />
              <div>
                <h1 className="text-white font-bold">GV Software</h1>
                <p className="text-xs text-gray-400">Painel Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.id === "contacts" && contacts.filter((c) => !c.is_read).length > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs">
                    {contacts.filter((c) => !c.is_read).length}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-white/10">
            <div className="text-sm text-gray-400 mb-3 truncate">{user.email}</div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-white/10 text-gray-300 hover:bg-white/5 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen p-6 lg:p-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
              <p className="text-gray-400">Visão geral do seu portfólio</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent feedbacks */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Feedbacks Recentes</h3>
              <div className="space-y-3">
                {feedbacks.slice(0, 5).map((feedback) => (
                  <div key={feedback.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-white font-medium">{feedback.client_name}</div>
                      <div className="text-gray-400 text-sm">{feedback.message.slice(0, 60)}...</div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(feedback.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                ))}
                {feedbacks.length === 0 && <p className="text-gray-500 text-center py-8">Nenhum feedback ainda</p>}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <ProjectsManager projects={projects} setProjects={setProjects} supabase={supabase} />
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && <SkillsManager skills={skills} setSkills={setSkills} supabase={supabase} />}

        {/* About Tab */}
        {activeTab === "about" && <AboutManager about={about} setAbout={setAbout} supabase={supabase} />}

        {/* Feedbacks Tab */}
        {activeTab === "feedbacks" && (
          <FeedbacksManager feedbacks={feedbacks} setFeedbacks={setFeedbacks} supabase={supabase} />
        )}

        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <ContactsManager contacts={contacts} setContacts={setContacts} supabase={supabase} />
        )}
      </main>
    </div>
  )
}

// Projects Manager Component
function ProjectsManager({
  projects,
  setProjects,
  supabase,
}: { projects: Project[]; setProjects: (p: Project[]) => void; supabase: ReturnType<typeof createClient> }) {
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    project_url: "",
    github_url: "",
    technologies: "",
    is_featured: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const techArray = formData.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    if (editingProject) {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .update({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          project_url: formData.project_url,
          github_url: formData.github_url,
          technologies: techArray,
          is_featured: formData.is_featured,
        })
        .eq("id", editingProject.id)
        .select()
        .single()

      if (!error && data) {
        setProjects(projects.map((p) => (p.id === editingProject.id ? data : p)))
      }
    } else {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .insert({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          project_url: formData.project_url,
          github_url: formData.github_url,
          technologies: techArray,
          is_featured: formData.is_featured,
          display_order: projects.length,
        })
        .select()
        .single()

      if (!error && data) {
        setProjects([...projects, data])
      }
    }

    resetForm()
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || "",
      image_url: project.image_url || "",
      project_url: project.project_url || "",
      github_url: project.github_url || "",
      technologies: project.technologies?.join(", ") || "",
      is_featured: project.is_featured,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return

    const { error } = await supabase.from("portfolio_projects").delete().eq("id", id)
    if (!error) {
      setProjects(projects.filter((p) => p.id !== id))
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingProject(null)
    setFormData({
      title: "",
      description: "",
      image_url: "",
      project_url: "",
      github_url: "",
      technologies: "",
      is_featured: false,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Projetos</h2>
          <p className="text-gray-400">Gerencie os projetos do seu portfólio</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingProject ? "Editar Projeto" : "Novo Projeto"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Título</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">URL da Imagem</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">URL do Projeto</Label>
              <Input
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">GitHub URL</Label>
              <Input
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Tecnologias (separadas por vírgula)</Label>
            <Input
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="React, Next.js, TypeScript"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded border-white/10"
            />
            <Label htmlFor="is_featured" className="text-gray-300">
              Projeto em destaque
            </Label>
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
              {editingProject ? "Salvar" : "Criar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="border-white/10 text-gray-300 bg-transparent"
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {/* Projects list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 group"
          >
            {project.image_url && (
              <div className="aspect-video bg-white/5 relative overflow-hidden">
                <img
                  src={project.image_url || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-semibold">{project.title}</h4>
                {project.is_featured && <Badge className="bg-purple-500/20 text-purple-300 text-xs">Destaque</Badge>}
              </div>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies?.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(project)}
                  className="border-white/10 text-gray-300 hover:bg-white/5"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(project.id)}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum projeto cadastrado</p>
        </div>
      )}
    </div>
  )
}

// Skills Manager Component
function SkillsManager({
  skills,
  setSkills,
  supabase,
}: { skills: Skill[]; setSkills: (s: Skill[]) => void; supabase: ReturnType<typeof createClient> }) {
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    color: "#8B5CF6",
    category: "frontend",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSkill) {
      const { data, error } = await supabase
        .from("portfolio_skills")
        .update(formData)
        .eq("id", editingSkill.id)
        .select()
        .single()

      if (!error && data) {
        setSkills(skills.map((s) => (s.id === editingSkill.id ? data : s)))
      }
    } else {
      const { data, error } = await supabase
        .from("portfolio_skills")
        .insert({ ...formData, display_order: skills.length })
        .select()
        .single()

      if (!error && data) {
        setSkills([...skills, data])
      }
    }

    resetForm()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza?")) return
    const { error } = await supabase.from("portfolio_skills").delete().eq("id", id)
    if (!error) {
      setSkills(skills.filter((s) => s.id !== id))
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingSkill(null)
    setFormData({ name: "", icon: "", color: "#8B5CF6", category: "frontend" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Habilidades</h2>
          <p className="text-gray-400">Gerencie suas tecnologias e habilidades</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Nova Habilidade
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nome</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Icone (nome)</Label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="react, nextjs, typescript..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Cor</Label>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="bg-white/5 border-white/10 h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Categoria</Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-md text-white"
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="devops">DevOps</option>
                <option value="design">Design</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
              {editingSkill ? "Salvar" : "Criar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="border-white/10 text-gray-300 bg-transparent"
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 group relative"
          >
            <div className="text-center">
              <div
                className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: skill.color + "20" }}
              >
                <Code2 className="w-5 h-5" style={{ color: skill.color }} />
              </div>
              <p className="text-white text-sm font-medium">{skill.name}</p>
              <p className="text-gray-500 text-xs">{skill.category}</p>
            </div>
            <button
              onClick={() => handleDelete(skill.id)}
              className="absolute top-2 right-2 p-1 bg-red-500/20 rounded text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// About Manager Component
function AboutManager({
  about,
  setAbout,
  supabase,
}: { about: About | null; setAbout: (a: About | null) => void; supabase: ReturnType<typeof createClient> }) {
  const [formData, setFormData] = useState({
    title: about?.title || "Sobre a GV Software",
    description: about?.description || "",
    projects_count: about?.projects_count || 0,
    clients_count: about?.clients_count || 0,
    years_experience: about?.years_experience || 0,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    if (about) {
      const { data, error } = await supabase
        .from("portfolio_about")
        .update(formData)
        .eq("id", about.id)
        .select()
        .single()

      if (!error && data) {
        setAbout(data)
      }
    } else {
      const { data, error } = await supabase.from("portfolio_about").insert(formData).select().single()

      if (!error && data) {
        setAbout(data)
      }
    }

    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Sobre</h2>
        <p className="text-gray-400">Edite as informações sobre sua empresa</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4"
      >
        <div className="space-y-2">
          <Label className="text-gray-300">Título</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Descrição</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
            rows={5}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Projetos Realizados</Label>
            <Input
              type="number"
              value={formData.projects_count}
              onChange={(e) => setFormData({ ...formData, projects_count: Number.parseInt(e.target.value) || 0 })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Clientes Satisfeitos</Label>
            <Input
              type="number"
              value={formData.clients_count}
              onChange={(e) => setFormData({ ...formData, clients_count: Number.parseInt(e.target.value) || 0 })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Anos de Experiência</Label>
            <Input
              type="number"
              value={formData.years_experience}
              onChange={(e) => setFormData({ ...formData, years_experience: Number.parseInt(e.target.value) || 0 })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>
        <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-purple-600 to-pink-600">
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  )
}

// Feedbacks Manager Component
function FeedbacksManager({
  feedbacks,
  setFeedbacks,
  supabase,
}: { feedbacks: Feedback[]; setFeedbacks: (f: Feedback[]) => void; supabase: ReturnType<typeof createClient> }) {
  const toggleApprove = async (feedback: Feedback) => {
    const { error } = await supabase
      .from("portfolio_feedbacks")
      .update({ is_approved: !feedback.is_approved })
      .eq("id", feedback.id)

    if (!error) {
      setFeedbacks(feedbacks.map((f) => (f.id === feedback.id ? { ...f, is_approved: !f.is_approved } : f)))
    }
  }

  const toggleFeatured = async (feedback: Feedback) => {
    const { error } = await supabase
      .from("portfolio_feedbacks")
      .update({ is_featured: !feedback.is_featured })
      .eq("id", feedback.id)

    if (!error) {
      setFeedbacks(feedbacks.map((f) => (f.id === feedback.id ? { ...f, is_featured: !f.is_featured } : f)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este feedback?")) return
    const { error } = await supabase.from("portfolio_feedbacks").delete().eq("id", id)
    if (!error) {
      setFeedbacks(feedbacks.filter((f) => f.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Feedbacks</h2>
        <p className="text-gray-400">Gerencie os feedbacks dos clientes</p>
      </div>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold">{feedback.client_name}</h4>
                <p className="text-gray-400 text-sm">{feedback.client_company}</p>
                <p className="text-gray-500 text-xs">{feedback.client_email}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(feedback.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-300 mb-4">{feedback.message}</p>
            {feedback.project_name && <p className="text-sm text-purple-400 mb-4">Projeto: {feedback.project_name}</p>}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => toggleApprove(feedback)}
                className={feedback.is_approved ? "bg-green-600" : "bg-gray-600"}
              >
                {feedback.is_approved ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                {feedback.is_approved ? "Aprovado" : "Pendente"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleFeatured(feedback)}
                className={feedback.is_featured ? "border-yellow-500 text-yellow-400" : "border-white/10 text-gray-400"}
              >
                <Star className={`w-4 h-4 mr-1 ${feedback.is_featured ? "fill-current" : ""}`} />
                Destaque
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(feedback.id)}
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {feedbacks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum feedback recebido</p>
        </div>
      )}
    </div>
  )
}

// Contacts Manager Component
function ContactsManager({
  contacts,
  setContacts,
  supabase,
}: { contacts: Contact[]; setContacts: (c: Contact[]) => void; supabase: ReturnType<typeof createClient> }) {
  const markAsRead = async (contact: Contact) => {
    const { error } = await supabase.from("portfolio_contacts").update({ is_read: true }).eq("id", contact.id)

    if (!error) {
      setContacts(contacts.map((c) => (c.id === contact.id ? { ...c, is_read: true } : c)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este contato?")) return
    const { error } = await supabase.from("portfolio_contacts").delete().eq("id", id)
    if (!error) {
      setContacts(contacts.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Contatos</h2>
        <p className="text-gray-400">Mensagens recebidas pelo formulário</p>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border ${contact.is_read ? "border-white/10" : "border-purple-500/30"}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-semibold">{contact.name}</h4>
                  {!contact.is_read && <Badge className="bg-purple-500 text-white text-xs">Novo</Badge>}
                </div>
                <p className="text-gray-400 text-sm">{contact.company}</p>
              </div>
              <p className="text-gray-500 text-sm">{new Date(contact.created_at).toLocaleDateString("pt-BR")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-300 ml-2">{contact.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Telefone:</span>
                <span className="text-gray-300 ml-2">{contact.phone}</span>
              </div>
              <div>
                <span className="text-gray-500">Assunto:</span>
                <span className="text-gray-300 ml-2">{contact.subject}</span>
              </div>
              <div>
                <span className="text-gray-500">Orçamento:</span>
                <span className="text-gray-300 ml-2">{contact.budget}</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{contact.message}</p>
            <div className="flex items-center gap-2">
              {!contact.is_read && (
                <Button size="sm" onClick={() => markAsRead(contact)} className="bg-purple-600">
                  <Eye className="w-4 h-4 mr-1" />
                  Marcar como lido
                </Button>
              )}
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <Mail className="w-4 h-4 mr-1" />
                Responder
              </a>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(contact.id)}
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum contato recebido</p>
        </div>
      )}
    </div>
  )
}

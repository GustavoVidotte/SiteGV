"use client"

import type React from "react"
import { SocialFloat } from "@/components/social-float"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Code2,
  Sparkles,
  Zap,
  TrendingUp,
  Menu,
  X,
  Mail,
  Phone,
  Instagram,
  User,
  Send,
  CheckCircle,
  MessageSquare,
  FolderOpen,
  Briefcase,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Interface for projects from database
interface Project {
  id: string
  title: string
  description: string
  image_url: string
  technologies: string[]
  is_featured: boolean
  display_order: number
}

export default function PortfolioPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // State for projects from database
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    budget: "",
    deadline: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true)
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("display_order", { ascending: true })

      if (!error && data) {
        setProjects(data)
      }
      setLoadingProjects(false)
    }

    fetchProjects()

    // Subscribe to realtime changes
    const channel = supabase
      .channel("portfolio_projects_public")
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio_projects" }, fetchProjects)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed")
        } else {
          entry.target.classList.remove("revealed")
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll(".scroll-reveal")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const skills = [
    { name: "React.js", icon: Code2 },
    { name: "Next.js", icon: Zap },
    { name: "Node.js", icon: TrendingUp },
    { name: "TypeScript", icon: Sparkles },
    { name: "Python", icon: "🐍", isEmoji: true },
    { name: "PostgreSQL", icon: "🐘", isEmoji: true },
    { name: "MongoDB", icon: "🍃", isEmoji: true },
    { name: "Docker", icon: "🐳", isEmoji: true },
    { name: "AWS", icon: "☁️", isEmoji: true },
    { name: "Git", icon: "📦", isEmoji: true },
    { name: "TailwindCSS", icon: "🎨", isEmoji: true },
    { name: "GraphQL", icon: "◈", isEmoji: true },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("portfolio_contacts").insert({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        budget: formData.budget,
        deadline: formData.deadline,
        message: formData.message,
      })

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.name,
          empresa: formData.company,
          email: formData.email,
          telefone: formData.phone,
          assunto: formData.subject,
          orcamento: formData.budget,
          prazo: formData.deadline,
          mensagem: formData.message,
        }),
      })

      if (!error) {
        setSubmitSuccess(true)
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          subject: "",
          budget: "",
          deadline: "",
          message: "",
        })
        setTimeout(() => setSubmitSuccess(false), 5000)
      }
    } catch (error) {
      console.error("Erro ao enviar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0118]">
      <SocialFloat />

      <div className="fixed inset-0 bg-[#0a0118]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-mesh-gradient" />

        {/* Main orbs with floating animation */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl animate-float-orb" />
        <div
          className="absolute top-2/3 right-1/4 w-96 h-96 bg-blue-600/40 rounded-full blur-3xl animate-float-orb"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="absolute top-1/2 left-2/3 w-72 h-72 bg-pink-600/30 rounded-full blur-3xl animate-float-orb"
          style={{ animationDelay: "-10s" }}
        />

        {/* Additional orbs for more dynamic effect */}
        <div
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl animate-float-orb"
          style={{ animationDelay: "-15s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl animate-float-orb"
          style={{ animationDelay: "-8s" }}
        />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-particles"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/5 animate-navbar">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <a href="#" className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500" />
                  <Image
                    src="/images/gv-logo-3d.png"
                    alt="GV Software"
                    width={55}
                    height={55}
                    className="relative rounded-xl shadow-2xl group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-400 transition-all duration-300">
                    GV Software
                  </h2>
                  <p className="text-xs font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-widest uppercase">
                    Inovação & Tecnologia
                  </p>
                </div>
              </a>

              <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                <a
                  href="#projetos"
                  className="relative group flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                >
                  <FolderOpen className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span className="text-base font-semibold bg-gradient-to-r from-gray-100 to-purple-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                    Portfólio
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                </a>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="#contato"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm
                    bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%]
                    hover:bg-[position:100%_0] transition-all duration-500
                    shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]
                    hover:scale-105 text-white"
                >
                  <Sparkles size={16} />
                  Solicitar Orçamento
                </a>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-white"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden backdrop-blur-xl bg-black/90 border-t border-white/5 animate-fade-in-down">
                <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                  <a
                    href="#projetos"
                    className="text-lg text-gray-300 hover:text-purple-400 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Portfólio
                  </a>
                  <a
                    href="#contato"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold
                      bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                      shadow-[0_0_20px_rgba(168,85,247,0.5)] text-white"
                  >
                    <Sparkles size={16} />
                    Solicitar Orçamento
                  </a>
                </div>
              </div>
            )}
          </nav>
        </header>

        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="container mx-auto text-center space-y-8 max-w-5xl">
            <div className="scroll-reveal slide-down">
              <h1 className="text-6xl md:text-8xl font-bold text-balance leading-tight mb-6">
                Transformando
                <br />
                suas <span className="text-gradient">ideias</span> em
                <br />
                <span className="text-gradient">realidade digital</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto text-balance scroll-reveal slide-up delay-200">
              Criamos soluções digitais inovadoras que impulsionam o crescimento do seu negócio com{" "}
              <span className="text-purple-400 font-semibold">tecnologia de ponta</span> e{" "}
              <span className="text-pink-400 font-semibold">design excepcional</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 scroll-reveal zoom-in delay-400">
              <Button size="lg" className="gradient-tech hover-lift border-0 text-lg px-8 py-6 h-auto">
                <a href="#projetos" className="flex items-center gap-2">
                  Ver Projetos
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="glass border-purple-500/50 hover:bg-purple-500/20 text-lg px-8 py-6 h-auto bg-transparent"
              >
                <a href="#contato">Solicitar Orçamento</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="sobre" className="py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="glass-card rounded-3xl p-12 md:p-16 scroll-reveal slide-up">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-5xl font-bold text-white mb-4">
                    Sobre a <span className="text-gradient">GV Software</span>
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Somos especializados em criar experiências digitais inovadoras e soluções tecnológicas que
                    transformam negócios. Com foco em performance, design e resultados, desenvolvemos sistemas completos
                    do conceito à implementação.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Nossa missão é tornar a tecnologia acessível e poderosa para empresas de todos os tamanhos,
                    entregando projetos que superam expectativas e geram valor real.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <div className="glass-card rounded-xl p-4 text-center flex-1">
                      <div className="text-3xl font-bold text-gradient">50+</div>
                      <div className="text-sm text-gray-400 mt-1">Projetos</div>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center flex-1">
                      <div className="text-3xl font-bold text-gradient">100%</div>
                      <div className="text-sm text-gray-400 mt-1">Satisfação</div>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center flex-1">
                      <div className="text-3xl font-bold text-gradient">5+</div>
                      <div className="text-sm text-gray-400 mt-1">Anos</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-1">
                    <div className="w-full h-full rounded-3xl bg-[#0a0118] flex items-center justify-center">
                      <Image
                        src="/images/gv-logo-3d.png"
                        alt="GV Software"
                        width={300}
                        height={300}
                        className="animate-glow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="habilidades" className="py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 scroll-reveal slide-down">
              <h2 className="text-5xl font-bold text-white mb-4">
                Nossas <span className="text-gradient">Habilidades</span>
              </h2>
              <p className="text-xl text-gray-300">Tecnologias e ferramentas que dominamos</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skills.map((skill, index) => {
                const Icon = skill.icon
                const delays = [
                  "delay-100",
                  "delay-200",
                  "delay-300",
                  "delay-400",
                  "delay-100",
                  "delay-200",
                  "delay-300",
                  "delay-400",
                  "delay-100",
                  "delay-200",
                  "delay-300",
                  "delay-400",
                ]
                return (
                  <div
                    key={index}
                    className={`glass-card rounded-2xl p-8 hover-lift group cursor-pointer scroll-reveal zoom-in ${delays[index]}`}
                  >
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {skill.isEmoji ? (
                        <span className="text-4xl">{Icon}</span>
                      ) : (
                        <Icon className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="projetos" className="py-32 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 scroll-reveal slide-down">
              <h2 className="text-5xl font-bold text-white mb-4">
                Nossos <span className="text-gradient">Projetos</span>
              </h2>
              <p className="text-xl text-gray-300">Conheça alguns dos nossos trabalhos mais recentes</p>
            </div>

            {loadingProjects ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhum projeto cadastrado ainda.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => {
                  const animations = ["slide-left", "slide-up", "slide-right", "slide-right", "slide-up", "slide-left"]
                  const delays = ["delay-100", "delay-200", "delay-300", "delay-100", "delay-200", "delay-300"]
                  return (
                    <div
                      key={project.id}
                      className={`glass-card rounded-2xl overflow-hidden hover-lift group cursor-pointer scroll-reveal ${animations[index % 6]} ${delays[index % 6]}`}
                    >
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                        <Image
                          src={project.image_url || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                        <p className="text-gray-400 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Seção de Contato - ATUALIZADA */}
        <section id="contato" className="relative py-32 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16 scroll-reveal slide-down">
              <h2 className="text-5xl font-bold text-white mb-4">
                Entre em <span className="text-gradient">Contato</span>
              </h2>
              <p className="text-xl text-gray-300">Vamos transformar sua ideia em realidade</p>
            </div>

            <div className="glass-card rounded-3xl p-8 md:p-12 scroll-reveal zoom-in delay-200">
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <a href="mailto:contato.gvsoftware@gmail.com" className="glass-card rounded-xl p-6 hover-lift group">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">E-mail</h3>
                  <p className="text-gray-400 text-sm">contato.gvsoftware@gmail.com</p>
                </a>

                <a href="tel:+5517997853416" className="glass-card rounded-xl p-6 hover-lift group">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Telefone</h3>
                  <p className="text-gray-400">(17) 99785-3416</p>
                </a>

                <a
                  href="https://www.instagram.com/gv_software/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-6 hover-lift group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Instagram</h3>
                  <p className="text-gray-400">@gv_software</p>
                </a>
              </div>

              {submitSuccess && (
                <div className="mb-8 p-4 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <p className="text-green-400 font-medium">
                    Mensagem enviada com sucesso! Entraremos em contato em breve.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Linha 1: Nome e Empresa */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo *"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Nome da empresa (opcional)"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Linha 2: Email e Telefone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Seu melhor e-mail *"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="WhatsApp / Telefone *"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Linha 3: Assunto */}
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5rem",
                    }}
                  >
                    <option value="" disabled className="bg-[#0a0118] text-gray-400">
                      Qual o assunto? *
                    </option>
                    <option value="Site Institucional" className="bg-[#0a0118] text-white">
                      Site Institucional
                    </option>
                    <option value="Loja Virtual / E-commerce" className="bg-[#0a0118] text-white">
                      Loja Virtual / E-commerce
                    </option>
                    <option value="Sistema Web / Aplicativo" className="bg-[#0a0118] text-white">
                      Sistema Web / Aplicativo
                    </option>
                    <option value="Landing Page" className="bg-[#0a0118] text-white">
                      Landing Page
                    </option>
                    <option value="Manutenção / Suporte" className="bg-[#0a0118] text-white">
                      Manutenção / Suporte
                    </option>
                    <option value="Consultoria" className="bg-[#0a0118] text-white">
                      Consultoria
                    </option>
                    <option value="Outro" className="bg-[#0a0118] text-white">
                      Outro
                    </option>
                  </select>
                </div>

                {/* Linha 4: Orçamento e Prazo */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1.5rem",
                      }}
                    >
                      <option value="" className="bg-[#0a0118] text-gray-400">
                        Orçamento estimado (opcional)
                      </option>
                      <option value="Até R$ 1.000" className="bg-[#0a0118] text-white">
                        Até R$ 1.000
                      </option>
                      <option value="R$ 1.000 - R$ 3.000" className="bg-[#0a0118] text-white">
                        R$ 1.000 - R$ 3.000
                      </option>
                      <option value="R$ 3.000 - R$ 5.000" className="bg-[#0a0118] text-white">
                        R$ 3.000 - R$ 5.000
                      </option>
                      <option value="R$ 5.000 - R$ 10.000" className="bg-[#0a0118] text-white">
                        R$ 5.000 - R$ 10.000
                      </option>
                      <option value="Acima de R$ 10.000" className="bg-[#0a0118] text-white">
                        Acima de R$ 10.000
                      </option>
                    </select>
                  </div>
                  <div>
                    <select
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1.5rem",
                      }}
                    >
                      <option value="" className="bg-[#0a0118] text-gray-400">
                        Prazo desejado (opcional)
                      </option>
                      <option value="Urgente (até 1 semana)" className="bg-[#0a0118] text-white">
                        Urgente (até 1 semana)
                      </option>
                      <option value="Curto (1-2 semanas)" className="bg-[#0a0118] text-white">
                        Curto (1-2 semanas)
                      </option>
                      <option value="Médio (2-4 semanas)" className="bg-[#0a0118] text-white">
                        Médio (2-4 semanas)
                      </option>
                      <option value="Flexível (1-2 meses)" className="bg-[#0a0118] text-white">
                        Flexível (1-2 meses)
                      </option>
                      <option value="Sem pressa" className="bg-[#0a0118] text-white">
                        Sem pressa
                      </option>
                    </select>
                  </div>
                </div>

                {/* Linha 5: Mensagem */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Conte-nos mais sobre seu projeto... O que você precisa? Quais funcionalidades? *"
                    required
                    rows={5}
                    className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all resize-none"
                  />
                </div>

                {/* Botão de envio */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] hover:bg-[position:100%_0] border-0 text-lg py-6 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>

                <p className="text-center text-gray-500 text-sm">Campos marcados com * são obrigatórios</p>
              </form>
            </div>
          </div>
        </section>

        <footer className="relative py-12 px-6">
          {/* Efeito de glow sutil */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[150px] bg-purple-600/5 rounded-full blur-3xl" />

          <div className="container mx-auto relative z-10">
            {/* Conteúdo principal */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
              {/* Logo e nome */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-cyan-500/50 rounded-xl blur-md opacity-50" />
                  <Image
                    src="/images/gv-logo-3d.png"
                    alt="GV Software"
                    width={45}
                    height={45}
                    className="relative rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">GV Software</h3>
                  <p className="text-xs text-purple-400/80">Inovação & Tecnologia</p>
                </div>
              </div>

              {/* Redes sociais */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/gv_software/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <Instagram className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>
                <a
                  href="mailto:contato.gvsoftware@gmail.com"
                  className="group p-2.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <Mail className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>
                <a
                  href="tel:+5517997853416"
                  className="group p-2.5 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Linha divisória sutil */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

            <p className="text-center text-base md:text-lg font-medium text-white/80">
              © 2025{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                GV Software
              </span>
              . Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

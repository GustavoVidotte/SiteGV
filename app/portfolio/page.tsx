"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Mail, Phone, MapPin, Github, Linkedin, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const projects = [
  {
    id: 1,
    title: "Sistema de Gestão Empresarial",
    description: "Plataforma completa para gestão de projetos, tarefas e equipes com dashboard em tempo real.",
    image: "/modern-business-management-dashboard.jpg",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: 2,
    title: "E-commerce Inteligente",
    description: "Loja online com IA para recomendações personalizadas e checkout otimizado.",
    image: "/modern-ecommerce-platform.png",
    tags: ["Next.js", "Stripe", "AI"],
  },
  {
    id: 3,
    title: "App Mobile de Produtividade",
    description: "Aplicativo multiplataforma para gerenciamento de tempo e produtividade pessoal.",
    image: "/productivity-app-interface.png",
    tags: ["React Native", "Firebase", "TypeScript"],
  },
  {
    id: 4,
    title: "Sistema de Automação Industrial",
    description: "Solução IoT para monitoramento e controle de processos industriais em tempo real.",
    image: "/industrial-automation-dashboard.jpg",
    tags: ["IoT", "Python", "MongoDB"],
  },
  {
    id: 5,
    title: "Plataforma de Educação Online",
    description: "Sistema completo de EAD com videoconferência, quizzes e acompanhamento de progresso.",
    image: "/online-education-platform.png",
    tags: ["Vue.js", "WebRTC", "MySQL"],
  },
  {
    id: 6,
    title: "Dashboard de Analytics",
    description: "Painel analítico com visualização de dados em tempo real e relatórios customizáveis.",
    image: "/analytics-dashboard-modern-charts.jpg",
    tags: ["React", "D3.js", "GraphQL"],
  },
]

export default function PortfolioPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulando envio
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Mensagem enviada com sucesso!")
    setFormData({ name: "", email: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="border-b border-white/10 bg-black/20 backdrop-blur-xl"
        >
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/images/1000861281.jpeg"
                  alt="GV Software"
                  width={60}
                  height={60}
                  className="object-contain transition-all duration-300 group-hover:scale-110"
                  style={{ filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))" }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  GV Software
                </h1>
                <p className="text-sm text-gray-400">Inovação & Tecnologia</p>
              </div>
            </Link>

            <nav>
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-blue-400 transition-all duration-300"
                >
                  Home
                </Button>
              </Link>
            </nav>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Portfolio Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Nossos Projetos
                </h2>
                <p className="text-gray-400 mb-12 text-lg">
                  Transformando ideias em realidade digital com tecnologia de ponta
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group relative overflow-hidden bg-black/40 border-white/10 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-xs text-blue-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Section - Takes 1 column */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="sticky top-8"
              >
                <Card className="bg-black/40 border-white/10 backdrop-blur-xl p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Fale Conosco
                  </h2>
                  <p className="text-gray-400 mb-6">Vamos transformar sua ideia em realidade</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Seu Nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <Input
                        type="email"
                        placeholder="Seu E-mail"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <Textarea
                        placeholder="Sua Mensagem"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          Enviar Mensagem
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Contact Info */}
                  <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300">
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">contato@gvsoftware.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300">
                      <Phone className="w-5 h-5" />
                      <span className="text-sm">(11) 9999-9999</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300">
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm">São Paulo, SP - Brasil</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="border-t border-white/10 bg-black/20 backdrop-blur-xl mt-16"
        >
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">© 2025 GV Software. Todos os direitos reservados.</p>
                <p className="text-gray-500 text-xs mt-1">Transformando ideias em realidade digital</p>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-110"
                >
                  <Github className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                </a>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Send } from "lucide-react"
import type { Project, Proposal } from "@/lib/types/database"

interface ProposalFormProps {
  project: Project
  existingProposal?: Proposal
}

export function ProposalForm({ project, existingProposal }: ProposalFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientEmail, setClientEmail] = useState("")

  const [content, setContent] = useState(
    existingProposal?.content ||
      `Prezado(a) Cliente,

Segue abaixo nossa proposta para o projeto "${project.title}".

## Descrição do Projeto

${project.description}

## Prazo de Entrega

Data prevista: ${new Date(project.deadline).toLocaleDateString("pt-BR")}

## Valor do Investimento

${
  project.total_value
    ? `Valor Total: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(project.total_value)}`
    : "A combinar"
}

## Forma de Pagamento

[Descreva aqui as condições de pagamento]

## Escopo do Projeto

[Liste aqui as entregas e funcionalidades incluídas]

## Termos e Condições

[Adicione termos importantes, garantias, suporte, etc.]

Ficamos à disposição para esclarecimentos.

Atenciosamente,
GV Software`,
  )

  const handleSaveDraft = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const proposalData = {
        project_id: project.id,
        content,
        status: "draft" as const,
      }

      if (existingProposal) {
        const { error } = await supabase.from("proposals").update(proposalData).eq("id", existingProposal.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("proposals").insert(proposalData)

        if (error) throw error
      }

      router.push(`/dashboard/projects/${project.id}`)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar proposta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendProposal = async () => {
    if (!clientEmail) {
      setError("Por favor, informe o email do cliente")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // First, create or get the client profile
      const { data: clientProfile, error: clientError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", clientEmail)
        .single()

      let clientId = clientProfile?.id

      if (!clientProfile) {
        // Create a client profile (they'll need to sign up later)
        const { data: newClient, error: newClientError } = await supabase
          .from("profiles")
          .insert({
            email: clientEmail,
            role: "client" as const,
          })
          .select()
          .single()

        if (newClientError) throw newClientError
        clientId = newClient.id
      }

      // Update project with client
      const { error: projectError } = await supabase
        .from("projects")
        .update({ client_id: clientId })
        .eq("id", project.id)

      if (projectError) throw projectError

      // Save or update proposal
      const proposalData = {
        project_id: project.id,
        content,
        status: "sent" as const,
        sent_at: new Date().toISOString(),
      }

      let proposalId = existingProposal?.id

      if (existingProposal) {
        const { error } = await supabase.from("proposals").update(proposalData).eq("id", existingProposal.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("proposals").insert(proposalData).select().single()

        if (error) throw error
        proposalId = data.id
      }

      // Update project status
      const { error: statusError } = await supabase
        .from("projects")
        .update({ status: "proposal_sent" as const })
        .eq("id", project.id)

      if (statusError) throw statusError

      // In a real app, you would send an email here
      // For now, we'll just show a success message
      alert(
        `Proposta enviada com sucesso!\n\nLink para o cliente: ${window.location.origin}/proposals/${proposalId}/view?token=${clientId}`,
      )

      router.push(`/dashboard/projects/${project.id}`)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao enviar proposta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposta Comercial</CardTitle>
        <CardDescription>Crie e personalize a proposta para o cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Editar</TabsTrigger>
            <TabsTrigger value="preview">Visualizar</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo da Proposta</Label>
              <Textarea
                id="content"
                rows={20}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Suporta Markdown para formatação</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email do Cliente</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="cliente@email.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-4">
              <Button
                onClick={handleSaveDraft}
                disabled={isLoading}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <FileText className="mr-2 h-4 w-4" />
                Salvar Rascunho
              </Button>
              <Button onClick={handleSendProposal} disabled={isLoading} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Enviando..." : "Enviar Proposta"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {content.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) {
                      return (
                        <h2 key={i} className="text-xl font-bold mt-6 mb-3">
                          {line.replace("## ", "")}
                        </h2>
                      )
                    }
                    if (line.startsWith("# ")) {
                      return (
                        <h1 key={i} className="text-2xl font-bold mt-6 mb-4">
                          {line.replace("# ", "")}
                        </h1>
                      )
                    }
                    if (line.trim() === "") {
                      return <br key={i} />
                    }
                    return (
                      <p key={i} className="mb-2">
                        {line}
                      </p>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

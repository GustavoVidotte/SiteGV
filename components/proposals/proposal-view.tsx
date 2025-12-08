"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Calendar, DollarSign } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProposalViewProps {
  proposal: any
  isValidToken: boolean
}

export function ProposalView({ proposal, isValidToken }: ProposalViewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const handleAccept = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Update proposal status
      const { error: proposalError } = await supabase
        .from("proposals")
        .update({
          status: "accepted",
          responded_at: new Date().toISOString(),
        })
        .eq("id", proposal.id)

      if (proposalError) throw proposalError

      // Update project status
      const { error: projectError } = await supabase
        .from("projects")
        .update({ status: "accepted" })
        .eq("id", proposal.project_id)

      if (projectError) throw projectError

      alert("Proposta aceita com sucesso! Entraremos em contato em breve.")
      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erro ao aceitar proposta")
    } finally {
      setIsLoading(false)
      setShowAcceptDialog(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Update proposal status
      const { error: proposalError } = await supabase
        .from("proposals")
        .update({
          status: "rejected",
          responded_at: new Date().toISOString(),
        })
        .eq("id", proposal.id)

      if (proposalError) throw proposalError

      // Update project status
      const { error: projectError } = await supabase
        .from("projects")
        .update({ status: "cancelled" })
        .eq("id", proposal.project_id)

      if (projectError) throw projectError

      alert("Proposta recusada. Obrigado pelo seu tempo.")
      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erro ao recusar proposta")
    } finally {
      setIsLoading(false)
      setShowRejectDialog(false)
    }
  }

  const statusLabels = {
    draft: "Rascunho",
    sent: "Enviada",
    accepted: "Aceita",
    rejected: "Recusada",
  }

  const statusColors = {
    draft: "bg-gray-500",
    sent: "bg-blue-500",
    accepted: "bg-green-500",
    rejected: "bg-red-500",
  }

  const canRespond = isValidToken && (proposal.status === "sent" || proposal.status === "draft")

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <Card>
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge className={statusColors[proposal.status as keyof typeof statusColors]}>
              {statusLabels[proposal.status as keyof typeof statusLabels]}
            </Badge>
          </div>
          <CardTitle className="text-3xl">Proposta Comercial</CardTitle>
          {proposal.project.creator && (
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold">{proposal.project.creator.company_name || "GV Software"}</p>
              <p>{proposal.project.creator.email}</p>
            </div>
          )}
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{proposal.project.title}</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Prazo: {new Date(proposal.project.deadline).toLocaleDateString("pt-BR")}</span>
            </div>
            {proposal.project.total_value && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(proposal.project.total_value)}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {proposal.content.split("\n").map((line: string, i: number) => {
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

      {canRespond && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button onClick={() => setShowAcceptDialog(true)} disabled={isLoading} className="flex-1" size="lg">
                <Check className="mr-2 h-5 w-5" />
                Aceitar Proposta
              </Button>
              <Button
                onClick={() => setShowRejectDialog(true)}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <X className="mr-2 h-5 w-5" />
                Recusar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isValidToken && proposal.status === "sent" && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Link inválido ou expirado. Entre em contato com o remetente.</p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aceitar Proposta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja aceitar esta proposta? Esta ação irá iniciar o projeto e você receberá mais
              informações por email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept}>Confirmar Aceitação</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recusar Proposta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja recusar esta proposta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-destructive">
              Confirmar Recusa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

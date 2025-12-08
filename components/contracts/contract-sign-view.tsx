"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, FileText } from "lucide-react"
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

interface ContractSignViewProps {
  contract: any
  isValidToken: boolean
}

export function ContractSignView({ contract, isValidToken }: ContractSignViewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSignDialog, setShowSignDialog] = useState(false)
  const [signatureName, setSignatureName] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const statusLabels = {
    draft: "Rascunho",
    sent: "Aguardando Assinatura",
    signed: "Assinado",
    cancelled: "Cancelado",
  }

  const statusColors = {
    draft: "bg-gray-500",
    sent: "bg-blue-500",
    signed: "bg-green-500",
    cancelled: "bg-red-500",
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleSign = async () => {
    if (!signatureName.trim()) {
      alert("Por favor, digite seu nome completo")
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const signatureData = canvas.toDataURL()

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Update contract status
      const { error: contractError } = await supabase
        .from("contracts")
        .update({
          status: "signed",
          signed_at: new Date().toISOString(),
          signature_data: signatureData,
        })
        .eq("id", contract.id)

      if (contractError) throw contractError

      // Update project status to in_progress
      const { error: projectError } = await supabase
        .from("projects")
        .update({ status: "in_progress" })
        .eq("id", contract.project_id)

      if (projectError) throw projectError

      alert("Contrato assinado com sucesso! O projeto foi iniciado.")
      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erro ao assinar contrato")
    } finally {
      setIsLoading(false)
      setShowSignDialog(false)
    }
  }

  const canSign = isValidToken && contract.status === "sent"

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <Card>
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge className={statusColors[contract.status as keyof typeof statusColors]}>
              {statusLabels[contract.status as keyof typeof statusLabels]}
            </Badge>
          </div>
          <CardTitle className="text-3xl">Contrato de Prestação de Serviços</CardTitle>
          {contract.project.creator && (
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold">{contract.project.creator.company_name || "GV Software"}</p>
              <p>{contract.project.creator.email}</p>
            </div>
          )}
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Projeto: {contract.project.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-serif border rounded-lg p-6 bg-muted/50">
            {contract.content}
          </div>
        </CardContent>
      </Card>

      {canSign && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={() => setShowSignDialog(true)} disabled={isLoading} className="w-full" size="lg">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Assinar Contrato
            </Button>
          </CardContent>
        </Card>
      )}

      {contract.status === "signed" && (
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <p className="font-semibold">Contrato Assinado com Sucesso</p>
            <p className="text-sm text-muted-foreground">
              Assinado em: {new Date(contract.signed_at).toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>
      )}

      {!isValidToken && contract.status === "sent" && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Link inválido ou expirado. Entre em contato com o remetente.</p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Assinar Contrato</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, digite seu nome completo e faça sua assinatura abaixo
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signatureName">Nome Completo</Label>
              <Input
                id="signatureName"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label>Assinatura</Label>
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="border rounded-lg cursor-crosshair bg-white w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                Limpar Assinatura
              </Button>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSign}>Confirmar Assinatura</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

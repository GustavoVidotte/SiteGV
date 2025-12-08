"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Send } from "lucide-react"
import type { Contract } from "@/lib/types/database"

interface ContractFormProps {
  project: any
  existingContract?: Contract
}

export function ContractForm({ project, existingContract }: ContractFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const [content, setContent] = useState(
    existingContract?.content ||
      `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE SOFTWARE

Pelo presente instrumento particular de contrato de prestação de serviços, de um lado:

CONTRATANTE: ${project.client?.full_name || "[Nome do Cliente]"}
${project.client?.company_name ? `Empresa: ${project.client.company_name}` : ""}
Email: ${project.client?.email || "[email do cliente]"}

E de outro lado:

CONTRATADA: GV Software
Email: contato@gvsoftware.com

Têm entre si justo e contratado o seguinte:

═══════════════════════════════════════════════════════════

CLÁUSULA PRIMEIRA - DO OBJETO

1.1. O presente contrato tem como objeto a prestação de serviços de desenvolvimento de software, conforme especificações do projeto "${project.title}".

1.2. Descrição dos serviços:
${project.description}

═══════════════════════════════════════════════════════════

CLÁUSULA SEGUNDA - DO PRAZO

2.1. O prazo para execução dos serviços é de até ${new Date(project.deadline).toLocaleDateString("pt-BR")}.

2.2. O prazo poderá ser prorrogado mediante acordo entre as partes, formalizado por escrito.

═══════════════════════════════════════════════════════════

CLÁUSULA TERCEIRA - DO VALOR E FORMA DE PAGAMENTO

3.1. O valor total dos serviços é de ${
        project.total_value
          ? new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(project.total_value)
          : "[Valor a definir]"
      }.

3.2. O pagamento será realizado conforme as seguintes condições:
- [Descrever forma de pagamento: à vista, parcelado, por etapa, etc.]
- [Definir método de pagamento: transferência bancária, cartão, boleto, etc.]

═══════════════════════════════════════════════════════════

CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATADA

4.1. Executar os serviços com qualidade e dentro dos padrões técnicos exigidos.

4.2. Manter sigilo sobre todas as informações do CONTRATANTE.

4.3. Realizar testes e validações antes da entrega final.

4.4. Fornecer documentação técnica do projeto.

4.5. Prestar suporte técnico pelo período de [definir período] após a entrega.

═══════════════════════════════════════════════════════════

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO CONTRATANTE

5.1. Fornecer todas as informações necessárias para a execução dos serviços.

5.2. Realizar os pagamentos nas datas acordadas.

5.3. Avaliar e aprovar as entregas dentro de [definir prazo] dias úteis.

5.4. Designar um responsável para acompanhamento do projeto.

═══════════════════════════════════════════════════════════

CLÁUSULA SEXTA - DA PROPRIEDADE INTELECTUAL

6.1. Todos os direitos autorais e de propriedade intelectual sobre o software desenvolvido serão transferidos ao CONTRATANTE após a quitação integral dos valores.

6.2. A CONTRATADA poderá utilizar o projeto desenvolvido em seu portfólio, salvo acordo de confidencialidade específico.

═══════════════════════════════════════════════════════════

CLÁUSULA SÉTIMA - DA CONFIDENCIALIDADE

7.1. As partes se comprometem a manter sigilo sobre todas as informações confidenciais trocadas durante a execução do contrato.

7.2. A quebra de confidencialidade sujeitará a parte infratora às penalidades legais cabíveis.

═══════════════════════════════════════════════════════════

CLÁUSULA OITAVA - DA RESCISÃO

8.1. O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.

8.2. Em caso de rescisão, os serviços já executados deverão ser pagos proporcionalmente.

8.3. O descumprimento de qualquer cláusula autoriza a rescisão imediata do contrato.

═══════════════════════════════════════════════════════════

CLÁUSULA NONA - DAS DISPOSIÇÕES GERAIS

9.1. Qualquer alteração deste contrato deverá ser feita por escrito e assinada por ambas as partes.

9.2. As partes elegem o foro da comarca de [Cidade/Estado] para dirimir quaisquer dúvidas oriundas deste contrato.

═══════════════════════════════════════════════════════════

E por estarem assim justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma.

${today}

_________________________________
CONTRATANTE
${project.client?.full_name || "[Nome do Cliente]"}

_________________________________
CONTRATADA
GV Software`,
  )

  const handleSaveDraft = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const contractData = {
        project_id: project.id,
        content,
        status: "draft" as const,
      }

      if (existingContract) {
        const { error } = await supabase.from("contracts").update(contractData).eq("id", existingContract.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("contracts").insert(contractData)

        if (error) throw error
      }

      router.push(`/dashboard/projects/${project.id}`)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar contrato")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendContract = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const contractData = {
        project_id: project.id,
        content,
        status: "sent" as const,
      }

      let contractId = existingContract?.id

      if (existingContract) {
        const { error } = await supabase.from("contracts").update(contractData).eq("id", existingContract.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("contracts").insert(contractData).select().single()

        if (error) throw error
        contractId = data.id
      }

      // In a real app, you would send an email here
      alert(
        `Contrato enviado com sucesso!\n\nLink para o cliente: ${window.location.origin}/contracts/${contractId}/sign?token=${project.client_id}`,
      )

      router.push(`/dashboard/projects/${project.id}`)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao enviar contrato")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrato de Prestação de Serviços</CardTitle>
        <CardDescription>Crie e personalize o contrato para o cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Editar</TabsTrigger>
            <TabsTrigger value="preview">Visualizar</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo do Contrato</Label>
              <Textarea
                id="content"
                rows={25}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="font-mono text-sm"
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
              <Button onClick={handleSendContract} disabled={isLoading} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Enviando..." : "Enviar para Assinatura"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-serif">
                  {content}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, DollarSign, FileText } from "lucide-react"
import { createCheckoutSession, checkPaymentStatus } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentCheckoutProps {
  project: any
  contract: any
  existingPayment: any
}

export function PaymentCheckout({ project, contract, existingPayment }: PaymentCheckoutProps) {
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  const fetchClientSecret = useCallback(async () => {
    if (existingPayment?.stripe_session_id && existingPayment.status === "pending") {
      // Check if payment was completed
      setIsCheckingStatus(true)
      const status = await checkPaymentStatus(existingPayment.stripe_session_id)
      setIsCheckingStatus(false)

      if (status.status === "paid") {
        window.location.reload()
        return null
      }
    }

    return createCheckoutSession(project.id, contract.id)
  }, [project.id, contract.id, existingPayment])

  if (existingPayment?.status === "completed") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <CardTitle className="text-2xl">Pagamento Concluído</CardTitle>
            <CardDescription>O pagamento foi processado com sucesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Valor Pago</p>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(existingPayment.amount)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Data do Pagamento</p>
                <p className="text-lg font-semibold">{new Date(existingPayment.paid_at).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Pagamento</CardTitle>
          <CardDescription>Projeto: {project.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Valor Total:</span>
            </div>
            <span className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(project.total_value)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Contrato assinado em {new Date(contract.signed_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checkout Seguro</CardTitle>
          <CardDescription>Processado via Stripe com segurança total</CardDescription>
        </CardHeader>
        <CardContent>
          {isCheckingStatus ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Verificando status do pagamento...</p>
            </div>
          ) : (
            <div id="checkout">
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

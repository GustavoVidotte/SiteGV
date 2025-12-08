"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function createCheckoutSession(projectId: string, contractId: string) {
  const supabase = await createClient()

  // Get project details
  const { data: project, error } = await supabase
    .from("projects")
    .select("*, client:profiles!projects_client_id_fkey(email)")
    .eq("id", projectId)
    .single()

  if (error || !project || !project.total_value) {
    throw new Error("Projeto não encontrado ou sem valor definido")
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: `Projeto: ${project.title}`,
            description: project.description,
          },
          unit_amount: Math.round(project.total_value * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      project_id: projectId,
      contract_id: contractId,
    },
    customer_email: project.client?.email,
  })

  // Create payment record
  await supabase.from("payments").insert({
    project_id: projectId,
    contract_id: contractId,
    amount: project.total_value,
    status: "pending",
    stripe_session_id: session.id,
  })

  return session.client_secret
}

export async function checkPaymentStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status === "paid") {
    const supabase = await createClient()

    // Update payment status
    const { data: payment } = await supabase
      .from("payments")
      .update({
        status: "completed",
        stripe_payment_intent_id: session.payment_intent as string,
        paid_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", sessionId)
      .select()
      .single()

    if (payment) {
      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}-${payment.project_id.slice(0, 8).toUpperCase()}`

      // Create invoice
      await supabase.from("invoices").insert({
        payment_id: payment.id,
        project_id: payment.project_id,
        invoice_number: invoiceNumber,
        amount: payment.amount,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date().toISOString().split("T")[0],
        status: "paid",
      })

      // Update project status to completed
      await supabase.from("projects").update({ status: "completed" }).eq("id", payment.project_id)
    }
  }

  return {
    status: session.payment_status,
    customer_email: session.customer_email,
  }
}

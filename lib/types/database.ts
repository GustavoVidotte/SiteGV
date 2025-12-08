export interface Profile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  role: "admin" | "manager" | "client"
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  deadline: string
  status: "draft" | "proposal_sent" | "accepted" | "in_progress" | "completed" | "cancelled"
  created_by: string
  client_id: string | null
  total_value: number | null
  created_at: string
  updated_at: string
}

export interface Proposal {
  id: string
  project_id: string
  content: string
  status: "draft" | "sent" | "accepted" | "rejected"
  sent_at: string | null
  responded_at: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  assigned_to: string | null
  status: "todo" | "in_progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  project_id: string
  content: string
  status: "draft" | "sent" | "signed" | "cancelled"
  signed_at: string | null
  signature_data: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  project_id: string
  contract_id: string | null
  amount: number
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  payment_id: string
  project_id: string
  invoice_number: string
  amount: number
  issue_date: string
  due_date: string
  pdf_url: string | null
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  created_at: string
  updated_at: string
}

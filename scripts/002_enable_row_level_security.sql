-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view projects they created or are clients of" ON public.projects
  FOR SELECT USING (
    auth.uid() = created_by OR 
    auth.uid() = client_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Proposals policies
CREATE POLICY "Users can view proposals for their projects" ON public.proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND (created_by = auth.uid() OR client_id = auth.uid())
    )
  );

CREATE POLICY "Users can create proposals for their projects" ON public.proposals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update proposals for their projects" ON public.proposals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND (created_by = auth.uid() OR client_id = auth.uid())
    )
  );

-- Tasks policies
CREATE POLICY "Users can view tasks for their projects" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND (created_by = auth.uid() OR client_id = auth.uid())
    ) OR assigned_to = auth.uid()
  );

CREATE POLICY "Users can create tasks for their projects" ON public.tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks" ON public.tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    ) OR assigned_to = auth.uid()
  );

CREATE POLICY "Users can delete tasks for their projects" ON public.tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

-- Contracts policies
CREATE POLICY "Users can view contracts for their projects" ON public.contracts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND (created_by = auth.uid() OR client_id = auth.uid())
    )
  );

CREATE POLICY "Users can create contracts for their projects" ON public.contracts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update contracts" ON public.contracts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND (created_by = auth.uid() OR client_id = auth.uid())
    )
  );

-- Payments policies
CREATE POLICY "Users can view payments for their projects" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND (created_by = auth.uid() OR client_id = auth.uid())
    )
  );

CREATE POLICY "Users can create payments for their projects" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update payments" ON public.payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND (created_by = auth.uid() OR client_id = auth.uid())
    )
  );

-- Invoices policies
CREATE POLICY "Users can view invoices for their projects" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND (created_by = auth.uid() OR client_id = auth.uid())
    )
  );

CREATE POLICY "Users can create invoices" ON public.invoices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update invoices" ON public.invoices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

-- Corrigir políticas RLS para portfolio_projects permitir operações de admin

-- Remover políticas existentes
DROP POLICY IF EXISTS "Admin can delete projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Admin can insert projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Admin can update projects" ON portfolio_projects;

-- Criar novas políticas que permitem usuários autenticados
CREATE POLICY "Authenticated users can insert projects" ON portfolio_projects
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects" ON portfolio_projects
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects" ON portfolio_projects
FOR DELETE TO authenticated
USING (true);

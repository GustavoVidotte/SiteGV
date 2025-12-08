-- Habilitar RLS na tabela portfolio_contacts se ainda não estiver
ALTER TABLE portfolio_contacts ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para recriar
DROP POLICY IF EXISTS "Allow public insert" ON portfolio_contacts;
DROP POLICY IF EXISTS "Allow authenticated read" ON portfolio_contacts;
DROP POLICY IF EXISTS "Allow authenticated update" ON portfolio_contacts;
DROP POLICY IF EXISTS "Allow authenticated delete" ON portfolio_contacts;

-- Permitir que qualquer pessoa insira (formulário de contato público)
CREATE POLICY "Allow public insert" ON portfolio_contacts
FOR INSERT TO public
WITH CHECK (true);

-- Permitir que usuários autenticados leiam
CREATE POLICY "Allow authenticated read" ON portfolio_contacts
FOR SELECT TO authenticated
USING (true);

-- Permitir que usuários autenticados atualizem (marcar como lido)
CREATE POLICY "Allow authenticated update" ON portfolio_contacts
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Permitir que usuários autenticados deletem
CREATE POLICY "Allow authenticated delete" ON portfolio_contacts
FOR DELETE TO authenticated
USING (true);

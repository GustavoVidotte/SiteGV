-- Tabela para projetos do portfólio
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para habilidades/tecnologias
CREATE TABLE IF NOT EXISTS portfolio_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#8B5CF6',
  category TEXT DEFAULT 'frontend',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para informações "Sobre"
CREATE TABLE IF NOT EXISTS portfolio_about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  projects_count INTEGER DEFAULT 0,
  clients_count INTEGER DEFAULT 0,
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para feedbacks de clientes
CREATE TABLE IF NOT EXISTS portfolio_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_email TEXT,
  client_photo TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  project_name TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para contatos recebidos
CREATE TABLE IF NOT EXISTS portfolio_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  budget TEXT,
  deadline TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_contacts ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (portfólio é público)
CREATE POLICY "Public read access for projects" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Public read access for skills" ON portfolio_skills FOR SELECT USING (true);
CREATE POLICY "Public read access for about" ON portfolio_about FOR SELECT USING (true);
CREATE POLICY "Public read access for approved feedbacks" ON portfolio_feedbacks FOR SELECT USING (is_approved = true);

-- Políticas para inserção pública (feedbacks e contatos)
CREATE POLICY "Anyone can submit feedback" ON portfolio_feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit contact" ON portfolio_contacts FOR INSERT WITH CHECK (true);

-- Políticas para admin (usuários autenticados)
CREATE POLICY "Admin can insert projects" ON portfolio_projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update projects" ON portfolio_projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete projects" ON portfolio_projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can insert skills" ON portfolio_skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update skills" ON portfolio_skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete skills" ON portfolio_skills FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can insert about" ON portfolio_about FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update about" ON portfolio_about FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admin can read all feedbacks" ON portfolio_feedbacks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can update feedbacks" ON portfolio_feedbacks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete feedbacks" ON portfolio_feedbacks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can read contacts" ON portfolio_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can update contacts" ON portfolio_contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete contacts" ON portfolio_contacts FOR DELETE TO authenticated USING (true);

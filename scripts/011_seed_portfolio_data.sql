-- Inserir dados iniciais na tabela about
INSERT INTO portfolio_about (title, description, projects_count, clients_count, years_experience)
VALUES (
  'Sobre a GV Software',
  'Somos uma empresa especializada em desenvolvimento de software, focada em criar soluções digitais inovadoras que impulsionam o crescimento do seu negócio. Com expertise em tecnologias modernas e foco na experiência do usuário, transformamos ideias em realidade digital.',
  50,
  30,
  5
);

-- Inserir habilidades iniciais
INSERT INTO portfolio_skills (name, icon, color, category, display_order) VALUES
('React', 'react', '#61DAFB', 'frontend', 1),
('Next.js', 'nextjs', '#000000', 'frontend', 2),
('TypeScript', 'typescript', '#3178C6', 'frontend', 3),
('Node.js', 'nodejs', '#339933', 'backend', 4),
('Tailwind CSS', 'tailwind', '#06B6D4', 'frontend', 5),
('PostgreSQL', 'postgresql', '#4169E1', 'database', 6),
('Supabase', 'supabase', '#3ECF8E', 'database', 7),
('Figma', 'figma', '#F24E1E', 'design', 8),
('Python', 'python', '#3776AB', 'backend', 9),
('Docker', 'docker', '#2496ED', 'devops', 10);

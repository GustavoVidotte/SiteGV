-- Seed portfolio_projects with existing website projects
INSERT INTO portfolio_projects (title, description, image_url, technologies, is_featured, display_order)
VALUES 
  ('Dashboard de Gestão Empresarial', 'Plataforma completa para gestão de negócios com análise de dados em tempo real', '/modern-business-management-dashboard.jpg', ARRAY['React', 'Node.js', 'PostgreSQL', 'Chart.js'], true, 1),
  ('E-commerce Moderno', 'Loja virtual com carrinho, pagamentos e painel administrativo completo', '/modern-ecommerce-platform.png', ARRAY['Next.js', 'Stripe', 'MongoDB', 'Tailwind'], true, 2),
  ('App de Produtividade', 'Aplicativo mobile e web para gerenciamento de tarefas e projetos', '/productivity-app-interface.png', ARRAY['React Native', 'Firebase', 'TypeScript'], true, 3),
  ('Sistema de Automação Industrial', 'Dashboard para monitoramento e controle de processos industriais', '/industrial-automation-dashboard.jpg', ARRAY['Python', 'IoT', 'Real-time', 'Dashboard'], false, 4),
  ('Plataforma de Ensino Online', 'Sistema completo de EAD com vídeos, quizzes e certificados', '/online-education-platform.png', ARRAY['Next.js', 'Video.js', 'Supabase', 'Auth'], false, 5),
  ('Analytics Dashboard', 'Painel de análise de métricas com visualizações interativas', '/analytics-dashboard-modern-charts.jpg', ARRAY['React', 'D3.js', 'API', 'Charts'], false, 6)
ON CONFLICT DO NOTHING;

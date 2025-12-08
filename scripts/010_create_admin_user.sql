-- Inserir usuário admin na tabela profiles
-- IMPORTANTE: Primeiro você precisa criar o usuário via Supabase Auth
-- Acesse a página /admin/signup para criar o usuário

-- Este script será executado após o usuário ser criado via Auth
-- O trigger automático já deve criar o profile, mas caso precise atualizar o role:

UPDATE profiles 
SET role = 'admin', 
    full_name = 'GV Software Admin',
    company_name = 'GV Software'
WHERE email = 'contato.gvsoftware@gmail.com';

-- Se o profile não existir, inserir manualmente (use o UUID do usuário criado no Auth)
-- INSERT INTO profiles (id, email, full_name, company_name, role) 
-- VALUES ('UUID_DO_USUARIO', 'contato.gvsoftware@gmail.com', 'GV Software Admin', 'GV Software', 'admin');

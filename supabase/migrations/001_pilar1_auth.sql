-- =====================================================
-- PILAR 1 — Autenticação e Controle de Acesso
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Enum de perfis
CREATE TYPE user_role AS ENUM ('ADMIN', 'OPERADOR', 'VENDEDOR', 'FINANCEIRO');

-- Tabela de usuários (espelha auth.users com perfil de negócio)
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        VARCHAR(150) NOT NULL,
  email       VARCHAR(200) UNIQUE NOT NULL,
  role        user_role NOT NULL DEFAULT 'OPERADOR',
  ativo       BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: usuário só lê o próprio perfil (Admin lê todos)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário lê o próprio perfil"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin lê todos os usuários"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admin gerencia usuários"
  ON public.users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- APÓS RODAR ESTE SCRIPT:
-- 1. Vá em Authentication > Users no painel do Supabase
-- 2. Clique em "Add user" e crie seu Admin
-- 3. Copie o UUID do usuário criado
-- 4. Execute o INSERT abaixo substituindo os valores:
-- =====================================================

-- INSERT INTO public.users (id, nome, email, role)
-- VALUES (
--   'UUID-DO-USUARIO-AQUI',
--   'Admin',
--   'seu-email@exemplo.com',
--   'ADMIN'
-- );

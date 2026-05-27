-- Adiciona código identificador único às categorias
ALTER TABLE public.categories ADD COLUMN codigo VARCHAR(20) UNIQUE NOT NULL DEFAULT '';

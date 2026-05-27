# Controle de Estoque

Sistema de gerenciamento de inventário desenvolvido para uma loja física de materiais de limpeza.

## Origem

Este projeto nasceu de uma necessidade real: o negócio do meu pai precisava de um sistema de controle de estoque mais moderno e confiável. Em vez de depender de planilhas ou softwares genéricos, decidi construir uma solução do zero — adaptada exatamente ao fluxo de operação da loja.

O sistema controla entradas, saídas, ajustes de inventário e devoluções, com rastreabilidade completa por produto e variação (tamanho, cor), integração futura com Nota Fiscal SEFAZ, e relatórios operacionais e financeiros.

> Desenvolvido com auxílio de IA (Claude — Anthropic).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js (App Router) + React + Tailwind CSS |
| Backend | Next.js Server Actions + API Routes |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Validação | Zod |
| Linguagem | TypeScript |

---

## Status do Projeto

| Pilar | Descrição | Status |
|---|---|---|
| 1 | Autenticação e Controle de Acesso | ✅ Concluído |
| 2 | Cadastro de Produtos e SKUs | 🔧 Em desenvolvimento |
| 3 | Movimentações de Estoque | ⏳ Pendente |
| 4 | Importação de NF-e | ⏳ Pendente |
| 5 | Inventário Periódico | ⏳ Pendente |
| 6 | Alertas e Notificações | ⏳ Pendente |
| 7 | Relatórios e Analytics | ⏳ Pendente |

---

## Como rodar localmente

**Pré-requisitos:** Node.js 18+ e uma conta no [Supabase](https://supabase.com)

```bash
# 1. Clone o repositório
git clone https://github.com/VictorRoxinho/controle-estoque.git
cd controle-estoque

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env.local na raiz com:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
# APP_URL=http://localhost:3000
# NODE_ENV=development

# 4. Execute as migrações SQL
# Rode os arquivos em supabase/migrations/ no SQL Editor do Supabase

# 5. Inicie o servidor
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

> O acesso é restrito — o usuário Admin é criado diretamente no painel do Supabase.

---

## Licença

Uso privado. Todos os direitos reservados.

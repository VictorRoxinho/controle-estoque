# SISTEMA DE CONTROLE DE ESTOQUE — DOCUMENTO DE CONTEXTO GERAL

> Versão: 1.0  
> Tipo de negócio: Varejo físico — materiais de limpeza  
> Stack: Node.js + TypeScript · Next.js + React · Supabase (PostgreSQL)  
> Última atualização: 2026-05-27

---

## 1. OBJETIVO DO SISTEMA

Controlar com precisão o estoque de uma loja física de materiais de limpeza — registrando entradas (compras/recebimentos), saídas (vendas), ajustes de inventário e devoluções —, garantindo rastreabilidade completa por produto e variação (tamanho, cor, NCM), integrando com Nota Fiscal SEFAZ, e fornecendo relatórios operacionais e financeiros que suportem decisões de compra, precificação e auditoria.

O sistema **não é um PDV**. Ele é o módulo de estoque que alimenta e é alimentado pelo fluxo comercial da loja.

---

## 2. ARQUITETURA CONCEITUAL

**Event-sourcing leve com CRUD estruturado.**

- Toda alteração de quantidade em estoque é uma **movimentação imutável** (append-only). O saldo é sempre calculado ou mantido por trigger/função a partir dessas movimentações.
- Não existe "editar quantidade diretamente". Toda correção passa por um movimento do tipo `AJUSTE`.
- O banco de dados é a fonte da verdade absoluta. Nenhum estado de estoque vive apenas na memória da aplicação.
- NF-e/NF-C-e são **eventos externos** que disparam movimentações internas — nunca o contrário.

---

## 3. REGRAS DE NEGÓCIO CENTRAIS

1. **Saldo nunca pode ser negativo** — a saída deve ser bloqueada se `quantidade_disponivel < quantidade_solicitada`, salvo ajuste explícito autorizado por Gerente/Admin.
2. **Toda movimentação tem um responsável** — `user_id` obrigatório em todos os registros de movimento.
3. **Variações são tratadas como SKUs distintos** — um produto "Detergente 500ml Azul" e "Detergente 500ml Amarelo" são SKUs diferentes com saldos independentes.
4. **NCM é atributo do produto-pai**, não da variação — todas as variações de um produto herdam o NCM.
5. **Ajuste de inventário requer justificativa textual** — sem justificativa, o sistema rejeita.
6. **NF-e de entrada gera movimentação automaticamente** — após importação do XML, o operador confirma; só então o estoque é creditado.
7. **Preço de custo é registrado por movimentação de entrada** — o sistema calcula custo médio ponderado (CMV) automaticamente.
8. **Nenhum produto pode ser deletado** — apenas desativado (`ativo = false`). Histórico é permanente.
9. **Logs de auditoria são gerados para toda operação** — incluindo tentativas bloqueadas pelo sistema.
10. **Estoque mínimo é configurável por SKU** — abaixo do mínimo, alerta é gerado automaticamente.

---

## 4. FLUXO GERAL DE OPERAÇÃO

```
[Compra aprovada]
      │
      ▼
[Importação XML NF-e] ──► [Validação SEFAZ] ──► [Pré-lançamento pendente]
      │
      ▼ (operador confirma recebimento físico)
[Movimentação ENTRADA criada] ──► [Saldo atualizado] ──► [Custo médio recalculado]

[Venda realizada na loja]
      │
      ▼
[Registro de SAÍDA por SKU + quantidade]
      │
      ├──► [Validação de saldo disponível]
      │         └── [BLOQUEIO se saldo insuficiente]
      │
      ▼
[Movimentação SAÍDA criada] ──► [Saldo atualizado] ──► [CMV registrado]

[Inventário periódico]
      │
      ▼
[Contagem física registrada por SKU]
      │
      ▼
[Sistema compara contagem física vs. saldo contábil]
      │
      ▼
[Diferenças viram movimentações de AJUSTE com justificativa obrigatória]
```

---

## 5. CONCEITOS CENTRAIS

| Conceito | Definição |
|---|---|
| **Fonte da verdade** | Banco de dados PostgreSQL (Supabase) |
| **Produto** | Entidade pai com NCM, categoria, fornecedor padrão |
| **SKU (Variação)** | Combinação produto + tamanho + cor. Tem saldo próprio |
| **Movimentação** | Registro imutável de qualquer alteração de saldo (ENTRADA, SAÍDA, AJUSTE, DEVOLUÇÃO) |
| **Saldo disponível** | Calculado: `SUM(entradas) - SUM(saídas + ajustes negativos) + SUM(ajustes positivos)` |
| **Custo médio ponderado** | Recalculado a cada entrada: `(saldo_atual × custo_atual + qtd_nova × custo_novo) / (saldo_atual + qtd_nova)` |
| **Estoque mínimo** | Limite por SKU abaixo do qual um alerta de ressuprimento é disparado |
| **O que NUNCA pode acontecer** | Saldo negativo sem autorização · Movimentação sem responsável · Deleção de produto ou movimentação · Edição direta de saldo |

---

## 6. PERFIS DE USUÁRIO E PERMISSÕES

| Perfil | Pode fazer |
|---|---|
| **Admin/Gerente** | Tudo, incluindo ajustes, cadastro de produtos, relatórios financeiros, autorizar saldo negativo |
| **Operador de Estoque** | Registrar entrada, saída, iniciar inventário, importar NF-e |
| **Vendedor** | Consultar saldo por SKU, registrar saída (venda balcão) — sem acesso a custos ou relatórios financeiros |
| **Financeiro/Compras** | Consultar CMV, relatórios de custo, aprovar ordens de compra, sem registrar movimentações |

---

## 7. TECNOLOGIAS E VARIÁVEIS DE AMBIENTE

### Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14+ (App Router) + React + TailwindCSS |
| Backend/API | Next.js API Routes ou Node.js separado (TypeScript) |
| Banco de dados | Supabase (PostgreSQL 15+) |
| Autenticação | Supabase Auth (JWT) |
| Integração NF-e | Biblioteca de parse XML (NF-e 4.0) + validação de chave SEFAZ |
| Filas/Jobs | Supabase Edge Functions ou pg_cron (alertas, relatórios assíncronos) |
| Storage | Supabase Storage (XMLs de NF-e, PDFs de relatórios) |

### Variáveis de Ambiente (.env)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
APP_URL=
NODE_ENV=

# NF-e / SEFAZ
SEFAZ_AMBIENTE=producao|homologacao
SEFAZ_CONSULTA_URL=
SEFAZ_TIMEOUT_MS=

# Alertas
ALERT_EMAIL_FROM=
ALERT_EMAIL_TO=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Segurança
JWT_SECRET=
SESSION_EXPIRY_HOURS=
```

---

---

# SCHEMA DO BANCO DE DADOS

> Banco: PostgreSQL 15 via Supabase  
> Convenção: snake_case · UUID como PK · timestamps em UTC · soft delete via `ativo`

---

## TABELAS PRINCIPAIS

### `products` — Produto pai (sem variação)

```sql
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            VARCHAR(200) NOT NULL,
  descricao       TEXT,
  ncm             VARCHAR(8) NOT NULL,                        -- 8 dígitos, obrigatório
  categoria_id    UUID NOT NULL REFERENCES categories(id),
  fornecedor_id   UUID REFERENCES suppliers(id),
  unidade_medida  VARCHAR(10) NOT NULL DEFAULT 'UN',          -- UN, KG, LT, CX, etc.
  ativo           BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_products_categoria ON products(categoria_id);
CREATE INDEX idx_products_ncm ON products(ncm);
CREATE INDEX idx_products_ativo ON products(ativo);
```

---

### `skus` — Variação de produto (unidade controlável de estoque)

```sql
CREATE TABLE skus (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          UUID NOT NULL REFERENCES products(id),
  codigo_sku          VARCHAR(50) UNIQUE NOT NULL,             -- gerado ou informado manualmente
  tamanho             VARCHAR(50),                             -- ex: "500ml", "1L", "5L"
  cor                 VARCHAR(50),                             -- ex: "Azul", "Transparente"
  codigo_barras       VARCHAR(50) UNIQUE,
  preco_venda         NUMERIC(12,2),
  custo_medio         NUMERIC(12,4) NOT NULL DEFAULT 0,        -- atualizado a cada entrada
  estoque_atual       INTEGER NOT NULL DEFAULT 0,              -- mantido por trigger
  estoque_minimo      INTEGER NOT NULL DEFAULT 0,
  estoque_maximo      INTEGER,
  localizacao         VARCHAR(100),                            -- ex: "Prateleira A3"
  ativo               BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_skus_product_id ON skus(product_id);
CREATE INDEX idx_skus_codigo_barras ON skus(codigo_barras);
CREATE INDEX idx_skus_estoque_atual ON skus(estoque_atual);
CREATE INDEX idx_skus_ativo ON skus(ativo);
```

---

### `stock_movements` — Movimentações de estoque (append-only, NUNCA deletar)

```sql
CREATE TYPE movement_type AS ENUM (
  'ENTRADA',       -- compra / recebimento
  'SAIDA',         -- venda / consumo
  'AJUSTE_POS',   -- ajuste positivo (inventário)
  'AJUSTE_NEG',   -- ajuste negativo (inventário)
  'DEVOLUCAO_CLIENTE',
  'DEVOLUCAO_FORNECEDOR'
);

CREATE TABLE stock_movements (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id              UUID NOT NULL REFERENCES skus(id),
  tipo                movement_type NOT NULL,
  quantidade          INTEGER NOT NULL CHECK (quantidade > 0),
  custo_unitario      NUMERIC(12,4),                           -- obrigatório em ENTRADA
  custo_total         NUMERIC(14,4) GENERATED ALWAYS AS (quantidade * custo_unitario) STORED,
  preco_venda_unit    NUMERIC(12,2),                           -- preenchido em SAIDA
  saldo_antes         INTEGER NOT NULL,                        -- snapshot do saldo antes da movimentação
  saldo_depois        INTEGER NOT NULL,                        -- snapshot do saldo após
  justificativa       TEXT,                                    -- obrigatório em AJUSTE_*
  referencia_doc      VARCHAR(100),                            -- número NF, pedido, etc.
  nfe_id              UUID REFERENCES nfe_imports(id),         -- se originou de NF-e
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID NOT NULL REFERENCES users(id)
);

-- Regra: AJUSTE_* exige justificativa (enforce via trigger ou constraint)
ALTER TABLE stock_movements
  ADD CONSTRAINT chk_ajuste_justificativa
  CHECK (
    (tipo NOT IN ('AJUSTE_POS', 'AJUSTE_NEG')) OR (justificativa IS NOT NULL AND justificativa <> '')
  );

CREATE INDEX idx_movements_sku_id ON stock_movements(sku_id);
CREATE INDEX idx_movements_tipo ON stock_movements(tipo);
CREATE INDEX idx_movements_created_at ON stock_movements(created_at DESC);
CREATE INDEX idx_movements_created_by ON stock_movements(created_by);
CREATE INDEX idx_movements_nfe_id ON stock_movements(nfe_id);
```

---

### `nfe_imports` — Importações de NF-e

```sql
CREATE TYPE nfe_status AS ENUM ('PENDENTE', 'CONFIRMADA', 'REJEITADA', 'CANCELADA');

CREATE TABLE nfe_imports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave_acesso    VARCHAR(44) UNIQUE NOT NULL,                 -- chave de 44 dígitos SEFAZ
  numero_nfe      VARCHAR(20) NOT NULL,
  serie           VARCHAR(3),
  fornecedor_cnpj VARCHAR(14) NOT NULL,
  fornecedor_nome VARCHAR(200),
  data_emissao    DATE NOT NULL,
  valor_total     NUMERIC(14,2) NOT NULL,
  xml_path        TEXT NOT NULL,                               -- caminho no Supabase Storage
  status          nfe_status NOT NULL DEFAULT 'PENDENTE',
  observacoes     TEXT,
  importado_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
  importado_por   UUID NOT NULL REFERENCES users(id),
  confirmado_em   TIMESTAMPTZ,
  confirmado_por  UUID REFERENCES users(id)
);

CREATE INDEX idx_nfe_status ON nfe_imports(status);
CREATE INDEX idx_nfe_chave ON nfe_imports(chave_acesso);
CREATE INDEX idx_nfe_fornecedor_cnpj ON nfe_imports(fornecedor_cnpj);
```

---

### `nfe_items` — Itens da NF-e (antes de virar movimentação)

```sql
CREATE TABLE nfe_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nfe_id            UUID NOT NULL REFERENCES nfe_imports(id) ON DELETE CASCADE,
  codigo_produto_nf VARCHAR(60),                               -- código do produto no XML
  descricao_nf      VARCHAR(200) NOT NULL,
  ncm               VARCHAR(8),
  sku_id            UUID REFERENCES skus(id),                  -- vinculação manual pelo operador
  quantidade        NUMERIC(12,4) NOT NULL,
  unidade           VARCHAR(10),
  valor_unitario    NUMERIC(12,4) NOT NULL,
  valor_total       NUMERIC(14,4) NOT NULL
);

CREATE INDEX idx_nfe_items_nfe_id ON nfe_items(nfe_id);
CREATE INDEX idx_nfe_items_sku_id ON nfe_items(sku_id);
```

---

### `inventory_sessions` — Sessões de inventário periódico

```sql
CREATE TYPE inventory_status AS ENUM ('ABERTA', 'CONTANDO', 'REVISAO', 'FECHADA');

CREATE TABLE inventory_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao       VARCHAR(200) NOT NULL,
  status          inventory_status NOT NULL DEFAULT 'ABERTA',
  iniciado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  iniciado_por    UUID NOT NULL REFERENCES users(id),
  fechado_em      TIMESTAMPTZ,
  fechado_por     UUID REFERENCES users(id),
  observacoes     TEXT
);
```

---

### `inventory_counts` — Contagem física por SKU (dentro de uma sessão)

```sql
CREATE TABLE inventory_counts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID NOT NULL REFERENCES inventory_sessions(id),
  sku_id              UUID NOT NULL REFERENCES skus(id),
  quantidade_contada  INTEGER NOT NULL,
  quantidade_sistema  INTEGER NOT NULL,                        -- snapshot no momento da contagem
  diferenca           INTEGER GENERATED ALWAYS AS (quantidade_contada - quantidade_sistema) STORED,
  contado_por         UUID NOT NULL REFERENCES users(id),
  contado_em          TIMESTAMPTZ NOT NULL DEFAULT now(),
  ajuste_gerado       BOOLEAN NOT NULL DEFAULT false,          -- TRUE após movimentação de ajuste criada
  UNIQUE(session_id, sku_id)
);

CREATE INDEX idx_inventory_counts_session ON inventory_counts(session_id);
CREATE INDEX idx_inventory_counts_sku ON inventory_counts(sku_id);
```

---

## TABELAS DE SUPORTE

### `users` — Usuários do sistema

```sql
CREATE TYPE user_role AS ENUM ('ADMIN', 'OPERADOR', 'VENDEDOR', 'FINANCEIRO');

CREATE TABLE users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),     -- integrado com Supabase Auth
  nome        VARCHAR(150) NOT NULL,
  email       VARCHAR(200) UNIQUE NOT NULL,
  role        user_role NOT NULL DEFAULT 'OPERADOR',
  ativo       BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### `categories` — Categorias de produto

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        VARCHAR(100) UNIQUE NOT NULL,
  descricao   TEXT,
  ativo       BOOLEAN NOT NULL DEFAULT true
);
```

---

### `suppliers` — Fornecedores

```sql
CREATE TABLE suppliers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social    VARCHAR(200) NOT NULL,
  nome_fantasia   VARCHAR(200),
  cnpj            VARCHAR(14) UNIQUE NOT NULL,
  email           VARCHAR(200),
  telefone        VARCHAR(20),
  contato         VARCHAR(100),
  ativo           BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_suppliers_cnpj ON suppliers(cnpj);
```

---

### `stock_alerts` — Alertas gerados automaticamente

```sql
CREATE TYPE alert_type AS ENUM ('ESTOQUE_MINIMO', 'MOVIMENTO_SUSPEITO');
CREATE TYPE alert_status AS ENUM ('PENDENTE', 'VISUALIZADO', 'RESOLVIDO', 'IGNORADO');

CREATE TABLE stock_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo        alert_type NOT NULL,
  sku_id      UUID REFERENCES skus(id),
  mensagem    TEXT NOT NULL,
  status      alert_status NOT NULL DEFAULT 'PENDENTE',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_alerts_status ON stock_alerts(status);
CREATE INDEX idx_alerts_tipo ON stock_alerts(tipo);
CREATE INDEX idx_alerts_sku ON stock_alerts(sku_id);
```

---

## TABELAS DE AUDITORIA

### `audit_logs` — Log imutável de toda ação no sistema

```sql
CREATE TABLE audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  acao          VARCHAR(100) NOT NULL,                         -- ex: 'SKU_CRIADO', 'MOVIMENTO_BLOQUEADO'
  tabela        VARCHAR(100),
  registro_id   UUID,
  payload_antes JSONB,
  payload_depois JSONB,
  ip_address    INET,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_acao ON audit_logs(acao);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_tabela_registro ON audit_logs(tabela, registro_id);
```

---

## TRIGGERS CRÍTICOS

```sql
-- 1. Atualiza estoque_atual no SKU após cada movimentação
CREATE OR REPLACE FUNCTION fn_update_sku_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tipo IN ('ENTRADA', 'AJUSTE_POS', 'DEVOLUCAO_CLIENTE') THEN
    UPDATE skus SET estoque_atual = estoque_atual + NEW.quantidade,
                    updated_at = now()
    WHERE id = NEW.sku_id;
  ELSE
    UPDATE skus SET estoque_atual = estoque_atual - NEW.quantidade,
                    updated_at = now()
    WHERE id = NEW.sku_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_sku_balance
AFTER INSERT ON stock_movements
FOR EACH ROW EXECUTE FUNCTION fn_update_sku_balance();

-- 2. Recalcula custo médio ponderado após ENTRADA
CREATE OR REPLACE FUNCTION fn_update_custo_medio()
RETURNS TRIGGER AS $$
DECLARE
  v_saldo_atual INTEGER;
  v_custo_atual NUMERIC(12,4);
BEGIN
  IF NEW.tipo = 'ENTRADA' THEN
    SELECT estoque_atual, custo_medio INTO v_saldo_atual, v_custo_atual
    FROM skus WHERE id = NEW.sku_id;

    UPDATE skus SET
      custo_medio = CASE
        WHEN (v_saldo_atual + NEW.quantidade) = 0 THEN NEW.custo_unitario
        ELSE ((v_saldo_atual * v_custo_atual) + (NEW.quantidade * NEW.custo_unitario))
             / (v_saldo_atual + NEW.quantidade)
      END
    WHERE id = NEW.sku_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_custo_medio
AFTER INSERT ON stock_movements
FOR EACH ROW EXECUTE FUNCTION fn_update_custo_medio();

-- 3. Alerta automático de estoque mínimo
CREATE OR REPLACE FUNCTION fn_check_estoque_minimo()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estoque_atual <= NEW.estoque_minimo AND NEW.estoque_minimo > 0 THEN
    INSERT INTO stock_alerts (tipo, sku_id, mensagem)
    VALUES (
      'ESTOQUE_MINIMO',
      NEW.id,
      'SKU ' || NEW.codigo_sku || ' atingiu estoque mínimo (' || NEW.estoque_atual || ' unidades)'
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_estoque_minimo
AFTER UPDATE OF estoque_atual ON skus
FOR EACH ROW EXECUTE FUNCTION fn_check_estoque_minimo();
```

---

---

# ARQUITETURA EM PILARES

---

```
─────────────────────────────────────────────────────
PILAR 1 — Autenticação e Controle de Acesso
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Gerenciar identidade, sessão e permissões de todos os
  usuários do sistema. Nenhum outro pilar valida quem pode
  fazer o quê — isso é responsabilidade exclusiva deste pilar.

Etapas:
  1. Configurar Supabase Auth (email/senha)
  2. Criar tabela users com role (ADMIN, OPERADOR, VENDEDOR, FINANCEIRO)
  3. Implementar middleware Next.js que valida JWT em toda rota /api
  4. Criar helper hasPermission(role, action) usado pelos demais pilares
  5. Implementar RLS (Row Level Security) no Supabase por role
  6. Tela de login + gestão de usuários (Admin only)

Entrada:
  Credenciais do usuário (email + senha)

Saída:
  JWT válido · user_id · role · contexto de sessão disponível para todos os pilares

Tecnologias:
  Supabase Auth · Next.js Middleware · JWT

Tabelas envolvidas:
  users · audit_logs (registro de login/logout)

Regras:
  - VENDEDOR não acessa custos nem relatórios financeiros
  - FINANCEIRO não registra movimentações
  - Apenas ADMIN cria/desativa usuários
  - Tokens expiram conforme SESSION_EXPIRY_HOURS
```

---

```
─────────────────────────────────────────────────────
PILAR 2 — Cadastro de Produtos e SKUs
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Criar e manter o catálogo de produtos e suas variações (SKUs).
  É o pilar que define o "o que existe" no sistema — não o quanto existe.
  Saldo zero nunca é criado aqui; é consequência de movimentações no Pilar 3.

Etapas:
  1. CRUD de categorias
  2. CRUD de fornecedores (com validação de CNPJ)
  3. CRUD de produtos (com NCM obrigatório, 8 dígitos)
  4. CRUD de SKUs (variações: tamanho + cor + código de barras)
  5. Geração automática de código SKU se não informado
  6. Configuração de estoque mínimo/máximo por SKU
  7. Desativação lógica (soft delete) — nunca deleção física
  8. Busca por código de barras, nome, NCM, categoria

Entrada:
  Dados do produto (nome, NCM, categoria, fornecedor)
  Dados da variação (tamanho, cor, código de barras, preço de venda, estoque mínimo)

Saída:
  Produto criado com UUID · SKUs vinculados com codigo_sku gerado
  Disponível para referência em movimentações e NF-e

Tecnologias:
  Next.js API Routes · Supabase Client · Zod (validação de schema)

Tabelas envolvidas:
  products · skus · categories · suppliers · audit_logs

Regras:
  - NCM deve ter exatamente 8 dígitos numéricos
  - SKU com estoque_atual > 0 não pode ser desativado sem ajuste prévio
  - Código de barras único globalmente
  - VENDEDOR tem acesso somente leitura a este pilar
```

---

```
─────────────────────────────────────────────────────
PILAR 3 — Movimentações de Estoque
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Registrar toda e qualquer alteração de saldo de estoque.
  É o coração do sistema. Toda decisão de "o saldo mudou" passa aqui.
  Não cria produtos, não lê NF-e — apenas processa e persiste movimentações.

Etapas:
  1. Serviço createMovement(data) — função central que:
     a. Valida saldo disponível (bloqueia saída se insuficiente)
     b. Registra snapshot saldo_antes
     c. Insere em stock_movements
     d. Trigger atualiza skus.estoque_atual e custo_medio
     e. Registra em audit_logs
  2. Endpoint POST /api/movements (entrada manual — compra sem NF-e)
  3. Endpoint POST /api/movements/sale (saída — venda balcão)
  4. Endpoint POST /api/movements/return (devolução cliente/fornecedor)
  5. Endpoint POST /api/movements/adjust (ajuste — requer justificativa)
  6. Listagem e filtros de movimentações (por SKU, tipo, data, usuário)

Entrada:
  sku_id · tipo · quantidade · custo_unitario (se ENTRADA) · justificativa (se AJUSTE) · user_id

Saída:
  Movimentação persistida · Saldo atualizado no SKU · Alerta disparado se atingir mínimo
  Registro em audit_logs

Tecnologias:
  Next.js API Routes · Supabase Client · Transação PostgreSQL (BEGIN/COMMIT)

Tabelas envolvidas:
  stock_movements · skus · stock_alerts · audit_logs

Regras:
  - Operação é atômica — falha em qualquer etapa faz rollback completo
  - Saldo nunca negativo, salvo ADMIN com flag override explícito
  - AJUSTE_* exige justificativa com no mínimo 10 caracteres
  - VENDEDOR só pode registrar SAIDA (venda)
  - stock_movements é append-only — nenhum UPDATE ou DELETE permitido
```

---

```
─────────────────────────────────────────────────────
PILAR 4 — Importação e Processamento de NF-e
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Receber XMLs de NF-e, validar a chave de acesso na SEFAZ,
  extrair os itens e permitir que o operador vincule cada item
  a um SKU interno — antes de confirmar e gerar movimentações.
  Este pilar nunca move estoque diretamente: ele prepara; o Pilar 3 executa.

Etapas:
  1. Upload do XML no frontend → Supabase Storage
  2. Parse do XML NF-e 4.0 (extração de chave, fornecedor, itens, valores)
  3. Consulta da chave de acesso na SEFAZ (validação de autenticidade)
  4. Criação do registro nfe_imports (status: PENDENTE)
  5. Criação dos registros nfe_items
  6. Tela de vinculação: operador associa cada item NF ao SKU correto
     (busca por código de barras, nome, NCM)
  7. Operador confirma recebimento físico
  8. Sistema chama Pilar 3 para criar movimentação ENTRADA por item vinculado
  9. nfe_imports.status → CONFIRMADA

Entrada:
  Arquivo XML NF-e (upload pelo operador)

Saída:
  nfe_imports + nfe_items criados · Movimentações ENTRADA geradas via Pilar 3
  XML armazenado no Storage

Tecnologias:
  Next.js API Routes · xml2js ou fast-xml-parser · Supabase Storage
  Axios (consulta SEFAZ) · Variáveis SEFAZ_CONSULTA_URL e SEFAZ_AMBIENTE

Tabelas envolvidas:
  nfe_imports · nfe_items · skus · stock_movements (via Pilar 3) · audit_logs

Regras:
  - Chave de 44 dígitos única — NF-e duplicada é rejeitada
  - NF-e só vira estoque após confirmação manual do operador
  - Item sem SKU vinculado bloqueia a confirmação da NF-e
  - XML sempre armazenado mesmo em caso de rejeição
  - SEFAZ_AMBIENTE=homologacao nunca afeta estoque de produção
```

---

```
─────────────────────────────────────────────────────
PILAR 5 — Inventário Periódico
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Conduzir o processo de contagem física do estoque e reconciliar
  as diferenças com o saldo contábil do sistema via ajustes.
  Opera em sessões isoladas para evitar conflito com movimentações simultâneas.

Etapas:
  1. Abertura de sessão de inventário (ADMIN ou OPERADOR)
  2. Geração da lista de SKUs ativos para contagem
  3. Registro de contagem por SKU (quantidade_contada)
     — sistema captura quantidade_sistema no momento da contagem
  4. Dashboard de divergências: mostra diferença por SKU
  5. Revisão e aprovação das diferenças (ADMIN obrigatório)
  6. Geração automática de movimentações AJUSTE_POS / AJUSTE_NEG
     via Pilar 3 para cada SKU com diferença
  7. Fechamento da sessão
  8. Relatório de inventário (contábil vs. físico)

Entrada:
  Sessão de inventário aberta · Contagens físicas por SKU

Saída:
  inventory_session fechada · inventory_counts registrados
  Movimentações de ajuste criadas · Relatório de divergências

Tecnologias:
  Next.js API Routes · Supabase Client

Tabelas envolvidas:
  inventory_sessions · inventory_counts · skus · stock_movements (via Pilar 3) · audit_logs

Regras:
  - Só pode haver UMA sessão de inventário ABERTA ou CONTANDO por vez
  - Diferença zero não gera movimentação de ajuste
  - Ajustes de inventário têm justificativa automática: "Inventário #{session_id}"
  - ADMIN deve aprovar antes de os ajustes serem aplicados
  - Sessão não pode ser deletada — apenas fechada
```

---

```
─────────────────────────────────────────────────────
PILAR 6 — Alertas e Notificações
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Monitorar condições críticas no estoque e notificar os
  responsáveis. Não toma nenhuma ação corretiva — apenas informa.
  Geração de alertas é passiva (via trigger do banco) ou ativa (via job).

Etapas:
  1. Trigger no banco já cria stock_alerts (estoque mínimo) — Pilar 3 triggera isso
  2. Job periódico (pg_cron ou Edge Function) varre movimentações suspeitas:
     - Múltiplas saídas grandes em curto período pelo mesmo usuário
     - Ajuste de quantidade acima de threshold configurável
  3. API de leitura de alertas com filtro por tipo e status
  4. Tela de alertas no frontend (badge com contador)
  5. Notificação por e-mail para ADMIN/FINANCEIRO em alertas críticos
  6. Ações: visualizar, resolver, ignorar alerta

Entrada:
  Eventos do banco (trigger) · Resultado de varredura periódica

Saída:
  stock_alerts criados · E-mails disparados · Badge atualizado no frontend

Tecnologias:
  Supabase Edge Functions (job scheduler) · Nodemailer ou Resend (e-mail)
  Supabase Realtime (atualização do badge em tempo real)

Tabelas envolvidas:
  stock_alerts · stock_movements · skus · users · audit_logs

Regras:
  - Alerta de estoque mínimo não é duplicado se já houver um PENDENTE para o mesmo SKU
  - E-mail de alerta só vai para usuários com role ADMIN ou FINANCEIRO
  - Threshold de movimentação suspeita é configurável via variável de ambiente, não hardcoded
  - Alertas não podem ser deletados — apenas resolvidos ou ignorados
```

---

```
─────────────────────────────────────────────────────
PILAR 7 — Relatórios e Analytics
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Consolidar dados de movimentações, custos e giro para
  suporte a decisões. Leitura pura — nunca escreve em tabelas operacionais.
  Todos os relatórios são gerados sob demanda ou exportados em PDF/CSV.

Etapas:
  1. Relatório de Curva ABC de giro (ranking por quantidade vendida / valor)
  2. Relatório de CMV (Custo de Mercadoria Vendida) por período
  3. Relatório de inventário: saldo atual por SKU com custo médio e valor total
  4. Relatório de movimentações com filtros (tipo, usuário, SKU, período)
  5. Relatório de auditoria (movimentos suspeitos, ajustes, histórico por usuário)
  6. Exportação CSV e PDF
  7. Dashboard executivo (KPIs: valor total em estoque, CMV do mês, SKUs abaixo do mínimo)

Entrada:
  Parâmetros de filtro: período, SKU, categoria, tipo de movimentação

Saída:
  JSON estruturado para frontend · CSV para exportação · PDF para relatório formal

Tecnologias:
  Next.js API Routes · Supabase Client (queries analíticas)
  PostgreSQL views ou CTEs para cálculos complexos
  pdfkit ou @react-pdf/renderer (geração de PDF)
  Acesso restrito: VENDEDOR não acessa relatórios financeiros

Tabelas envolvidas:
  stock_movements · skus · products · categories · users · nfe_imports · audit_logs

Regras:
  - VENDEDOR não acessa CMV nem custo médio
  - Relatórios não são pré-calculados e armazenados — gerados sob demanda
  - Filtro de período máximo de 12 meses por consulta (performance)
  - Views analíticas no PostgreSQL para cálculos de custo médio e ABC
```

---

## DEPENDÊNCIAS ENTRE PILARES

```
Pilar 1 (Auth)
    └── Alimenta todos os outros pilares com user_id e role

Pilar 2 (Cadastro)
    └── Pilar 3, 4, 5 e 7 dependem de SKUs e Produtos existentes

Pilar 3 (Movimentações)  ← núcleo central
    ├── É chamado por: Pilar 4 (NF-e confirmada)
    ├── É chamado por: Pilar 5 (Inventário fechado)
    └── Dispara: Pilar 6 (Alertas via trigger)

Pilar 4 (NF-e)
    └── Depende do Pilar 3 para efetivar entrada no estoque

Pilar 5 (Inventário)
    └── Depende do Pilar 3 para efetivar ajustes

Pilar 6 (Alertas)
    └── Leitura passiva de stock_movements e skus

Pilar 7 (Relatórios)
    └── Leitura pura — sem dependência de escrita em nenhum pilar
```

---

## ORDEM DE CONSTRUÇÃO RECOMENDADA

```
1. Pilar 1 — Auth (sem isso, nada funciona)
2. Pilar 2 — Cadastro (sem produto/SKU, não há o que movimentar)
3. Pilar 3 — Movimentações (núcleo — valida tudo antes de construir em cima)
4. Pilar 6 — Alertas (plugado no Pilar 3 via trigger — baixo custo)
5. Pilar 4 — NF-e (usa o Pilar 3 já maduro)
6. Pilar 5 — Inventário (usa o Pilar 3 já maduro)
7. Pilar 7 — Relatórios (último, pois depende de dados reais para validar)
```

---

*Documento gerado em 2026-05-27. Atualizar ao iniciar cada pilar.*

# SISTEMA DE CONTROLE DE ESTOQUE — DOCUMENTO DE CONTEXTO GERAL

> Versão: 1.1
> Tipo de negócio: Distribuição B2B — materiais de limpeza
> Stack: Node.js + TypeScript · Next.js + React · Supabase (PostgreSQL)
> Última atualização: 2026-05-27

---

## 1. OBJETIVO DO SISTEMA

Controlar com precisão o estoque de uma distribuidora de materiais de limpeza — registrando entradas (compras/recebimentos), saídas (vendas), ajustes de inventário e devoluções —, garantindo rastreabilidade completa por produto e variação (tamanho, cor, NCM).

O modelo comercial é **B2B com vendas a crédito**: clientes são empresas com prazo de pagamento de 15, 30, 45 ou 60 dias. Vendas avulsas no balcão existem, mas são exceção. O sistema controla o que saiu do estoque, para quem, e o que ainda está por receber.

Integração com Nota Fiscal SEFAZ está prevista para NF-e de **entrada** (compras). NF-e de **saída** (vendas) é reconhecida como necessária mas de alta complexidade — implementação adiada para fase futura.

O sistema **não é um PDV**. Ele é o módulo de estoque e gestão comercial que alimenta e é alimentado pelo fluxo da distribuidora.

---

## 2. ARQUITETURA CONCEITUAL

**Event-sourcing leve com CRUD estruturado.**

- Toda alteração de quantidade em estoque é uma **movimentação imutável** (append-only). O saldo é sempre calculado ou mantido por trigger/função a partir dessas movimentações.
- Não existe "editar quantidade diretamente". Toda correção passa por um movimento do tipo `AJUSTE`.
- O banco de dados é a fonte da verdade absoluta. Nenhum estado de estoque vive apenas na memória da aplicação.
- NF-e/NF-C-e são **eventos externos** que disparam movimentações internas — nunca o contrário.
- Vendas geram movimentações de saída automaticamente ao serem confirmadas.

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
11. **Vendas a crédito exigem prazo definido** — 15, 30, 45 ou 60 dias. Contas a receber são geradas automaticamente ao confirmar a venda.
12. **Clientes têm limite de crédito** — o sistema bloqueia nova venda se o limite estiver esgotado.
13. **NF-e de saída não é implementada nesta fase** — vendas são registradas manualmente; emissão de NF fica por conta de sistema externo por enquanto.

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

[Venda para cliente B2B]
      │
      ▼
[Pedido de venda criado (sales + sale_items)]
      │
      ├──► [Validação de saldo disponível por SKU]
      │         └── [BLOQUEIO se saldo insuficiente]
      ├──► [Validação de limite de crédito do cliente]
      │         └── [BLOQUEIO se limite esgotado]
      │
      ▼ (venda confirmada)
[Movimentação SAIDA criada por SKU] ──► [Saldo atualizado]
      │
      ▼
[Conta a receber gerada] ──► [Vence em 15/30/45/60 dias]
      │
      ▼ (cliente paga)
[receivables.status = PAGO] ──► [Limite de crédito restaurado]

[Inventário periódico]
      │
      ▼
[Contagem física registrada por SKU]
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
| **Cliente** | Empresa compradora com CNPJ, limite de crédito e prazo padrão |
| **Venda** | Pedido vinculando cliente a itens + prazo de pagamento |
| **Conta a receber** | Valor devido pelo cliente com data de vencimento e status |
| **Movimentação** | Registro imutável de qualquer alteração de saldo (ENTRADA, SAÍDA, AJUSTE, DEVOLUÇÃO) |
| **Saldo disponível** | Calculado: `SUM(entradas) - SUM(saídas + ajustes negativos) + SUM(ajustes positivos)` |
| **Custo médio ponderado** | Recalculado a cada entrada: `(saldo_atual × custo_atual + qtd_nova × custo_novo) / (saldo_atual + qtd_nova)` |
| **Estoque mínimo** | Limite por SKU abaixo do qual um alerta de ressuprimento é disparado |
| **O que NUNCA pode acontecer** | Saldo negativo sem autorização · Movimentação sem responsável · Deleção de produto ou movimentação · Edição direta de saldo |

---

## 6. PERFIS DE USUÁRIO E PERMISSÕES

| Perfil | Pode fazer |
|---|---|
| **Admin/Gerente** | Tudo, incluindo ajustes, cadastro de produtos, relatórios financeiros, autorizar saldo negativo, gerenciar clientes e limites de crédito |
| **Operador de Estoque** | Registrar entrada, saída, iniciar inventário, importar NF-e |
| **Vendedor** | Consultar saldo por SKU, registrar venda (saída vinculada a cliente) — sem acesso a custos ou relatórios financeiros |
| **Financeiro/Compras** | Consultar CMV, relatórios de custo, contas a receber, aprovar ordens de compra, sem registrar movimentações |

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

# NF-e / SEFAZ (entrada)
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
  ncm             VARCHAR(8) NOT NULL,
  categoria_id    UUID NOT NULL REFERENCES categories(id),
  fornecedor_id   UUID REFERENCES suppliers(id),
  unidade_medida  VARCHAR(10) NOT NULL DEFAULT 'UN',
  ativo           BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID NOT NULL REFERENCES users(id)
);
```

---

### `skus` — Variação de produto (unidade controlável de estoque)

```sql
CREATE TABLE skus (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          UUID NOT NULL REFERENCES products(id),
  codigo_sku          VARCHAR(50) UNIQUE NOT NULL,
  tamanho             VARCHAR(50),
  cor                 VARCHAR(50),
  codigo_barras       VARCHAR(50) UNIQUE,
  preco_venda         NUMERIC(12,2),
  custo_medio         NUMERIC(12,4) NOT NULL DEFAULT 0,
  estoque_atual       INTEGER NOT NULL DEFAULT 0,
  estoque_minimo      INTEGER NOT NULL DEFAULT 0,
  estoque_maximo      INTEGER,
  localizacao         VARCHAR(100),
  ativo               BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### `customers` — Clientes B2B

```sql
CREATE TABLE customers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social      VARCHAR(200) NOT NULL,
  nome_fantasia     VARCHAR(200),
  cnpj              VARCHAR(14) UNIQUE,             -- nulo para clientes balcão (pessoa física)
  cpf               VARCHAR(11) UNIQUE,             -- nulo para empresas
  telefone          VARCHAR(20),
  email             VARCHAR(200),
  endereco          TEXT,
  limite_credito    NUMERIC(12,2) NOT NULL DEFAULT 0,
  prazo_padrao      SMALLINT NOT NULL DEFAULT 30    -- dias: 15, 30, 45 ou 60
    CHECK (prazo_padrao IN (15, 30, 45, 60)),
  saldo_devedor     NUMERIC(12,2) NOT NULL DEFAULT 0, -- calculado a partir de receivables
  ativo             BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        UUID NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_customers_cnpj ON customers(cnpj);
CREATE INDEX idx_customers_ativo ON customers(ativo);
```

---

### `sales` — Pedido de venda

```sql
CREATE TYPE sale_status AS ENUM ('RASCUNHO', 'CONFIRMADA', 'CANCELADA');

CREATE TABLE sales (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  status          sale_status NOT NULL DEFAULT 'RASCUNHO',
  prazo_dias      SMALLINT NOT NULL
    CHECK (prazo_dias IN (15, 30, 45, 60)),
  data_venda      DATE NOT NULL DEFAULT CURRENT_DATE,
  data_vencimento DATE NOT NULL,               -- data_venda + prazo_dias
  subtotal        NUMERIC(14,2) NOT NULL DEFAULT 0,
  desconto        NUMERIC(14,2) NOT NULL DEFAULT 0,
  total           NUMERIC(14,2) NOT NULL DEFAULT 0,
  observacoes     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID NOT NULL REFERENCES users(id),
  confirmado_em   TIMESTAMPTZ,
  confirmado_por  UUID REFERENCES users(id)
);

CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_data_vencimento ON sales(data_vencimento);
```

---

### `sale_items` — Itens do pedido de venda

```sql
CREATE TABLE sale_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id         UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  sku_id          UUID NOT NULL REFERENCES skus(id),
  quantidade      INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario  NUMERIC(12,2) NOT NULL,
  subtotal        NUMERIC(14,2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);

CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_sku ON sale_items(sku_id);
```

---

### `receivables` — Contas a receber

```sql
CREATE TYPE receivable_status AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');

CREATE TABLE receivables (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id         UUID NOT NULL REFERENCES sales(id),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  valor           NUMERIC(14,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento  DATE,
  status          receivable_status NOT NULL DEFAULT 'PENDENTE',
  observacoes     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  baixado_por     UUID REFERENCES users(id)
);

CREATE INDEX idx_receivables_customer ON receivables(customer_id);
CREATE INDEX idx_receivables_status ON receivables(status);
CREATE INDEX idx_receivables_vencimento ON receivables(data_vencimento);
```

---

### `stock_movements` — Movimentações de estoque (append-only, NUNCA deletar)

```sql
CREATE TYPE movement_type AS ENUM (
  'ENTRADA',
  'SAIDA',
  'AJUSTE_POS',
  'AJUSTE_NEG',
  'DEVOLUCAO_CLIENTE',
  'DEVOLUCAO_FORNECEDOR'
);

CREATE TABLE stock_movements (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id              UUID NOT NULL REFERENCES skus(id),
  tipo                movement_type NOT NULL,
  quantidade          INTEGER NOT NULL CHECK (quantidade > 0),
  custo_unitario      NUMERIC(12,4),
  custo_total         NUMERIC(14,4) GENERATED ALWAYS AS (quantidade * custo_unitario) STORED,
  preco_venda_unit    NUMERIC(12,2),
  saldo_antes         INTEGER NOT NULL,
  saldo_depois        INTEGER NOT NULL,
  justificativa       TEXT,
  referencia_doc      VARCHAR(100),
  sale_id             UUID REFERENCES sales(id),     -- preenchido quando origem é uma venda
  nfe_id              UUID REFERENCES nfe_imports(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID NOT NULL REFERENCES users(id)
);

ALTER TABLE stock_movements
  ADD CONSTRAINT chk_ajuste_justificativa
  CHECK (
    (tipo NOT IN ('AJUSTE_POS', 'AJUSTE_NEG')) OR (justificativa IS NOT NULL AND justificativa <> '')
  );
```

---

### `nfe_imports` — Importações de NF-e (entrada)

```sql
CREATE TYPE nfe_status AS ENUM ('PENDENTE', 'CONFIRMADA', 'REJEITADA', 'CANCELADA');

CREATE TABLE nfe_imports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave_acesso    VARCHAR(44) UNIQUE NOT NULL,
  numero_nfe      VARCHAR(20) NOT NULL,
  serie           VARCHAR(3),
  fornecedor_cnpj VARCHAR(14) NOT NULL,
  fornecedor_nome VARCHAR(200),
  data_emissao    DATE NOT NULL,
  valor_total     NUMERIC(14,2) NOT NULL,
  xml_path        TEXT NOT NULL,
  status          nfe_status NOT NULL DEFAULT 'PENDENTE',
  observacoes     TEXT,
  importado_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
  importado_por   UUID NOT NULL REFERENCES users(id),
  confirmado_em   TIMESTAMPTZ,
  confirmado_por  UUID REFERENCES users(id)
);
```

---

### `inventory_sessions` e `inventory_counts` — Inventário periódico

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

CREATE TABLE inventory_counts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID NOT NULL REFERENCES inventory_sessions(id),
  sku_id              UUID NOT NULL REFERENCES skus(id),
  quantidade_contada  INTEGER NOT NULL,
  quantidade_sistema  INTEGER NOT NULL,
  diferenca           INTEGER GENERATED ALWAYS AS (quantidade_contada - quantidade_sistema) STORED,
  contado_por         UUID NOT NULL REFERENCES users(id),
  contado_em          TIMESTAMPTZ NOT NULL DEFAULT now(),
  ajuste_gerado       BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(session_id, sku_id)
);
```

---

## TABELAS DE SUPORTE

### `categories` — Categorias de produto

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        VARCHAR(100) UNIQUE NOT NULL,
  descricao   TEXT,
  ativo       BOOLEAN NOT NULL DEFAULT true
);
```

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
```

### `stock_alerts` — Alertas automáticos

```sql
CREATE TYPE alert_type AS ENUM ('ESTOQUE_MINIMO', 'MOVIMENTO_SUSPEITO', 'CONTA_VENCIDA');
CREATE TYPE alert_status AS ENUM ('PENDENTE', 'VISUALIZADO', 'RESOLVIDO', 'IGNORADO');

CREATE TABLE stock_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo        alert_type NOT NULL,
  sku_id      UUID REFERENCES skus(id),
  customer_id UUID REFERENCES customers(id),   -- preenchido em CONTA_VENCIDA
  mensagem    TEXT NOT NULL,
  status      alert_status NOT NULL DEFAULT 'PENDENTE',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id)
);
```

### `audit_logs` — Log imutável de toda ação

```sql
CREATE TABLE audit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id),
  acao           VARCHAR(100) NOT NULL,
  tabela         VARCHAR(100),
  registro_id    UUID,
  payload_antes  JSONB,
  payload_depois JSONB,
  ip_address     INET,
  user_agent     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## TRIGGERS CRÍTICOS

```sql
-- 1. Atualiza estoque_atual no SKU após cada movimentação
-- 2. Recalcula custo médio ponderado após ENTRADA
-- 3. Alerta automático de estoque mínimo
-- (definições completas no arquivo de migração)
```

---

---

# ARQUITETURA EM PILARES

---

```
─────────────────────────────────────────────────────
PILAR 1 — Autenticação e Controle de Acesso
─────────────────────────────────────────────────────
Status: CONCLUÍDO ✅

Tabelas: users · audit_logs
```

---

```
─────────────────────────────────────────────────────
PILAR 2 — Cadastro de Produtos, SKUs e Clientes
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Criar e manter o catálogo de produtos, variações (SKUs),
  e a base de clientes B2B. Define "o que existe" e "quem compra".

Etapas:
  1. CRUD de categorias
  2. CRUD de fornecedores (validação de CNPJ)
  3. CRUD de produtos (NCM obrigatório, 8 dígitos)
  4. CRUD de SKUs (tamanho + cor + código de barras)
  5. Geração automática de código SKU
  6. Configuração de estoque mínimo/máximo por SKU
  7. CRUD de clientes (CNPJ, limite de crédito, prazo padrão)
  8. Soft delete em tudo — nunca deleção física

Tabelas: products · skus · categories · suppliers · customers · audit_logs

Regras:
  - NCM deve ter exatamente 8 dígitos numéricos
  - Código de barras único globalmente
  - Cliente com saldo devedor não pode ser desativado
  - VENDEDOR tem acesso somente leitura
```

---

```
─────────────────────────────────────────────────────
PILAR 3 — Vendas e Contas a Receber
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Registrar pedidos de venda vinculados a clientes B2B,
  controlar prazos de pagamento (15/30/45/60 dias) e
  gerenciar o ciclo de contas a receber.
  Ao confirmar uma venda, aciona o Pilar 4 para baixar o estoque.

Etapas:
  1. CRUD de pedidos de venda (rascunho → confirmado)
  2. Validação de limite de crédito antes de confirmar
  3. Geração automática de conta a receber ao confirmar venda
  4. Listagem de contas a receber com filtros (vencidas, por cliente)
  5. Baixa de pagamento (parcial ou total)
  6. Atualização automática do saldo devedor do cliente

Tabelas: sales · sale_items · receivables · customers · audit_logs

Regras:
  - Venda só sai de RASCUNHO para CONFIRMADA se houver saldo em estoque
  - Venda só confirma se cliente tiver limite de crédito disponível
  - Cancelar venda estorna estoque e cancela conta a receber
  - FINANCEIRO pode dar baixa em contas mas não criar vendas
  - NF-e de saída: não implementada nesta fase — emissão via sistema externo
```

---

```
─────────────────────────────────────────────────────
PILAR 4 — Movimentações de Estoque
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Registrar toda e qualquer alteração de saldo de estoque.
  É o coração do sistema. Chamado pelo Pilar 3 (venda confirmada),
  Pilar 5 (NF-e confirmada) e Pilar 6 (inventário fechado).

Etapas:
  1. Serviço createMovement(data) — função central atômica
  2. Entrada manual (compra sem NF-e)
  3. Saída por venda (acionado pelo Pilar 3)
  4. Devolução cliente/fornecedor
  5. Ajuste manual (requer justificativa)
  6. Listagem e filtros de movimentações

Tabelas: stock_movements · skus · stock_alerts · audit_logs

Regras:
  - Operação atômica — rollback completo em caso de falha
  - Saldo nunca negativo (salvo ADMIN com override explícito)
  - stock_movements é append-only — sem UPDATE ou DELETE
```

---

```
─────────────────────────────────────────────────────
PILAR 5 — Importação e Processamento de NF-e (Entrada)
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Receber XMLs de NF-e de compra, validar na SEFAZ,
  vincular itens a SKUs internos e gerar movimentações de entrada.
  NF-e de saída (vendas) está fora do escopo desta fase.

Etapas:
  1. Upload do XML → Supabase Storage
  2. Parse do XML NF-e 4.0
  3. Consulta da chave de acesso na SEFAZ
  4. Criação de nfe_imports (status: PENDENTE)
  5. Vinculação manual de itens NF → SKUs internos
  6. Confirmação do operador → aciona Pilar 4 para ENTRADA

Tabelas: nfe_imports · nfe_items · skus · stock_movements · audit_logs
```

---

```
─────────────────────────────────────────────────────
PILAR 6 — Inventário Periódico
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Conduzir contagem física e reconciliar diferenças com ajustes.

Tabelas: inventory_sessions · inventory_counts · skus · stock_movements · audit_logs
```

---

```
─────────────────────────────────────────────────────
PILAR 7 — Alertas e Notificações
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Monitorar estoque mínimo, contas vencidas e movimentos suspeitos.
  Notificar via badge no sistema e e-mail para Admin/Financeiro.

Tabelas: stock_alerts · stock_movements · skus · receivables · users
```

---

```
─────────────────────────────────────────────────────
PILAR 8 — Relatórios e Analytics
─────────────────────────────────────────────────────
Status: A CONSTRUIR

Responsabilidade:
  Relatórios operacionais e financeiros: curva ABC, CMV,
  contas a receber em aberto, inadimplência por cliente,
  giro de estoque. Leitura pura — nunca escreve.

Tabelas: stock_movements · skus · products · sales · receivables · customers · audit_logs
```

---

## DEPENDÊNCIAS ENTRE PILARES

```
Pilar 1 (Auth)
    └── Alimenta todos com user_id e role

Pilar 2 (Cadastro)
    └── Pilares 3, 4, 5, 6 e 8 dependem de SKUs, Produtos e Clientes

Pilar 3 (Vendas)
    └── Aciona Pilar 4 ao confirmar venda (baixa de estoque)
    └── Gera receivables automaticamente

Pilar 4 (Movimentações) ← núcleo central
    ├── Chamado por: Pilar 3 (venda confirmada)
    ├── Chamado por: Pilar 5 (NF-e confirmada)
    ├── Chamado por: Pilar 6 (inventário fechado)
    └── Dispara: Pilar 7 (alertas via trigger)

Pilar 5 (NF-e Entrada)
    └── Depende do Pilar 4 para efetivar entradas

Pilar 6 (Inventário)
    └── Depende do Pilar 4 para efetivar ajustes

Pilar 7 (Alertas)
    └── Leitura passiva de movimentos, skus e receivables

Pilar 8 (Relatórios)
    └── Leitura pura — sem dependência de escrita
```

---

## ORDEM DE CONSTRUÇÃO

```
1. Pilar 1 — Auth                   ✅ Concluído
2. Pilar 2 — Cadastro + Clientes    ← Agora
3. Pilar 3 — Vendas + Recebíveis
4. Pilar 4 — Movimentações
5. Pilar 7 — Alertas (plugado no Pilar 4 via trigger — baixo custo)
6. Pilar 5 — NF-e Entrada
7. Pilar 6 — Inventário
8. Pilar 8 — Relatórios
```

---

*Documento atualizado em 2026-05-27. Escopo expandido para distribuição B2B com vendas a crédito (15/30/45/60 dias) e contas a receber. NF-e de saída adiada para fase futura.*

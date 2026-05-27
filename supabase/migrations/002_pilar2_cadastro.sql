-- =====================================================
-- PILAR 2 — Cadastro de Produtos, SKUs e Clientes
-- =====================================================

-- Função auxiliar para gerar código SKU único
CREATE OR REPLACE FUNCTION generate_sku_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_code := 'SKU-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.skus WHERE codigo_sku = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- ──────────────────────────
-- Tabela: categories
-- ──────────────────────────
CREATE TABLE public.categories (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR(100) UNIQUE NOT NULL,
  descricao TEXT,
  ativo     BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados leem categorias"
  ON public.categories FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin e Operador gerenciam categorias"
  ON public.categories FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('ADMIN', 'OPERADOR') AND ativo = true
    )
  );

-- ──────────────────────────
-- Tabela: suppliers
-- ──────────────────────────
CREATE TABLE public.suppliers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social  VARCHAR(200) NOT NULL,
  nome_fantasia VARCHAR(200),
  cnpj          VARCHAR(14) UNIQUE NOT NULL,
  email         VARCHAR(200),
  telefone      VARCHAR(20),
  contato       VARCHAR(100),
  ativo         BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_suppliers_cnpj ON public.suppliers(cnpj);
CREATE INDEX idx_suppliers_ativo ON public.suppliers(ativo);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados leem fornecedores"
  ON public.suppliers FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin e Operador gerenciam fornecedores"
  ON public.suppliers FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('ADMIN', 'OPERADOR') AND ativo = true
    )
  );

-- ──────────────────────────
-- Tabela: customers
-- ──────────────────────────
CREATE TABLE public.customers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social   VARCHAR(200) NOT NULL,
  nome_fantasia  VARCHAR(200),
  cnpj           VARCHAR(14) UNIQUE,
  cpf            VARCHAR(11) UNIQUE,
  telefone       VARCHAR(20),
  email          VARCHAR(200),
  endereco       TEXT,
  limite_credito NUMERIC(12,2) NOT NULL DEFAULT 0,
  prazo_padrao   SMALLINT NOT NULL DEFAULT 30
    CHECK (prazo_padrao IN (15, 30, 45, 60)),
  saldo_devedor  NUMERIC(12,2) NOT NULL DEFAULT 0,
  ativo          BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by     UUID NOT NULL REFERENCES public.users(id)
);

CREATE INDEX idx_customers_cnpj ON public.customers(cnpj);
CREATE INDEX idx_customers_ativo ON public.customers(ativo);

CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados leem clientes"
  ON public.customers FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin e Operador gerenciam clientes"
  ON public.customers FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('ADMIN', 'OPERADOR') AND ativo = true
    )
  );

-- ──────────────────────────
-- Tabela: products
-- ──────────────────────────
CREATE TABLE public.products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome           VARCHAR(200) NOT NULL,
  descricao      TEXT,
  ncm            VARCHAR(8) NOT NULL CHECK (ncm ~ '^\d{8}$'),
  categoria_id   UUID NOT NULL REFERENCES public.categories(id),
  fornecedor_id  UUID REFERENCES public.suppliers(id),
  unidade_medida VARCHAR(10) NOT NULL DEFAULT 'UN',
  ativo          BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by     UUID NOT NULL REFERENCES public.users(id)
);

CREATE INDEX idx_products_categoria ON public.products(categoria_id);
CREATE INDEX idx_products_ncm ON public.products(ncm);
CREATE INDEX idx_products_ativo ON public.products(ativo);

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados leem produtos"
  ON public.products FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin e Operador gerenciam produtos"
  ON public.products FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('ADMIN', 'OPERADOR') AND ativo = true
    )
  );

-- ──────────────────────────
-- Tabela: skus
-- ──────────────────────────
CREATE TABLE public.skus (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     UUID NOT NULL REFERENCES public.products(id),
  codigo_sku     VARCHAR(50) UNIQUE NOT NULL DEFAULT '',
  tamanho        VARCHAR(50),
  cor            VARCHAR(50),
  codigo_barras  VARCHAR(50) UNIQUE,
  preco_venda    NUMERIC(12,2),
  custo_medio    NUMERIC(12,4) NOT NULL DEFAULT 0,
  estoque_atual  INTEGER NOT NULL DEFAULT 0,
  estoque_minimo INTEGER NOT NULL DEFAULT 0,
  estoque_maximo INTEGER,
  localizacao    VARCHAR(100),
  ativo          BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_skus_product_id ON public.skus(product_id);
CREATE INDEX idx_skus_codigo_barras ON public.skus(codigo_barras);
CREATE INDEX idx_skus_ativo ON public.skus(ativo);

-- Trigger: preenche codigo_sku automaticamente se não informado
CREATE OR REPLACE FUNCTION fn_set_sku_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo_sku IS NULL OR NEW.codigo_sku = '' THEN
    NEW.codigo_sku := generate_sku_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_sku_code
BEFORE INSERT ON public.skus
FOR EACH ROW EXECUTE FUNCTION fn_set_sku_code();

CREATE TRIGGER trg_skus_updated_at
BEFORE UPDATE ON public.skus
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.skus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados leem SKUs"
  ON public.skus FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin e Operador gerenciam SKUs"
  ON public.skus FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('ADMIN', 'OPERADOR') AND ativo = true
    )
  );

-- ──────────────────────────
-- Tabela: audit_logs
-- ──────────────────────────
CREATE TABLE public.audit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES public.users(id),
  acao           VARCHAR(100) NOT NULL,
  tabela         VARCHAR(100),
  registro_id    UUID,
  payload_antes  JSONB,
  payload_depois JSONB,
  ip_address     INET,
  user_agent     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_acao ON public.audit_logs(acao);
CREATE INDEX idx_audit_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_tabela_registro ON public.audit_logs(tabela, registro_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin lê todos os logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN' AND ativo = true
    )
  );

CREATE POLICY "Sistema insere logs"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

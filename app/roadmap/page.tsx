import { CheckCircle2, Clock, Circle, Zap } from "lucide-react";

const fases = [
  {
    numero: 0,
    titulo: "Protótipo de Interface",
    descricao: "Todas as telas do sistema desenhadas e navegáveis com dados de exemplo.",
    status: "done",
    itens: [
      "Layout com sidebar e navegação",
      "Tela de login",
      "Dashboard com KPIs",
      "Listagem de Produtos e SKUs",
      "Formulário de movimentação",
      "Fluxo de importação NF-e",
      "Inventário, Alertas e Relatórios",
    ],
  },
  {
    numero: 1,
    titulo: "Autenticação e Controle de Acesso",
    descricao: "Login real com Supabase Auth. Sessão protegida e usuário Admin configurado.",
    status: "current",
    itens: [
      "Conexão com Supabase",
      "Login com email e senha",
      "Proteção de rotas via middleware",
      "Tabela de usuários com perfis (Admin, Operador, Vendedor, Financeiro)",
      "Helper de sessão para os módulos seguintes",
    ],
  },
  {
    numero: 2,
    titulo: "Cadastro de Produtos e SKUs",
    descricao: "Catálogo completo de produtos com variações, fornecedores e categorias.",
    status: "pending",
    itens: [
      "CRUD de categorias",
      "CRUD de fornecedores com validação de CNPJ",
      "CRUD de produtos com NCM obrigatório",
      "CRUD de SKUs (tamanho, cor, código de barras)",
      "Geração automática de código SKU",
      "Configuração de estoque mínimo e máximo",
      "Soft delete — nenhum dado é apagado",
    ],
  },
  {
    numero: 3,
    titulo: "Movimentações de Estoque",
    descricao: "Núcleo do sistema. Registro imutável de todas as entradas, saídas e ajustes.",
    status: "pending",
    itens: [
      "Registro de entrada (compra sem NF-e)",
      "Registro de saída (venda balcão)",
      "Registro de devolução (cliente e fornecedor)",
      "Ajuste de inventário com justificativa obrigatória",
      "Bloqueio automático de saldo negativo",
      "Cálculo de custo médio ponderado",
      "Histórico completo e imutável",
    ],
  },
  {
    numero: 4,
    titulo: "Importação de NF-e",
    descricao: "Upload de XML, validação na SEFAZ e entrada automática no estoque após confirmação.",
    status: "pending",
    itens: [
      "Upload e armazenamento do XML",
      "Parse dos dados da nota fiscal",
      "Validação da chave de acesso na SEFAZ",
      "Vinculação de itens da NF a SKUs internos",
      "Confirmação de recebimento físico",
      "Geração automática de movimentações de entrada",
    ],
  },
  {
    numero: 5,
    titulo: "Inventário Periódico",
    descricao: "Contagem física do estoque com reconciliação automática de divergências.",
    status: "pending",
    itens: [
      "Abertura de sessão de inventário",
      "Registro de contagem por SKU",
      "Comparação contagem física vs. sistema",
      "Dashboard de divergências",
      "Aprovação de ajustes pelo Admin",
      "Relatório de inventário (contábil vs. físico)",
    ],
  },
  {
    numero: 6,
    titulo: "Alertas e Notificações",
    descricao: "Monitoramento automático de estoque mínimo e movimentações suspeitas.",
    status: "pending",
    itens: [
      "Alerta automático de estoque mínimo (via trigger)",
      "Detecção de movimentações suspeitas",
      "Central de alertas com status (pendente, resolvido, ignorado)",
      "Notificação por e-mail para Admin",
      "Badge de alertas em tempo real na sidebar",
    ],
  },
  {
    numero: 7,
    titulo: "Relatórios e Analytics",
    descricao: "Visão gerencial completa com exportação em CSV e PDF.",
    status: "pending",
    itens: [
      "Curva ABC de giro por produto",
      "CMV (Custo de Mercadoria Vendida) por período",
      "Posição atual de estoque com custo médio",
      "Histórico de movimentações com filtros",
      "Relatório de auditoria por usuário",
      "Exportação CSV e PDF",
    ],
  },
];

const statusCfg = {
  done: {
    label: "Concluído",
    icon: <CheckCircle2 size={16} />,
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    card: "border-emerald-200",
    number: "bg-emerald-500 text-white",
    line: "bg-emerald-400",
  },
  current: {
    label: "Em andamento",
    icon: <Zap size={16} />,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    card: "border-blue-300 shadow-blue-100 shadow-md",
    number: "bg-blue-600 text-white",
    line: "bg-gray-200",
  },
  pending: {
    label: "Aguardando",
    icon: <Circle size={16} />,
    badge: "bg-gray-100 text-gray-500 border-gray-200",
    card: "border-gray-200",
    number: "bg-gray-200 text-gray-500",
    line: "bg-gray-200",
  },
};

const totalFases = fases.length;
const concluidas = fases.filter((f) => f.status === "done").length;
const progresso = Math.round((concluidas / totalFases) * 100);

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">
                Sistema de Controle de Estoque
              </p>
              <h1 className="text-3xl font-bold text-gray-900">Roadmap de Desenvolvimento</h1>
              <p className="text-gray-500 mt-2">
                Varejo de materiais de limpeza · {totalFases} fases · Atualizado em maio de 2026
              </p>
            </div>
            <div className="text-right shrink-0 ml-8">
              <p className="text-4xl font-bold text-gray-900">{progresso}%</p>
              <p className="text-sm text-gray-400 mt-0.5">concluído</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{concluidas} de {totalFases} fases concluídas</span>
              <span>{totalFases - concluidas - 1} fases restantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fases */}
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="relative">
          {/* Linha vertical */}
          <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gray-200 z-0" />

          <div className="space-y-5">
            {fases.map((fase, i) => {
              const cfg = statusCfg[fase.status as keyof typeof statusCfg];
              return (
                <div key={fase.numero} className="relative flex gap-6">
                  {/* Número */}
                  <div className={`w-14 h-14 rounded-full ${cfg.number} flex items-center justify-center text-lg font-bold shrink-0 z-10 border-4 border-gray-50`}>
                    {fase.status === "done" ? <CheckCircle2 size={22} /> : fase.numero}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 bg-white rounded-xl border ${cfg.card} p-5 mb-1`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-400">Fase {fase.numero}</span>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </div>
                        <h2 className="text-base font-bold text-gray-900">{fase.titulo}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{fase.descricao}</p>
                      </div>
                    </div>

                    <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 pt-3 border-t border-gray-100">
                      {fase.itens.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className={`mt-0.5 shrink-0 ${
                            fase.status === "done" ? "text-emerald-500" : "text-gray-300"
                          }`}>
                            {fase.status === "done" ? "✓" : "·"}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <p>Stack: Next.js 14 · TypeScript · Tailwind · Supabase (PostgreSQL)</p>
          <p>Arquitetura event-sourcing · Dados imutáveis · RLS por perfil</p>
        </div>
      </div>
    </div>
  );
}

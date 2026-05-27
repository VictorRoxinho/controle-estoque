import { TrendingUp, DollarSign, Package, ArrowLeftRight, Shield, BarChart2, Download } from "lucide-react";

const relatorios = [
  {
    id: "abc",
    titulo: "Curva ABC",
    descricao: "Classifica SKUs por volume de vendas e valor. Identifica quais produtos representam 80% do faturamento (classe A).",
    icon: TrendingUp,
    cor: "text-blue-600",
    bg: "bg-blue-50",
    badge: "Giro",
  },
  {
    id: "cmv",
    titulo: "CMV — Custo de Mercadoria Vendida",
    descricao: "Relatório mensal do custo total das saídas por SKU e categoria. Essencial para margem de contribuição.",
    icon: DollarSign,
    cor: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "Financeiro",
  },
  {
    id: "estoque",
    titulo: "Posição Atual de Estoque",
    descricao: "Saldo atual de todos os SKUs com custo médio, valor total e status de estoque mínimo.",
    icon: Package,
    cor: "text-purple-600",
    bg: "bg-purple-50",
    badge: "Operacional",
  },
  {
    id: "movimentacoes",
    titulo: "Movimentações por Período",
    descricao: "Histórico detalhado de todas as movimentações com filtros por tipo, SKU, usuário e data.",
    icon: ArrowLeftRight,
    cor: "text-amber-600",
    bg: "bg-amber-50",
    badge: "Histórico",
  },
  {
    id: "auditoria",
    titulo: "Auditoria",
    descricao: "Log completo de ações do sistema — incluindo tentativas bloqueadas, ajustes e operações por usuário.",
    icon: Shield,
    cor: "text-red-600",
    bg: "bg-red-50",
    badge: "Admin",
  },
];

const kpiRelatorio = [
  { label: "Valor total em estoque", value: "R$ 45.230,00", sub: "124 SKUs ativos" },
  { label: "CMV — Maio 2026", value: "R$ 12.450,00", sub: "Custo das saídas do mês" },
  { label: "Ticket médio de entrada", value: "R$ 2.890,00", sub: "Por NF-e confirmada" },
  { label: "SKUs com giro zero", value: "3", sub: "Sem saída nos últimos 30 dias" },
];

export default function RelatoriosPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-1">Análise e exportação de dados — leitura pura, sem alteração de estoque</p>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpiRelatorio.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-2">{k.label}</p>
            <p className="text-xl font-bold text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Relatórios */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Relatórios disponíveis</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {relatorios.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} className={r.cor} />
                </div>
                <span className="text-xs font-medium text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
                  {r.badge}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{r.titulo}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{r.descricao}</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700">
                  <BarChart2 size={13} />
                  Visualizar
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 ml-auto">
                  <Download size={13} />
                  CSV
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600">
                  <Download size={13} />
                  PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview tabela ABC */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Prévia — Curva ABC (Top 5)</h2>
            <p className="text-xs text-gray-400 mt-0.5">Por valor de saídas — Maio 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="month" defaultValue="2026-05" className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600" />
            <button className="flex items-center gap-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition">
              <Download size={13} />
              Exportar CSV
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-center px-5 py-3 w-12">Rank</th>
              <th className="text-left px-4 py-3">SKU / Produto</th>
              <th className="text-right px-4 py-3">Qtd Vendida</th>
              <th className="text-right px-4 py-3">Valor Saídas</th>
              <th className="text-right px-4 py-3">% Acumulado</th>
              <th className="text-center px-5 py-3">Classe</th>
            </tr>
          </thead>
          <tbody>
            {[
              { rank: 1, sku: "DET-500-AZL", prod: "Detergente 500ml Azul", qtd: 342, valor: 1022.58, pct: 22, classe: "A" },
              { rank: 2, sku: "DES-500-LAV", prod: "Desinfetante 500ml Lavanda", qtd: 289, valor: 1153.11, pct: 47, classe: "A" },
              { rank: 3, sku: "AGM-5L-BRC", prod: "Água Sanitária 5L", qtd: 201, valor: 1989.90, pct: 63, classe: "A" },
              { rank: 4, sku: "SAB-1L-TRN", prod: "Sabão Líquido 1L", qtd: 188, valor: 1407.12, pct: 76, classe: "A" },
              { rank: 5, sku: "LIM-1L-LIM", prod: "Limpa Vidros 1L", qtd: 134, valor: 802.66, pct: 83, classe: "B" },
            ].map((row) => (
              <tr key={row.rank} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-center font-bold text-gray-400">#{row.rank}</td>
                <td className="px-4 py-3.5">
                  <p className="font-mono text-xs font-semibold text-gray-900">{row.sku}</p>
                  <p className="text-xs text-gray-400">{row.prod}</p>
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-gray-700">{row.qtd}</td>
                <td className="px-4 py-3.5 text-right font-mono font-semibold text-gray-900">
                  R$ {row.valor.toFixed(2).replace(".", ",")}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="font-mono text-xs text-gray-500 w-8 text-right">{row.pct}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    row.classe === "A" ? "bg-emerald-100 text-emerald-700" :
                    row.classe === "B" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {row.classe}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import {
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Bell,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Settings2,
} from "lucide-react";

const kpis = [
  {
    label: "Valor Total em Estoque",
    value: "R$ 45.230,00",
    sub: "124 SKUs ativos",
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "CMV do Mês",
    value: "R$ 12.450,00",
    sub: "Mai 2026",
    icon: TrendingDown,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "SKUs Abaixo do Mínimo",
    value: "7",
    sub: "Requer ressuprimento",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Alertas Pendentes",
    value: "3",
    sub: "2 estoque mínimo · 1 suspeito",
    icon: Bell,
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

const movements = [
  { id: 1, sku: "DET-500-AZL", produto: "Detergente 500ml Azul", tipo: "ENTRADA", qtd: 50, saldo: 73, user: "João", data: "27/05 14:32" },
  { id: 2, sku: "SAB-1L-TRN", produto: "Sabão Líquido 1L", tipo: "SAIDA", qtd: 5, saldo: 18, user: "Maria", data: "27/05 12:10" },
  { id: 3, sku: "AGM-5L-BRC", produto: "Água Sanitária 5L", tipo: "AJUSTE_NEG", qtd: 2, saldo: 11, user: "Admin", data: "27/05 09:45" },
  { id: 4, sku: "DES-500-LAV", produto: "Desinfetante 500ml Lavanda", tipo: "SAIDA", qtd: 10, saldo: 22, user: "Pedro", data: "26/05 17:20" },
  { id: 5, sku: "LIM-1L-LIM", produto: "Limpa Vidros 1L", tipo: "ENTRADA", qtd: 30, saldo: 34, user: "João", data: "26/05 15:05" },
];

const tipoBadge: Record<string, string> = {
  ENTRADA: "bg-emerald-100 text-emerald-700",
  SAIDA: "bg-red-100 text-red-700",
  AJUSTE_NEG: "bg-orange-100 text-orange-700",
  AJUSTE_POS: "bg-blue-100 text-blue-700",
  DEVOLUCAO_CLIENTE: "bg-purple-100 text-purple-700",
  DEVOLUCAO_FORNECEDOR: "bg-gray-100 text-gray-700",
};

const tipoIcon: Record<string, React.ReactNode> = {
  ENTRADA: <ArrowUpRight size={14} className="text-emerald-600" />,
  SAIDA: <ArrowDownRight size={14} className="text-red-600" />,
  AJUSTE_NEG: <Settings2 size={14} className="text-orange-600" />,
  AJUSTE_POS: <Settings2 size={14} className="text-blue-600" />,
};

const alerts = [
  { id: 1, tipo: "ESTOQUE_MINIMO", sku: "AGM-5L-BRC", msg: "Água Sanitária 5L atingiu estoque mínimo (11 unidades)", data: "27/05" },
  { id: 2, tipo: "ESTOQUE_MINIMO", sku: "SAB-1L-TRN", msg: "Sabão Líquido 1L atingiu estoque mínimo (18 unidades)", data: "27/05" },
  { id: 3, tipo: "MOVIMENTO_SUSPEITO", sku: "DET-500-AZL", msg: "Múltiplas saídas em curto período por Maria", data: "26/05" },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral do estoque — 27 de maio de 2026</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-gray-500">{kpi.label}</p>
                <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={kpi.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Últimas Movimentações</h2>
            <a href="/movimentacoes" className="text-xs text-blue-600 hover:underline">Ver todas →</a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium">SKU / Produto</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                <th className="text-right px-4 py-3 font-medium">Qtd</th>
                <th className="text-right px-4 py-3 font-medium">Saldo</th>
                <th className="text-left px-4 py-3 font-medium">Usuário</th>
                <th className="text-right px-5 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 text-xs">{m.sku}</p>
                    <p className="text-gray-400 text-xs truncate max-w-40">{m.produto}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${tipoBadge[m.tipo]}`}>
                      {tipoIcon[m.tipo]}
                      {m.tipo.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900">{m.qtd}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900">{m.saldo}</td>
                  <td className="px-4 py-3 text-gray-500">{m.user}</td>
                  <td className="px-5 py-3 text-right text-gray-400 text-xs">{m.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Alertas Recentes</h2>
            <a href="/alertas" className="text-xs text-blue-600 hover:underline">Ver todos →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {alerts.map((a) => (
              <div key={a.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    a.tipo === "MOVIMENTO_SUSPEITO" ? "bg-purple-50" : "bg-amber-50"
                  }`}>
                    {a.tipo === "MOVIMENTO_SUSPEITO"
                      ? <Bell size={13} className="text-purple-600" />
                      : <AlertTriangle size={13} className="text-amber-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-gray-500">{a.sku}</p>
                    <p className="text-xs text-gray-700 mt-0.5 leading-snug">{a.msg}</p>
                    <p className="text-xs text-gray-400 mt-1">{a.data}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Resumo por Categoria</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { cat: "Detergentes", skus: 28, valor: "R$ 9.840,00", pct: 22 },
            { cat: "Desinfetantes", skus: 19, valor: "R$ 7.600,00", pct: 17 },
            { cat: "Água Sanitária", skus: 12, valor: "R$ 5.280,00", pct: 12 },
            { cat: "Sabão Líquido", skus: 22, valor: "R$ 8.120,00", pct: 18 },
          ].map((c) => (
            <div key={c.cat} className="border border-gray-100 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">{c.cat}</p>
              <p className="text-base font-bold text-gray-900">{c.valor}</p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.pct * 4}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{c.skus} SKUs · {c.pct}% do estoque</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

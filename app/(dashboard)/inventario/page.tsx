import { Plus, Eye, CheckCircle, Clock, Search, ClipboardList } from "lucide-react";

const sessoes = [
  { id: 1, descricao: "Inventário Mensal — Maio 2026", status: "CONTANDO", skus: 124, contados: 87, iniciado: "26/05/2026 08:00", responsavel: "Admin", fechado: null },
  { id: 2, descricao: "Inventário Parcial — Detergentes", status: "FECHADA", skus: 28, contados: 28, iniciado: "15/04/2026 09:00", responsavel: "João", fechado: "15/04/2026 14:30" },
  { id: 3, descricao: "Inventário Mensal — Abril 2026", status: "FECHADA", skus: 120, contados: 120, iniciado: "30/04/2026 08:00", responsavel: "Admin", fechado: "30/04/2026 17:00" },
];

const statusCfg: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
  ABERTA: { label: "Aberta", bg: "bg-blue-100 text-blue-700", icon: <Clock size={12} /> },
  CONTANDO: { label: "Em contagem", bg: "bg-amber-100 text-amber-700", icon: <ClipboardList size={12} /> },
  REVISAO: { label: "Em revisão", bg: "bg-orange-100 text-orange-700", icon: <Eye size={12} /> },
  FECHADA: { label: "Fechada", bg: "bg-gray-100 text-gray-500", icon: <CheckCircle size={12} /> },
};

const contagens = [
  { sku: "DET-500-AZL", produto: "Detergente 500ml Azul", sistema: 73, contado: 73, dif: 0 },
  { sku: "SAB-1L-TRN", produto: "Sabão Líquido 1L", sistema: 18, contado: 16, dif: -2 },
  { sku: "AGM-5L-BRC", produto: "Água Sanitária 5L", sistema: 11, contado: 11, dif: 0 },
  { sku: "DES-500-LAV", produto: "Desinfetante 500ml Lavanda", sistema: 22, contado: 25, dif: 3 },
  { sku: "LIM-1L-LIM", produto: "Limpa Vidros 1L", sistema: 34, contado: 34, dif: 0 },
];

export default function InventarioPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventário</h1>
          <p className="text-sm text-gray-500 mt-1">1 sessão ativa · 87 de 124 SKUs contados</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          <Plus size={16} />
          Nova Sessão
        </button>
      </div>

      {/* Sessão ativa */}
      <div className="bg-white rounded-xl border-2 border-blue-200 p-5 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                <ClipboardList size={12} />
                Em contagem
              </span>
              <span className="text-xs text-gray-400">Sessão #1</span>
            </div>
            <h2 className="text-base font-semibold text-gray-900">Inventário Mensal — Maio 2026</h2>
            <p className="text-sm text-gray-500 mt-0.5">Iniciado em 26/05/2026 às 08:00 por Admin</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">87 / 124</p>
            <p className="text-xs text-gray-400">SKUs contados</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }} />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-400">70% concluído</p>
            <p className="text-xs text-gray-400">37 SKUs restantes</p>
          </div>
        </div>

        {/* Contagens recentes */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contagens recentes</p>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Buscar SKU..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 font-medium">
                <th className="text-left pb-2">SKU</th>
                <th className="text-right pb-2">Sistema</th>
                <th className="text-right pb-2">Contado</th>
                <th className="text-right pb-2">Diferença</th>
                <th className="text-left pb-2 pl-4">Ação</th>
              </tr>
            </thead>
            <tbody>
              {contagens.map((c) => (
                <tr key={c.sku} className="border-t border-gray-50">
                  <td className="py-2.5">
                    <p className="font-mono text-xs font-semibold text-gray-900">{c.sku}</p>
                    <p className="text-xs text-gray-400">{c.produto}</p>
                  </td>
                  <td className="py-2.5 text-right font-mono text-gray-500">{c.sistema}</td>
                  <td className="py-2.5 text-right font-mono font-semibold text-gray-900">{c.contado}</td>
                  <td className={`py-2.5 text-right font-mono font-bold ${
                    c.dif === 0 ? "text-gray-400" : c.dif > 0 ? "text-blue-600" : "text-red-600"
                  }`}>
                    {c.dif > 0 ? `+${c.dif}` : c.dif === 0 ? "—" : c.dif}
                  </td>
                  <td className="py-2.5 pl-4">
                    {c.dif !== 0 && (
                      <span className="text-xs text-amber-600 font-medium">Ajuste necessário</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <button className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            Registrar Contagem
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            Fechar Sessão e Aplicar Ajustes
          </button>
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Histórico de Sessões</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-left px-5 py-3">Descrição</th>
              <th className="text-center px-4 py-3">SKUs</th>
              <th className="text-left px-4 py-3">Iniciado em</th>
              <th className="text-left px-4 py-3">Fechado em</th>
              <th className="text-left px-4 py-3">Responsável</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sessoes.filter(s => s.status === "FECHADA").map((s) => {
              const cfg = statusCfg[s.status];
              return (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{s.descricao}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-gray-600">{s.skus}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs">{s.iniciado}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs">{s.fechado ?? "—"}</td>
                  <td className="px-4 py-3.5 text-gray-600">{s.responsavel}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg}`}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

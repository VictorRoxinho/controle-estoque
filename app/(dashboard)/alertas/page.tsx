import { AlertTriangle, Bell, CheckCircle, EyeOff, Eye } from "lucide-react";

const alertas = [
  { id: 1, tipo: "ESTOQUE_MINIMO", sku: "AGM-5L-BRC", produto: "Água Sanitária 5L", msg: "SKU AGM-5L-BRC atingiu estoque mínimo (11 unidades). Mínimo configurado: 15.", status: "PENDENTE", data: "27/05/2026 14:20" },
  { id: 2, tipo: "ESTOQUE_MINIMO", sku: "SAB-1L-TRN", produto: "Sabão Líquido 1L", msg: "SKU SAB-1L-TRN atingiu estoque mínimo (18 unidades). Mínimo configurado: 20.", status: "PENDENTE", data: "27/05/2026 12:10" },
  { id: 3, tipo: "MOVIMENTO_SUSPEITO", sku: "DET-500-AZL", produto: "Detergente 500ml Azul", msg: "Usuário Maria realizou 4 saídas em menos de 30 minutos totalizando 62 unidades.", status: "PENDENTE", data: "27/05/2026 09:50" },
  { id: 4, tipo: "ESTOQUE_MINIMO", sku: "DES-1L-PNH", produto: "Desinfetante 1L Pinho", msg: "SKU DES-1L-PNH está com estoque zero. Mínimo configurado: 10.", status: "VISUALIZADO", data: "26/05/2026 18:00" },
  { id: 5, tipo: "ESTOQUE_MINIMO", sku: "LIM-500-LIM", produto: "Limpa Vidros 500ml", msg: "SKU LIM-500-LIM atingiu estoque mínimo (3 unidades). Mínimo configurado: 8.", status: "RESOLVIDO", data: "25/05/2026 10:30" },
];

const tipoCfg: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  ESTOQUE_MINIMO: { label: "Estoque Mínimo", icon: <AlertTriangle size={14} />, color: "text-amber-600", bg: "bg-amber-50" },
  MOVIMENTO_SUSPEITO: { label: "Movimento Suspeito", icon: <Bell size={14} />, color: "text-purple-600", bg: "bg-purple-50" },
};

const statusCfg: Record<string, { label: string; bg: string }> = {
  PENDENTE: { label: "Pendente", bg: "bg-red-100 text-red-700" },
  VISUALIZADO: { label: "Visualizado", bg: "bg-yellow-100 text-yellow-700" },
  RESOLVIDO: { label: "Resolvido", bg: "bg-emerald-100 text-emerald-700" },
  IGNORADO: { label: "Ignorado", bg: "bg-gray-100 text-gray-500" },
};

export default function AlertasPage() {
  const pendentes = alertas.filter(a => a.status === "PENDENTE").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
          <p className="text-sm text-gray-500 mt-1">{pendentes} alertas pendentes · {alertas.length} total</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Pendentes", value: 3, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
          { label: "Visualizados", value: 1, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
          { label: "Resolvidos", value: 1, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Ignorados", value: 0, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-5">
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option>Todos os tipos</option>
          <option>Estoque Mínimo</option>
          <option>Movimento Suspeito</option>
        </select>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option>Todos os status</option>
          <option>Pendente</option>
          <option>Visualizado</option>
          <option>Resolvido</option>
          <option>Ignorado</option>
        </select>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {alertas.map((a) => {
          const tipo = tipoCfg[a.tipo];
          const status = statusCfg[a.status];
          return (
            <div key={a.id} className={`bg-white rounded-xl border border-gray-200 p-5 ${a.status === "PENDENTE" ? "border-l-4 border-l-red-400" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-lg ${tipo.bg} flex items-center justify-center shrink-0 mt-0.5 ${tipo.color}`}>
                    {tipo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">{tipo.label}</span>
                      <span className="text-gray-300">·</span>
                      <span className="font-mono text-xs text-gray-600">{a.sku}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{a.produto}</span>
                    </div>
                    <p className="text-sm text-gray-700">{a.msg}</p>
                    <p className="text-xs text-gray-400 mt-1.5">{a.data}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${status.bg}`}>
                    {status.label}
                  </span>
                  {a.status === "PENDENTE" && (
                    <>
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Resolver">
                        <CheckCircle size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Visualizar">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Ignorar">
                        <EyeOff size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-right">
        Alertas não podem ser excluídos — apenas resolvidos ou ignorados.
      </p>
    </div>
  );
}

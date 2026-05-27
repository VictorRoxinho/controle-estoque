import { Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Settings2, RotateCcw } from "lucide-react";

const movimentos = [
  { id: "MV-0041", sku: "DET-500-AZL", produto: "Detergente 500ml Azul", tipo: "ENTRADA", qtd: 50, antes: 23, depois: 73, custo: 1.20, ref: "NF-e 000142", user: "João", data: "27/05/2026 14:32" },
  { id: "MV-0040", sku: "SAB-1L-TRN", produto: "Sabão Líquido 1L", tipo: "SAIDA", qtd: 5, antes: 23, depois: 18, custo: null, ref: "Venda balcão", user: "Maria", data: "27/05/2026 12:10" },
  { id: "MV-0039", sku: "AGM-5L-BRC", produto: "Água Sanitária 5L", tipo: "AJUSTE_NEG", qtd: 2, antes: 13, depois: 11, custo: null, ref: null, user: "Admin", data: "27/05/2026 09:45" },
  { id: "MV-0038", sku: "DES-500-LAV", produto: "Desinfetante 500ml Lavanda", tipo: "SAIDA", qtd: 10, antes: 32, depois: 22, custo: null, ref: "Venda balcão", user: "Pedro", data: "26/05/2026 17:20" },
  { id: "MV-0037", sku: "LIM-1L-LIM", produto: "Limpa Vidros 1L", tipo: "ENTRADA", qtd: 30, antes: 4, depois: 34, custo: 3.10, ref: "NF-e 000141", user: "João", data: "26/05/2026 15:05" },
  { id: "MV-0036", sku: "AMA-2L-ROA", produto: "Amaciante 2L Rosa", tipo: "DEVOLUCAO_CLIENTE", qtd: 2, antes: 27, depois: 29, custo: null, ref: "Dev. cliente #88", user: "Maria", data: "26/05/2026 11:30" },
  { id: "MV-0035", sku: "DET-1L-AZL", produto: "Detergente 1L Azul", tipo: "AJUSTE_POS", qtd: 3, antes: 38, depois: 41, custo: null, ref: null, user: "Admin", data: "25/05/2026 16:00" },
];

const tipoCfg: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
  ENTRADA: { label: "Entrada", bg: "bg-emerald-100 text-emerald-700", icon: <ArrowUpRight size={13} /> },
  SAIDA: { label: "Saída", bg: "bg-red-100 text-red-700", icon: <ArrowDownRight size={13} /> },
  AJUSTE_NEG: { label: "Ajuste −", bg: "bg-orange-100 text-orange-700", icon: <Settings2 size={13} /> },
  AJUSTE_POS: { label: "Ajuste +", bg: "bg-blue-100 text-blue-700", icon: <Settings2 size={13} /> },
  DEVOLUCAO_CLIENTE: { label: "Dev. Cliente", bg: "bg-purple-100 text-purple-700", icon: <RotateCcw size={13} /> },
  DEVOLUCAO_FORNECEDOR: { label: "Dev. Fornecedor", bg: "bg-gray-100 text-gray-700", icon: <RotateCcw size={13} /> },
};

export default function MovimentacoesPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimentações</h1>
          <p className="text-sm text-gray-500 mt-1">Registro imutável de todas as alterações de estoque</p>
        </div>
        <a
          href="/movimentacoes/nova"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Nova Movimentação
        </a>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por SKU ou referência..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option>Todos os tipos</option>
          <option>Entrada</option>
          <option>Saída</option>
          <option>Ajuste +</option>
          <option>Ajuste −</option>
          <option>Devolução</option>
        </select>
        <div className="flex items-center gap-2">
          <input type="date" defaultValue="2026-05-27" className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" />
          <span className="text-gray-400 text-sm">até</span>
          <input type="date" defaultValue="2026-05-27" className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" />
        </div>
        <button className="flex items-center gap-2 text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 transition">
          <Filter size={14} />
          Filtros
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-left px-5 py-3">ID</th>
              <th className="text-left px-4 py-3">SKU / Produto</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-right px-4 py-3">Qtd</th>
              <th className="text-right px-4 py-3">Antes</th>
              <th className="text-right px-4 py-3">Depois</th>
              <th className="text-left px-4 py-3">Referência</th>
              <th className="text-left px-4 py-3">Usuário</th>
              <th className="text-right px-5 py-3">Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {movimentos.map((m) => {
              const cfg = tipoCfg[m.tipo];
              return (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{m.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-mono text-xs font-semibold text-gray-900">{m.sku}</p>
                    <p className="text-xs text-gray-400 truncate max-w-36">{m.produto}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg}`}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-semibold text-gray-900">{m.qtd}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-gray-400">{m.antes}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-semibold text-gray-900">{m.depois}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{m.ref ?? <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3.5 text-gray-600">{m.user}</td>
                  <td className="px-5 py-3.5 text-right text-xs text-gray-400 whitespace-nowrap">{m.data}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">
        Movimentações são imutáveis — nenhuma edição ou exclusão é permitida.
      </p>
    </div>
  );
}

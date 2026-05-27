import { Plus, Search, Eye, Pencil, ArrowLeftRight } from "lucide-react";

const skus = [
  { id: 1, codigo: "DET-500-AZL", produto: "Detergente Neutro", tamanho: "500ml", cor: "Azul", barras: "7891234560001", venda: 2.99, atual: 73, minimo: 20, status: "ok" },
  { id: 2, codigo: "DET-1L-AZL", produto: "Detergente Neutro", tamanho: "1L", cor: "Azul", barras: "7891234560002", venda: 4.99, atual: 41, minimo: 15, status: "ok" },
  { id: 3, codigo: "SAB-1L-TRN", produto: "Sabão Líquido", tamanho: "1L", cor: "Transparente", barras: "7891234560010", venda: 7.49, atual: 18, minimo: 20, status: "baixo" },
  { id: 4, codigo: "AGM-5L-BRC", produto: "Água Sanitária", tamanho: "5L", cor: "Branco", barras: "7891234560020", venda: 9.90, atual: 11, minimo: 15, status: "baixo" },
  { id: 5, codigo: "DES-500-LAV", produto: "Desinfetante", tamanho: "500ml", cor: "Lavanda", barras: "7891234560030", venda: 3.99, atual: 22, minimo: 10, status: "ok" },
  { id: 6, codigo: "DES-1L-PNH", produto: "Desinfetante", tamanho: "1L", cor: "Pinho", barras: "7891234560031", venda: 6.49, atual: 0, minimo: 10, status: "zero" },
  { id: 7, codigo: "LIM-1L-LIM", produto: "Limpa Vidros", tamanho: "1L", cor: "Limão", barras: "7891234560040", venda: 5.99, atual: 34, minimo: 8, status: "ok" },
  { id: 8, codigo: "AMA-2L-ROA", produto: "Amaciante", tamanho: "2L", cor: "Rosa Amanhecer", barras: "7891234560050", venda: 12.90, atual: 29, minimo: 12, status: "ok" },
];

const statusBadge = {
  ok: "bg-emerald-100 text-emerald-700",
  baixo: "bg-amber-100 text-amber-700",
  zero: "bg-red-100 text-red-700",
};

const statusLabel = {
  ok: "Normal",
  baixo: "Abaixo do mínimo",
  zero: "Sem estoque",
};

export default function SkusPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SKUs</h1>
          <p className="text-sm text-gray-500 mt-1">8 variações cadastradas · 2 abaixo do mínimo</p>
        </div>
        <a
          href="/skus/novo"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Novo SKU
        </a>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código, produto ou barras..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option>Todos os produtos</option>
          <option>Detergente Neutro</option>
          <option>Sabão Líquido</option>
          <option>Água Sanitária</option>
        </select>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option>Todos os status</option>
          <option>Normal</option>
          <option>Abaixo do mínimo</option>
          <option>Sem estoque</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-left px-5 py-3">Código SKU</th>
              <th className="text-left px-4 py-3">Produto</th>
              <th className="text-left px-4 py-3">Tamanho / Cor</th>
              <th className="text-left px-4 py-3">Cód. Barras</th>
              <th className="text-right px-4 py-3">Preço Venda</th>
              <th className="text-right px-4 py-3">Estoque</th>
              <th className="text-right px-4 py-3">Mínimo</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {skus.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-900">{s.codigo}</td>
                <td className="px-4 py-3.5 text-gray-700">{s.produto}</td>
                <td className="px-4 py-3.5 text-gray-600 text-xs">{s.tamanho} · {s.cor}</td>
                <td className="px-4 py-3.5 font-mono text-xs text-gray-400">{s.barras}</td>
                <td className="px-4 py-3.5 text-right font-medium text-gray-900">
                  R$ {s.venda.toFixed(2).replace(".", ",")}
                </td>
                <td className={`px-4 py-3.5 text-right font-bold font-mono ${
                  s.atual === 0 ? "text-red-600" : s.status === "baixo" ? "text-amber-600" : "text-gray-900"
                }`}>
                  {s.atual}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-gray-400">{s.minimo}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[s.status as keyof typeof statusBadge]}`}>
                    {statusLabel[s.status as keyof typeof statusLabel]}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Visualizar">
                      <Eye size={15} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Editar">
                      <Pencil size={15} />
                    </button>
                    <a href="/movimentacoes/nova" className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Nova movimentação">
                      <ArrowLeftRight size={15} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

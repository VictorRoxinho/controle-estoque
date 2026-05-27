import { Plus, Search, Eye, Pencil, PowerOff } from "lucide-react";

const produtos = [
  { id: 1, nome: "Detergente Neutro", ncm: "34022000", categoria: "Detergentes", fornecedor: "Química Brasil", skus: 4, ativo: true },
  { id: 2, nome: "Sabão Líquido", ncm: "34011900", categoria: "Sabões", fornecedor: "CleanPro", skus: 3, ativo: true },
  { id: 3, nome: "Água Sanitária", ncm: "28281000", categoria: "Sanitizantes", fornecedor: "HigiênePlus", skus: 3, ativo: true },
  { id: 4, nome: "Desinfetante", ncm: "38089400", categoria: "Desinfetantes", fornecedor: "Química Brasil", skus: 5, ativo: true },
  { id: 5, nome: "Limpa Vidros", ncm: "38091000", categoria: "Limpeza Geral", fornecedor: "CleanPro", skus: 2, ativo: true },
  { id: 6, nome: "Amaciante de Roupas", ncm: "34021300", categoria: "Lavanderia", fornecedor: "TextilCare", skus: 4, ativo: true },
  { id: 7, nome: "Lava-louças em Pó", ncm: "34022000", categoria: "Detergentes", fornecedor: "CleanPro", skus: 2, ativo: false },
  { id: 8, nome: "Multiuso Concentrado", ncm: "38091000", categoria: "Limpeza Geral", fornecedor: "HigiênePlus", skus: 3, ativo: true },
];

export default function ProdutosPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">8 produtos cadastrados · 7 ativos</p>
        </div>
        <a
          href="/produtos/novo"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          Novo Produto
        </a>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou NCM..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option value="">Todas as categorias</option>
          <option>Detergentes</option>
          <option>Sabões</option>
          <option>Sanitizantes</option>
          <option>Desinfetantes</option>
          <option>Limpeza Geral</option>
          <option>Lavanderia</option>
        </select>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option value="">Todos os status</option>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-left px-5 py-3">Nome</th>
              <th className="text-left px-4 py-3">NCM</th>
              <th className="text-left px-4 py-3">Categoria</th>
              <th className="text-left px-4 py-3">Fornecedor</th>
              <th className="text-center px-4 py-3">SKUs</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-900">{p.nome}</td>
                <td className="px-4 py-3.5 font-mono text-xs text-gray-600">{p.ncm}</td>
                <td className="px-4 py-3.5 text-gray-600">{p.categoria}</td>
                <td className="px-4 py-3.5 text-gray-600">{p.fornecedor}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    {p.skus}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                    p.ativo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {p.ativo ? "Ativo" : "Inativo"}
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
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Desativar">
                      <PowerOff size={15} />
                    </button>
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

import { Plus, Pencil, PowerOff } from "lucide-react";

const categorias = [
  { id: 1, nome: "Detergentes", descricao: "Detergentes neutros, concentrados e especiais", produtos: 12, ativo: true },
  { id: 2, nome: "Sabões", descricao: "Sabão em barra, líquido e em pó", produtos: 8, ativo: true },
  { id: 3, nome: "Sanitizantes", descricao: "Água sanitária e alvejantes", produtos: 6, ativo: true },
  { id: 4, nome: "Desinfetantes", descricao: "Desinfetantes de uso geral e banheiro", produtos: 9, ativo: true },
  { id: 5, nome: "Limpeza Geral", descricao: "Produtos multiuso, limpa vidros e superfícies", produtos: 11, ativo: true },
  { id: 6, nome: "Lavanderia", descricao: "Amaciantes, tira-manchas e lava-roupas", produtos: 7, ativo: true },
  { id: 7, nome: "Higiene Pessoal", descricao: "Álcool em gel e antissépticos", produtos: 4, ativo: false },
];

export default function CategoriasPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-sm text-gray-500 mt-1">7 categorias · 57 produtos distribuídos</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          <Plus size={16} />
          Nova Categoria
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-left px-5 py-3">Nome</th>
              <th className="text-left px-4 py-3">Descrição</th>
              <th className="text-center px-4 py-3">Produtos</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-gray-900">{c.nome}</td>
                <td className="px-4 py-3.5 text-gray-500 text-xs max-w-xs">{c.descricao}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    {c.produtos}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                    c.ativo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {c.ativo ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition">
                      <Pencil size={15} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
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

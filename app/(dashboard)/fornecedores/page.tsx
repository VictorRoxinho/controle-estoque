import { Plus, Search, Eye, Pencil, PowerOff } from "lucide-react";

const fornecedores = [
  { id: 1, razao: "Química Brasil Ltda.", fantasia: "QuímBrasil", cnpj: "12.345.678/0001-90", email: "compras@quimbrasil.com.br", telefone: "(11) 3456-7890", contato: "Roberto Alves", ativo: true, produtos: 18 },
  { id: 2, razao: "CleanPro Distribuidora S.A.", fantasia: "CleanPro", cnpj: "98.765.432/0001-10", email: "vendas@cleanpro.com.br", telefone: "(21) 2345-6789", contato: "Ana Lima", ativo: true, produtos: 14 },
  { id: 3, razao: "HigiênePlus Comércio Ltda.", fantasia: "HigiênePlus", cnpj: "11.222.333/0001-44", email: "comercial@higieneplus.com.br", telefone: "(31) 4567-8901", contato: "Carlos Souza", ativo: true, produtos: 9 },
  { id: 4, razao: "TextilCare Indústria Ltda.", fantasia: "TextilCare", cnpj: "55.666.777/0001-88", email: "contato@textilcare.com.br", telefone: "(41) 5678-9012", contato: "Fernanda Costa", ativo: true, produtos: 7 },
  { id: 5, razao: "EcoClean Produtos Naturais ME", fantasia: "EcoClean", cnpj: "33.444.555/0001-22", email: "eco@ecoclean.com.br", telefone: "(51) 6789-0123", contato: "Paulo Martins", ativo: false, produtos: 3 },
];

function formatCNPJ(cnpj: string) {
  return cnpj;
}

export default function FornecedoresPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-sm text-gray-500 mt-1">5 fornecedores · 4 ativos</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          <Plus size={16} />
          Novo Fornecedor
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option>Todos os status</option>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-left px-5 py-3">Razão Social / Fantasia</th>
              <th className="text-left px-4 py-3">CNPJ</th>
              <th className="text-left px-4 py-3">Contato</th>
              <th className="text-left px-4 py-3">Email / Telefone</th>
              <th className="text-center px-4 py-3">Produtos</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((f) => (
              <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-gray-900">{f.razao}</p>
                  <p className="text-xs text-gray-400">{f.fantasia}</p>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-gray-600">{formatCNPJ(f.cnpj)}</td>
                <td className="px-4 py-3.5 text-gray-600 text-xs">{f.contato}</td>
                <td className="px-4 py-3.5">
                  <p className="text-xs text-gray-600">{f.email}</p>
                  <p className="text-xs text-gray-400">{f.telefone}</p>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    {f.produtos}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                    f.ativo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {f.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Eye size={15} />
                    </button>
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

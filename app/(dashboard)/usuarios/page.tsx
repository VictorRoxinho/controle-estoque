import { Plus, Pencil, PowerOff } from "lucide-react";

const usuarios = [
  { id: 1, nome: "Admin", email: "admin@loja.com", role: "ADMIN", ativo: true, criado: "01/01/2026" },
  { id: 2, nome: "João Silva", email: "joao@loja.com", role: "OPERADOR", ativo: true, criado: "10/02/2026" },
  { id: 3, nome: "Maria Souza", email: "maria@loja.com", role: "VENDEDOR", ativo: true, criado: "10/02/2026" },
  { id: 4, nome: "Pedro Lima", email: "pedro@loja.com", role: "VENDEDOR", ativo: true, criado: "15/03/2026" },
  { id: 5, nome: "Carla Mendes", email: "carla@loja.com", role: "FINANCEIRO", ativo: true, criado: "01/04/2026" },
  { id: 6, nome: "Antigo Operador", email: "antigo@loja.com", role: "OPERADOR", ativo: false, criado: "05/01/2026" },
];

const roleCfg: Record<string, { label: string; bg: string }> = {
  ADMIN: { label: "Admin", bg: "bg-purple-100 text-purple-700" },
  OPERADOR: { label: "Operador", bg: "bg-blue-100 text-blue-700" },
  VENDEDOR: { label: "Vendedor", bg: "bg-emerald-100 text-emerald-700" },
  FINANCEIRO: { label: "Financeiro", bg: "bg-amber-100 text-amber-700" },
};

export default function UsuariosPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-sm text-gray-500 mt-1">6 usuários · 5 ativos · Apenas Admin gerencia esta tela</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          <Plus size={16} />
          Novo Usuário
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <span className="font-semibold">Acesso restrito.</span> Apenas Admins podem criar, editar ou desativar usuários. Usuários não são excluídos — apenas desativados.
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-left px-5 py-3">Nome</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-center px-4 py-3">Perfil</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Criado em</th>
              <th className="text-right px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const role = roleCfg[u.role];
              return (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                        {u.nome[0]}
                      </div>
                      <span className="font-medium text-gray-900">{u.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${role.bg}`}>
                      {role.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${
                      u.ativo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {u.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs">{u.criado}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {u.role !== "ADMIN" && (
                        <>
                          <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition">
                            <Pencil size={15} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <PowerOff size={15} />
                          </button>
                        </>
                      )}
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

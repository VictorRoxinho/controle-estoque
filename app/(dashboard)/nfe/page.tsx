import { Upload, Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

const nfeList = [
  { id: 1, numero: "000142", serie: "001", fornecedor: "Química Brasil Ltda.", cnpj: "12.345.678/0001-90", emissao: "27/05/2026", valor: 4850.00, itens: 12, status: "PENDENTE" },
  { id: 2, numero: "000141", serie: "001", fornecedor: "CleanPro Distribuidora S.A.", cnpj: "98.765.432/0001-10", emissao: "26/05/2026", valor: 2120.50, itens: 8, status: "CONFIRMADA" },
  { id: 3, numero: "000140", serie: "001", fornecedor: "HigiênePlus Comércio Ltda.", cnpj: "11.222.333/0001-44", emissao: "24/05/2026", valor: 980.00, itens: 5, status: "CONFIRMADA" },
  { id: 4, numero: "000139", serie: "001", fornecedor: "TextilCare Indústria Ltda.", cnpj: "55.666.777/0001-88", emissao: "20/05/2026", valor: 1430.00, itens: 6, status: "REJEITADA" },
  { id: 5, numero: "000138", serie: "001", fornecedor: "CleanPro Distribuidora S.A.", cnpj: "98.765.432/0001-10", emissao: "18/05/2026", valor: 3200.00, itens: 14, status: "CONFIRMADA" },
];

const statusCfg: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
  PENDENTE: { label: "Pendente", bg: "bg-amber-100 text-amber-700", icon: <Clock size={12} /> },
  CONFIRMADA: { label: "Confirmada", bg: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={12} /> },
  REJEITADA: { label: "Rejeitada", bg: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
  CANCELADA: { label: "Cancelada", bg: "bg-gray-100 text-gray-500", icon: <XCircle size={12} /> },
};

export default function NfePage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NF-e</h1>
          <p className="text-sm text-gray-500 mt-1">5 notas importadas · 1 aguardando confirmação</p>
        </div>
        <a
          href="/nfe/importar"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <Upload size={16} />
          Importar NF-e
        </a>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número, fornecedor ou CNPJ..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option>Todos os status</option>
          <option>Pendente</option>
          <option>Confirmada</option>
          <option>Rejeitada</option>
          <option>Cancelada</option>
        </select>
        <input type="month" defaultValue="2026-05" className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-left px-5 py-3">Nº / Série</th>
              <th className="text-left px-4 py-3">Fornecedor</th>
              <th className="text-left px-4 py-3">CNPJ</th>
              <th className="text-left px-4 py-3">Emissão</th>
              <th className="text-right px-4 py-3">Valor Total</th>
              <th className="text-center px-4 py-3">Itens</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {nfeList.map((n) => {
              const cfg = statusCfg[n.status];
              return (
                <tr key={n.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs">
                    <p className="font-semibold text-gray-900">{n.numero}</p>
                    <p className="text-gray-400">Série {n.serie}</p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-900">{n.fornecedor}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{n.cnpj}</td>
                  <td className="px-4 py-3.5 text-gray-600">{n.emissao}</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-gray-900">
                    R$ {n.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      {n.itens}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg}`}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/nfe/${n.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Abrir">
                        <Eye size={15} />
                      </a>
                      {n.status === "PENDENTE" && (
                        <button className="text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-2 py-1 rounded-lg transition">
                          Confirmar
                        </button>
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

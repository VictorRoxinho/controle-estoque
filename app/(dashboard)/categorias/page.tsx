import { Pencil, PowerOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server"
import { NovaCategoriaModal } from "./nova-categoria-modal"

export default async function CategoriasPage() {
  const supabase = await createClient()
  const { data: categorias } = await supabase.from("categories").select("*")
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-sm text-gray-500 mt-1">X categorias · YY produtos distribuídos</p>
        </div>
        <NovaCategoriaModal />
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
            {(categorias ?? []).map((c) => (
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

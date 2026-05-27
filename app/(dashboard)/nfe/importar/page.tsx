import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Link2 } from "lucide-react";

const itens = [
  { id: 1, cod: "7891234560001", desc: "DETERGENTE NEUTRO 500ML AZUL", ncm: "34022000", qtd: 50, unit: "UN", valor: 1.20, total: 60.00, sku: "DET-500-AZL", vinculado: true },
  { id: 2, cod: "7891234560002", desc: "DETERGENTE NEUTRO 1L AZUL", ncm: "34022000", qtd: 30, unit: "UN", valor: 2.10, total: 63.00, sku: "DET-1L-AZL", vinculado: true },
  { id: 3, cod: "7891234560099", desc: "MULTIUSO CONCENTRADO 500ML", ncm: "38091000", qtd: 24, unit: "UN", valor: 1.85, total: 44.40, sku: null, vinculado: false },
  { id: 4, cod: "7891234560020", desc: "AGUA SANITARIA 5L", ncm: "28281000", qtd: 20, unit: "UN", valor: 4.90, total: 98.00, sku: "AGM-5L-BRC", vinculado: true },
];

export default function ImportarNfePage() {
  const temPendente = itens.some(i => !i.vinculado);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <a href="/nfe" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Importar NF-e</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload do XML e vinculação com SKUs internos</p>
        </div>
      </div>

      {/* Etapas */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: "Upload XML", done: true },
          { n: 2, label: "Validação SEFAZ", done: true },
          { n: 3, label: "Vincular itens", done: false, current: true },
          { n: 4, label: "Confirmar recebimento", done: false },
        ].map((step, i, arr) => (
          <div key={step.n} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step.done ? "bg-emerald-500 text-white" : step.current ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}>
                {step.done ? <CheckCircle size={14} /> : step.n}
              </div>
              <span className={`text-sm font-medium ${step.current ? "text-blue-600" : step.done ? "text-gray-600" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
            {i < arr.length - 1 && <div className="w-12 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* NF-e info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <FileText size={20} className="text-gray-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">NF-e nº 000142 — Série 001</p>
            <p className="text-sm text-gray-500">Química Brasil Ltda. · CNPJ 12.345.678/0001-90 · Emitida em 27/05/2026</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-400">Valor total</p>
            <p className="text-lg font-bold text-gray-900">R$ 4.850,00</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-500" />
          <p className="text-xs text-emerald-700 font-medium">Chave validada na SEFAZ · 35260512345678000190550010001420001</p>
        </div>
      </div>

      {/* Alerta itens sem vínculo */}
      {temPendente && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex gap-3">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">1 item sem SKU vinculado.</span> Todos os itens precisam ser vinculados a um SKU interno antes de confirmar o recebimento.
          </p>
        </div>
      )}

      {/* Itens da NF-e */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Itens da NF-e ({itens.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-500 font-medium">
              <th className="text-left px-5 py-3">Produto (NF)</th>
              <th className="text-left px-4 py-3">NCM</th>
              <th className="text-right px-4 py-3">Qtd</th>
              <th className="text-right px-4 py-3">Valor Unit.</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">SKU Vinculado</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-mono text-xs text-gray-400">{item.cod}</p>
                  <p className="text-gray-900 font-medium text-xs mt-0.5">{item.desc}</p>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{item.ncm}</td>
                <td className="px-4 py-3.5 text-right font-mono">{item.qtd} {item.unit}</td>
                <td className="px-4 py-3.5 text-right font-mono text-gray-700">R$ {item.valor.toFixed(2)}</td>
                <td className="px-4 py-3.5 text-right font-mono font-semibold text-gray-900">R$ {item.total.toFixed(2)}</td>
                <td className="px-4 py-3.5">
                  {item.vinculado ? (
                    <div className="flex items-center gap-2">
                      <Link2 size={13} className="text-emerald-500 shrink-0" />
                      <span className="font-mono text-xs font-semibold text-emerald-700">{item.sku}</span>
                    </div>
                  ) : (
                    <button className="flex items-center gap-1 text-xs text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition font-medium">
                      <Link2 size={12} />
                      Vincular SKU
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <a href="/nfe" className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
          Cancelar
        </a>
        <button
          disabled={temPendente}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition disabled:cursor-not-allowed"
        >
          Confirmar Recebimento e Dar Entrada no Estoque
        </button>
      </div>
    </div>
  );
}

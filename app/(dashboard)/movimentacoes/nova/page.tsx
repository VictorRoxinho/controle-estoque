import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NovaMovimentacaoPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <a href="/movimentacoes" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Movimentação</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registrar alteração de estoque manualmente</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Atenção: operação irreversível</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Movimentações não podem ser editadas ou excluídas após o registro.
            Erros devem ser corrigidos com uma movimentação de ajuste.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimentação *</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "ENTRADA", label: "Entrada", color: "border-emerald-500 bg-emerald-50 text-emerald-700" },
              { value: "SAIDA", label: "Saída", color: "border-red-500 bg-red-50 text-red-700" },
              { value: "AJUSTE_POS", label: "Ajuste +", color: "border-blue-500 bg-blue-50 text-blue-700" },
              { value: "AJUSTE_NEG", label: "Ajuste −", color: "border-orange-500 bg-orange-50 text-orange-700" },
              { value: "DEVOLUCAO_CLIENTE", label: "Dev. Cliente", color: "border-purple-500 bg-purple-50 text-purple-700" },
              { value: "DEVOLUCAO_FORNECEDOR", label: "Dev. Fornecedor", color: "border-gray-400 bg-gray-50 text-gray-700" },
            ].map((t) => (
              <button
                key={t.value}
                className={`py-2.5 px-3 rounded-lg border-2 text-xs font-semibold text-center transition ${
                  t.value === "ENTRADA" ? t.color : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU *</label>
          <input
            type="text"
            placeholder="Busque por código, código de barras ou nome do produto..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">DET-500-AZL</p>
                <p className="text-xs text-gray-500">Detergente Neutro 500ml Azul</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">73 un.</p>
                <p className="text-xs text-gray-400">estoque atual</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quantidade e Custo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantidade *</label>
            <input
              type="number"
              min={1}
              placeholder="0"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Custo Unitário <span className="text-gray-400 font-normal">(obrigatório para Entrada)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Referência */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Documento de Referência <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: NF-e 000142, Pedido #88, Venda balcão..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Justificativa (para ajustes) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Justificativa <span className="text-red-500">*</span>{" "}
            <span className="text-gray-400 font-normal">(obrigatória para ajustes — mín. 10 caracteres)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Ex: Contagem física revelou diferença de 2 unidades por produto avariado no transporte..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Prévia da Movimentação</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400">Saldo antes</p>
              <p className="font-bold text-gray-900 mt-0.5">73</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">+ Quantidade</p>
              <p className="font-bold text-emerald-600 mt-0.5">+50</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Saldo depois</p>
              <p className="font-bold text-gray-900 mt-0.5">123</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <a href="/movimentacoes" className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            Cancelar
          </a>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
            Registrar Movimentação
          </button>
        </div>
      </div>
    </div>
  );
}

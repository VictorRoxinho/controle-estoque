import { Package } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Package size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Controle de Estoque</h1>
          <p className="text-sm text-gray-500 mt-1">Faça login para continuar</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                placeholder="admin@loja.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <a
              href="/dashboard"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center"
            >
              Entrar
            </a>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Acesso restrito — contate o administrador para obter credenciais.
        </p>
      </div>
    </div>
  );
}

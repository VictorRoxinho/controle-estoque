"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Truck,
  ArrowLeftRight,
  FileText,
  ClipboardList,
  Bell,
  BarChart2,
  Users,
  LogOut,
} from "lucide-react";

const navGroups = [
  {
    label: null,
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Cadastros",
    items: [
      { href: "/produtos", label: "Produtos", icon: Package },
      { href: "/skus", label: "SKUs", icon: Layers },
      { href: "/categorias", label: "Categorias", icon: Tag },
      { href: "/fornecedores", label: "Fornecedores", icon: Truck },
    ],
  },
  {
    label: "Estoque",
    items: [
      { href: "/movimentacoes", label: "Movimentações", icon: ArrowLeftRight },
      { href: "/nfe", label: "NF-e", icon: FileText },
      { href: "/inventario", label: "Inventário", icon: ClipboardList },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/alertas", label: "Alertas", icon: Bell },
      { href: "/relatorios", label: "Relatórios", icon: BarChart2 },
      { href: "/usuarios", label: "Usuários", icon: Users },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Package size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Controle de</p>
            <p className="text-sm font-semibold leading-tight text-blue-400">
              Estoque
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group, i) => (
          <div key={i}>
            {group.label && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                      {item.label === "Alertas" && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          3
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-gray-400 truncate">admin@loja.com</p>
          </div>
          <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-auto min-h-screen">{children}</main>
    </div>
  );
}

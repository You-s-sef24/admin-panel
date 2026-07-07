import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AppSidebar from "./AppSidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="md:hidden flex items-center h-14 px-4 border-b border-gray-200 bg-white shrink-0">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
        </div>

        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

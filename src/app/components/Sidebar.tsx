import { LayoutDashboard, FileText, Users, Settings, Briefcase } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

interface SidebarProps {
  currentView: "admin" | "project-manager";
  onViewChange: (view: "admin" | "project-manager") => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const adminItems = [
    { icon: LayoutDashboard, label: "Dashboard Global", id: "dashboard" },
    { icon: FileText, label: "Contratos", id: "contracts" },
    { icon: Users, label: "Usuarios", id: "users" },
    { icon: Settings, label: "Configuración IA", id: "settings" },
  ];

  const projectItems = [
    { icon: Briefcase, label: "Mis Proyectos", id: "projects" },
    { icon: LayoutDashboard, label: "Vista Ejecutiva", id: "executive" },
    { icon: FileText, label: "Documentos", id: "documents" },
    { icon: Settings, label: "Configuración", id: "settings" },
  ];

  const items = currentView === "admin" ? adminItems : projectItems;

  return (
    <div className="w-16 bg-[#0a0a0f] border-r border-[#1a1a24] flex flex-col items-center py-6 gap-4">
      {/* Logo */}
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center mb-4">
        <span className="text-white font-bold">E</span>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-2 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                "hover:bg-[#1a1a24] group relative"
              )}
            >
              <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-3 py-2 bg-[#1a1a24] rounded-lg text-sm text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-[#2a2a34]">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* View Switcher at Bottom */}
      <div className="flex flex-col gap-2 border-t border-[#1a1a24] pt-4">
        <button
          onClick={() => onViewChange("admin")}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all text-xs",
            currentView === "admin"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
              : "bg-[#1a1a24] text-gray-500 hover:text-white"
          )}
          title="Admin View"
        >
          A
        </button>
        <button
          onClick={() => onViewChange("project-manager")}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all text-xs",
            currentView === "project-manager"
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
              : "bg-[#1a1a24] text-gray-500 hover:text-white"
          )}
          title="Project Manager View"
        >
          PM
        </button>
      </div>
    </div>
  );
}

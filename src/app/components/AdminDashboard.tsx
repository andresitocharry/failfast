import { useState } from "react";
import { Activity, Zap, TrendingUp, Bot, Users, FileText, DollarSign } from "lucide-react";
import { ContractUpload } from "@/app/components/ContractUpload";
import { ContractsList } from "@/app/components/ContractsList";
import { ContractDetail } from "@/app/components/ContractDetail";
import { mockContracts, mockUsers } from "@/app/data/mockData";

export function AdminDashboard() {
  const [view, setView] = useState<"dashboard" | "contracts" | "users">("dashboard");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const selectedContract = mockContracts.find(c => c.id === selectedContractId);
  const activeContracts = mockContracts.filter(c => c.status === "active").length;
  const totalValue = "$41.8M";
  const atRiskContracts = mockContracts.filter(c => c.status === "at-risk").length;

  return (
    <div className="flex-1 bg-[#0a0a0f] overflow-hidden flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#0f0f17] border-r border-[#1a1a24] p-4">
        <nav className="space-y-2">
          <NavButton
            active={view === "dashboard"}
            onClick={() => setView("dashboard")}
            icon={Activity}
            label="Dashboard Global"
          />
          <NavButton
            active={view === "contracts"}
            onClick={() => setView("contracts")}
            icon={FileText}
            label="Contratos"
            badge={mockContracts.length}
          />
          <NavButton
            active={view === "users"}
            onClick={() => setView("users")}
            icon={Users}
            label="Usuarios"
            badge={mockUsers.length}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-[#1a1a24] bg-[#0f0f17] px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-white mb-1">Panel de Control de Agentes</h1>
              <p className="text-sm text-gray-500">Configurador de Agentes • Sector Petrolero</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Autonomous System Status */}
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg">
                <Bot className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-green-400 font-medium">Sistema Autónomo: Activo</p>
                  <p className="text-xs text-gray-400">45 Agentes trabajando</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {view === "dashboard" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={FileText}
                  label="Contratos Activos"
                  value={activeContracts.toString()}
                  trend={`${mockContracts.length} totales`}
                  color="blue"
                />
                <StatCard
                  icon={DollarSign}
                  label="Valor en Gestión"
                  value={totalValue}
                  trend="Cartera actual"
                  color="green"
                />
                <StatCard
                  icon={Bot}
                  label="Agentes Activos"
                  value="45"
                  trend="Monitoreando proyectos"
                  color="purple"
                />
                <StatCard
                  icon={TrendingUp}
                  label="En Riesgo"
                  value={atRiskContracts.toString()}
                  trend="Requieren atención"
                  color="yellow"
                />
              </div>

              {/* Contract Ingestion Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl text-white">Contract Ingestion</h2>
                    <p className="text-sm text-gray-500">Sube un nuevo contrato para análisis automático</p>
                  </div>
                </div>
                <ContractUpload />
              </div>

              {/* Recent Contracts */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Contratos Recientes</h3>
                  <button
                    onClick={() => setView("contracts")}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Ver Todos →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {mockContracts.slice(0, 4).map((contract) => (
                    <ContractRow
                      key={contract.id}
                      contract={contract}
                      onClick={() => {
                        setSelectedContractId(contract.id);
                        setView("contracts");
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {view === "contracts" && (
            <div className="flex gap-6 h-[calc(100vh-200px)]">
              {/* Contracts List */}
              <div className="w-96 overflow-auto">
                <h3 className="text-white mb-4">Todos los Contratos</h3>
                <ContractsList
                  contracts={mockContracts}
                  selectedId={selectedContractId}
                  onSelect={setSelectedContractId}
                />
              </div>

              {/* Contract Detail */}
              <div className="flex-1 bg-[#0f0f17] rounded-lg border border-[#1a1a24] overflow-hidden">
                {selectedContract ? (
                  <ContractDetail contract={selectedContract} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Selecciona un contrato para ver detalles</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === "users" && (
            <div>
              <h3 className="text-white mb-4">Equipo de Trabajo</h3>
              <div className="grid grid-cols-3 gap-4">
                {mockUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? "bg-purple-500/20 text-white border border-purple-500/50"
          : "text-gray-400 hover:text-white hover:bg-[#1a1a24]"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 bg-purple-500/30 text-purple-400 rounded-full text-xs">
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  trend: string;
  color: "blue" | "purple" | "cyan" | "green" | "yellow";
}) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-900/20 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-900/20 border-purple-500/30 text-purple-400",
    cyan: "from-cyan-500/20 to-cyan-900/20 border-cyan-500/30 text-cyan-400",
    green: "from-green-500/20 to-green-900/20 border-green-500/30 text-green-400",
    yellow: "from-yellow-500/20 to-yellow-900/20 border-yellow-500/30 text-yellow-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#0f0f17] flex items-center justify-center">
          <Icon className={`w-5 h-5 ${colorClasses[color].split(" ")[3]}`} />
        </div>
      </div>
      <div className="text-3xl text-white font-medium mb-1">{value}</div>
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="text-xs text-gray-500">{trend}</div>
    </div>
  );
}

function ContractRow({
  contract,
  onClick,
}: {
  contract: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-[#0f0f17] border border-[#1a1a24] rounded-lg p-4 hover:border-purple-500/50 transition-all cursor-pointer text-left w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-white mb-1 truncate">{contract.title}</h4>
          <p className="text-xs text-gray-500">{contract.client}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs ml-2 flex-shrink-0 ${
            contract.status === "active"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : contract.status === "at-risk"
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              : "bg-green-500/20 text-green-400 border border-green-500/30"
          }`}
        >
          {contract.status === "active" ? "Activo" : contract.status === "at-risk" ? "En Riesgo" : "Completado"}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-[#1a1a24] rounded-full h-2">
          <div
            className={`h-full rounded-full ${
              contract.status === "active" ? "bg-blue-500" : contract.status === "at-risk" ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${contract.progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-400 min-w-[3rem]">{contract.progress}%</span>
      </div>
    </button>
  );
}

function UserCard({ user }: { user: any }) {
  return (
    <div className="bg-[#0f0f17] border border-[#1a1a24] rounded-lg p-4 hover:border-purple-500/30 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
          {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white truncate">{user.name}</h4>
          <p className="text-sm text-gray-400 truncate">{user.role}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-2">{user.email}</p>
      <div
        className={`px-2 py-1 rounded-full text-xs inline-flex ${
          user.status === "active"
            ? "bg-green-500/10 text-green-400 border border-green-500/30"
            : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
        }`}
      >
        {user.status === "active" ? "Activo" : "Inactivo"}
      </div>
    </div>
  );
}

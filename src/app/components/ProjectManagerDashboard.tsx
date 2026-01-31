import { AlertCircle, Clock, TrendingUp, Activity, Bot } from "lucide-react";
import { PhaseColumn, type ActionCardProps } from "@/app/components/Timeline";
import { AICopilot } from "@/app/components/AICopilot";
import { mockContracts } from "@/app/data/mockData";
import { useState } from "react";

export function ProjectManagerDashboard() {
  const [selectedContractId, setSelectedContractId] = useState(mockContracts[0].id);
  const contract = mockContracts.find(c => c.id === selectedContractId) || mockContracts[0];

  // Convert milestones to action cards
  const inicioActions: ActionCardProps[] = contract.milestones
    .filter(m => m.phase === "inicio")
    .map(m => ({
      title: m.name,
      status: m.status === "completed" ? "on-track" as const : 
              m.status === "delayed" ? "delayed" as const : "at-risk" as const,
      phase: "inicio" as const,
      dueDate: m.dueDate,
      owner: `Agente ${m.phase}`,
      daysDelay: m.status === "delayed" ? 2 : undefined,
    }));

  const ejecucionActions: ActionCardProps[] = contract.milestones
    .filter(m => m.phase === "ejecucion")
    .map(m => ({
      title: m.name,
      status: m.status === "completed" ? "on-track" as const : 
              m.status === "delayed" ? "delayed" as const : 
              m.status === "in-progress" ? "on-track" as const : "at-risk" as const,
      phase: "ejecucion" as const,
      dueDate: m.dueDate,
      owner: `Agente ${m.phase}`,
      daysDelay: m.status === "delayed" ? 4 : undefined,
    }));

  const cierreActions: ActionCardProps[] = contract.milestones
    .filter(m => m.phase === "cierre")
    .map(m => ({
      title: m.name,
      status: m.status === "completed" ? "on-track" as const : "at-risk" as const,
      phase: "cierre" as const,
      dueDate: m.dueDate,
      owner: `Agente ${m.phase}`,
    }));

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Timeline Area */}
      <div className="flex-1 bg-[#0a0a0f] overflow-auto">
        {/* Contract Selector */}
        <div className="border-b border-[#1a1a24] bg-[#0f0f17] px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {mockContracts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedContractId(c.id)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedContractId === c.id
                    ? "bg-purple-500/20 text-white border border-purple-500/50"
                    : "bg-[#1a1a24] text-gray-400 hover:text-white hover:bg-[#2a2a34]"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Project Header */}
        <div className="border-b border-[#1a1a24] bg-[#0f0f17] px-8 py-6">
          <div className="mb-4">
            <h1 className="text-2xl text-white mb-2">{contract.title}</h1>
            <p className="text-sm text-gray-400 mb-3">{contract.client} • {contract.location}</p>
            <div className="flex items-center gap-6">
              {/* Progress Bar */}
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progreso General</span>
                  <span className="text-sm text-white font-medium">{contract.progress}%</span>
                </div>
                <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
                    style={{ width: `${contract.progress}%` }}
                  />
                </div>
              </div>

              {/* AI-Generated Key Indicators */}
              <div className="flex gap-4">
                <Indicator
                  icon={Activity}
                  label="Salud del Proyecto"
                  value={`${contract.health}% ${contract.health >= 80 ? 'Estable' : contract.health >= 60 ? 'Medio' : 'Crítico'}`}
                  color={contract.health >= 80 ? 'green' : contract.health >= 60 ? 'yellow' : 'red'}
                />
                <Indicator
                  icon={AlertCircle}
                  label="Riesgo de Retraso"
                  value={contract.riskLevel === 'bajo' ? 'Bajo' : contract.riskLevel === 'medio' ? 'Medio' : 'Alto'}
                  color={contract.riskLevel === 'bajo' ? 'blue' : contract.riskLevel === 'medio' ? 'yellow' : 'red'}
                />
                <Indicator
                  icon={Bot}
                  label="Próxima Acción"
                  value="En 4 horas"
                  color="purple"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-white mb-2">Tablero de Comando Central</h2>
            <p className="text-sm text-gray-500">
              Misiones de agentes en tiempo real • Supervisión autónoma activa
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <PhaseColumn phase="INICIO" actions={inicioActions} color="blue" />
            <PhaseColumn phase="EJECUCIÓN" actions={ejecucionActions} color="purple" />
            <PhaseColumn phase="CIERRE" actions={cierreActions} color="cyan" />
          </div>
        </div>
      </div>

      {/* AI Copilot Sidebar */}
      <AICopilot />
    </div>
  );
}

function Indicator({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: "green" | "yellow" | "red" | "blue" | "purple";
}) {
  const colorClasses = {
    green: "bg-green-500/10 border-green-500/30 text-green-400",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    red: "bg-red-500/10 border-red-500/30 text-red-400",
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${colorClasses[color]}`}>
      <Icon className="w-4 h-4" />
      <div>
        <p className="text-xs opacity-70">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
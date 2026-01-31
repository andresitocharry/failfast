import { AlertCircle, Activity, Bot } from "lucide-react";
import { PhaseColumn, type ActionCardProps } from "@/app/components/Timeline";
import { AICopilot } from "@/app/components/AICopilot";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONTRACTS, GET_CONTRACT_DETAIL } from "@/app/data/queries";

export function ProjectManagerDashboard() {
  const { data: listData, loading: listLoading } = useQuery(GET_CONTRACTS);
  const contracts = listData?.contracts || [];

  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  useEffect(() => {
    if (contracts.length > 0 && !selectedContractId) {
      setSelectedContractId(contracts[0].id);
    }
  }, [contracts, selectedContractId]);

  const { data: detailData, loading: detailLoading } = useQuery(GET_CONTRACT_DETAIL, {
    variables: { id: selectedContractId },
    skip: !selectedContractId,
  });

  // Extract first contract from array (query returns array now, not single object)
  const contract = detailData?.contracts?.[0];

  // Comprehensive debug logging
  console.log("=== ProjectManagerDashboard Debug ===");
  console.log("1. List Query:");
  console.log("   - Loading:", listLoading);
  console.log("   - Contracts count:", contracts.length);
  console.log("   - Contracts:", contracts);
  console.log("2. Selected Contract:");
  console.log("   - Selected ID:", selectedContractId);
  console.log("3. Detail Query:");
  console.log("   - Loading:", detailLoading);
  console.log("   - Detail Data:", detailData);
  console.log("   - Contract:", contract);
  console.log("=====================================");

  if (listLoading || (selectedContractId && detailLoading)) {
    return <div className="flex-1 bg-[#0a0a0f] flex items-center justify-center text-white">Cargando proyecto...</div>;
  }

  if (!contract) {
    return <div className="flex-1 bg-[#0a0a0f] flex items-center justify-center text-white">No hay contratos disponibles</div>;
  }

  // Convert milestones to action cards
  const inicioActions: ActionCardProps[] = (contract.milestones || [])
    .filter((m: any) => m.phase === "inicio")
    .map((m: any) => ({
      title: m.name,
      status: m.status === "completed" ? "on-track" as const :
        m.status === "delayed" ? "delayed" as const : "at-risk" as const,
      phase: "inicio" as const,
      dueDate: m.due_date, // Note: due_date from DB
      owner: `Agente ${m.phase}`,
      daysDelay: m.status === "delayed" ? 2 : undefined,
    }));

  const ejecucionActions: ActionCardProps[] = (contract.milestones || [])
    .filter((m: any) => m.phase === "ejecucion")
    .map((m: any) => ({
      title: m.name,
      status: m.status === "completed" ? "on-track" as const :
        m.status === "delayed" ? "delayed" as const :
          m.status === "in-progress" ? "on-track" as const : "at-risk" as const,
      phase: "ejecucion" as const,
      dueDate: m.due_date,
      owner: `Agente ${m.phase}`,
      daysDelay: m.status === "delayed" ? 4 : undefined,
    }));

  const cierreActions: ActionCardProps[] = (contract.milestones || [])
    .filter((m: any) => m.phase === "cierre")
    .map((m: any) => ({
      title: m.name,
      status: m.status === "completed" ? "on-track" as const : "at-risk" as const,
      phase: "cierre" as const,
      dueDate: m.due_date,
      owner: `Agente ${m.phase}`,
    }));

  // Handle risk_level from DB
  const riskLevel = contract.risk_level || 'bajo';

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Timeline Area */}
      <div className="flex-1 bg-[#0a0a0f] overflow-auto">
        {/* Contract Selector */}
        <div className="border-b border-[#1a1a24] bg-[#0f0f17] px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {contracts.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setSelectedContractId(c.id)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all flex-shrink-0 ${selectedContractId === c.id
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
                {contract.health !== undefined && contract.health !== null && (
                  <Indicator
                    icon={Activity}
                    label="Salud del Proyecto"
                    value={`${contract.health}% ${contract.health >= 80 ? 'Estable' : contract.health >= 60 ? 'Medio' : 'Crítico'}`}
                    color={contract.health >= 80 ? 'green' : contract.health >= 60 ? 'yellow' : 'red'}
                  />
                )}
                {riskLevel && (
                  <Indicator
                    icon={AlertCircle}
                    label="Riesgo de Retraso"
                    value={riskLevel === 'bajo' ? 'Bajo' : riskLevel === 'medio' ? 'Medio' : 'Alto'}
                    color={riskLevel === 'bajo' ? 'blue' : riskLevel === 'medio' ? 'yellow' : 'red'}
                  />
                )}
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
import { cn } from "@/app/components/ui/utils";
import { type Contract } from "@/app/data/mockData";
import { Drill, Building2, Wrench, Factory, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface ContractsListProps {
  contracts: Contract[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ContractsList({ contracts, selectedId, onSelect }: ContractsListProps) {
  return (
    <div className="space-y-2">
      {contracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          isSelected={selectedId === contract.id}
          onClick={() => onSelect(contract.id)}
        />
      ))}
    </div>
  );
}

function ContractCard({
  contract,
  isSelected,
  onClick,
}: {
  contract: Contract;
  isSelected: boolean;
  onClick: () => void;
}) {
  const typeConfig = {
    perforacion: { icon: Drill, label: "Perforación", color: "text-blue-400 bg-blue-500/20" },
    construccion: { icon: Building2, label: "Construcción", color: "text-purple-400 bg-purple-500/20" },
    mantenimiento: { icon: Wrench, label: "Mantenimiento", color: "text-orange-400 bg-orange-500/20" },
    refineria: { icon: Factory, label: "Refinería", color: "text-cyan-400 bg-cyan-500/20" },
  };

  const statusConfig = {
    active: { icon: TrendingUp, label: "Activo", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    "at-risk": { icon: AlertCircle, label: "En Riesgo", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
    completed: { icon: CheckCircle2, label: "Completado", color: "text-green-400 bg-green-500/10 border-green-500/30" },
  };

  const typeInfo = typeConfig[contract.type];
  const statusInfo = statusConfig[contract.status];
  const TypeIcon = typeInfo.icon;
  const StatusIcon = statusInfo.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        isSelected
          ? "bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/20"
          : "bg-[#0f0f17] border-[#1a1a24] hover:border-purple-500/30"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", typeInfo.color)}>
          <TypeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium mb-1 truncate">{contract.title}</h4>
          <p className="text-xs text-gray-500">{contract.client}</p>
        </div>
      </div>

      {/* Details */}
      <div className="flex items-center justify-between mb-2">
        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs", statusInfo.color)}>
          <StatusIcon className="w-3 h-3" />
          <span>{statusInfo.label}</span>
        </div>
        <span className="text-xs text-gray-400">{contract.value}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progreso</span>
          <span className="text-xs text-gray-400">{contract.progress}%</span>
        </div>
        <div className="h-1 bg-[#1a1a24] rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full",
              contract.status === "active" ? "bg-blue-500" :
              contract.status === "at-risk" ? "bg-yellow-500" :
              "bg-green-500"
            )}
            style={{ width: `${contract.progress}%` }}
          />
        </div>
      </div>

      {/* Location & PM */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="truncate">{contract.location}</span>
        <span className="ml-2 flex-shrink-0">{contract.id}</span>
      </div>
    </button>
  );
}

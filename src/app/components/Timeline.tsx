import { AlertCircle, Clock, CheckCircle, TrendingUp, AlertTriangle, Bot } from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { motion } from "motion/react";

export interface ActionCardProps {
  title: string;
  status: "on-track" | "at-risk" | "delayed";
  daysDelay?: number;
  phase: "inicio" | "ejecucion" | "cierre";
  dueDate: string;
  owner: string;
}

export function ActionCard({ title, status, daysDelay, phase, dueDate, owner }: ActionCardProps) {
  const statusConfig = {
    "on-track": {
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      label: "Al día",
      botActive: true,
    },
    "at-risk": {
      icon: AlertTriangle,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      label: "En Riesgo",
      botActive: true,
    },
    delayed: {
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      label: "Retrasado",
      botActive: false,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "bg-[#0f0f17] border rounded-lg p-4 cursor-pointer transition-all group relative",
        config.border
      )}
    >
      {/* Status Indicator */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {config.botActive && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-4 h-4 flex items-center justify-center"
            >
              <Bot className="w-4 h-4 text-blue-400" />
            </motion.div>
          )}
          <div className={cn("flex items-center gap-2 px-2 py-1 rounded-md text-xs", config.bg)}>
            <Icon className={cn("w-3 h-3", config.color)} />
            <span className={config.color}>{config.label}</span>
          </div>
        </div>
        {status === "delayed" && daysDelay && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1 text-xs text-red-400"
          >
            <Clock className="w-3 h-3" />
            <span>+{daysDelay}d</span>
          </motion.div>
        )}
      </div>

      {/* Title */}
      <h4 className="text-white mb-2 group-hover:text-purple-400 transition-colors">
        {title}
      </h4>

      {/* Details */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Vence: {dueDate}</span>
        <span>{owner}</span>
      </div>

      {/* Hover Tooltip for Delayed Items */}
      {status === "delayed" && (
        <div className="absolute left-full ml-4 top-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 w-64">
          <div className="bg-[#1a1a24] border border-red-500/30 rounded-lg p-3 shadow-2xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-white font-medium mb-1">
                  Retraso de {daysDelay} días
                </p>
                <p className="text-xs text-gray-400">
                  Esperando validación del proveedor. Se requiere escalamiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function PhaseColumn({
  phase,
  actions,
  color,
}: {
  phase: "INICIO" | "EJECUCIÓN" | "CIERRE";
  actions: ActionCardProps[];
  color: "blue" | "purple" | "cyan";
}) {
  const colorClasses = {
    blue: "border-blue-500/30 bg-blue-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
    cyan: "border-cyan-500/30 bg-cyan-500/5",
  };

  const headerColors = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    cyan: "text-cyan-400",
  };

  return (
    <div className={cn("border-l-2 pl-6 min-h-[400px]", colorClasses[color])}>
      <div className="sticky top-0 bg-[#0a0a0f] pb-4 mb-4 border-b border-[#1a1a24]">
        <h3 className={cn("text-lg font-medium mb-1", headerColors[color])}>{phase}</h3>
        <p className="text-xs text-gray-500">{actions.length} acciones</p>
      </div>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <ActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
}
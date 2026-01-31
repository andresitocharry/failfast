import { Sparkles, CheckCircle, Database, ArrowRight, FileCheck, Bot } from "lucide-react";
import { motion } from "motion/react";

export function AICopilot() {
  const pendingActions = [
    {
      id: "GR-WP-0102",
      type: "gr" as const,
      milestone: "Hito de Suministro: Membrana Poliuretánica BARI-X1",
      evidence: [
        "Remisión de proveedor validada contra Pedido SAP #45001",
        "Certificado de calidad de lote #XP-2026-B adjunto",
        "Registro fotográfico de descarga en almacén de obra verificado"
      ],
      confidence: 98,
      value: "15%",
      actionNeeded: "Aprobar y Finalizar GR",
    },
    {
      id: "HITO-EJ-04",
      type: "gr" as const,
      milestone: "Hito de Ejecución #2: Preparación de Superficie",
      evidence: [
        "Informe de interventoría aprobado (Ing. Carlos Ruíz)",
        "Medición de humedad de placa < 4% (Escáner Positector)",
        "Acta de liberación de área firmada por Residente de Obra"
      ],
      confidence: 95,
      value: "20%",
      actionNeeded: "Aprobar y Liberar Pago",
    },
    {
      id: "WO-EST-05",
      type: "wo" as const,
      milestone: "Work Order: Prueba de Estanqueidad (Zona A)",
      evidence: [
        "48 horas de inundación completadas sin filtraciones",
        "Verificación por Agente BARI-Vision (Nivel de agua estable)",
        "Sellado de bajantes y puntos críticos validado"
      ],
      confidence: 92,
      value: "N/A",
      actionNeeded: "Ejecutar Work Order",
    },
  ];

  return (
    <div className="w-[420px] bg-gradient-to-b from-[#0f0f17] to-[#0a0a0f] border-l border-green-500/30 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white">Centro de Aprobaciones</h3>
          <p className="text-xs text-gray-500">Validaciones Pendientes de IA</p>
        </div>
      </div>

      {/* AI Status */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-400 rounded-full"
          />
          <span className="text-sm text-green-400">Sistema Autónomo Activo</span>
        </div>
        <p className="text-xs text-gray-400">
          3 validaciones listas • Evidencia automática verificada
        </p>
      </div>

      {/* Pending GR/WO Actions */}
      <div className="space-y-4">
        {pendingActions.map((action, index) => (
          <GRActionItem key={action.id} action={action} delay={index * 0.1} />
        ))}
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start gap-2 mb-2">
          <Database className="w-4 h-4 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm text-blue-400 mb-1">Insight del Sistema</h4>
            <p className="text-xs text-gray-400">
              El sistema reemplazó <span className="text-white font-medium">127 transacciones SAP manuales</span> este mes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GRActionItem({
  action,
  delay,
}: {
  action: {
    id: string;
    type: "gr" | "wo";
    milestone: string;
    evidence: string[];
    confidence: number;
    value: string;
    actionNeeded: string;
  };
  delay: number;
}) {
  const typeConfig = {
    gr: {
      icon: FileCheck,
      label: "Goods Receipt Autónomo",
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-500/50",
    },
    wo: {
      icon: Database,
      label: "Work Order Lista",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/50",
    },
  };

  const config = typeConfig[action.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`bg-[#0f0f17] border-2 ${config.borderColor} rounded-lg p-4 hover:border-opacity-100 transition-all`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">{config.label}</div>
          <h4 className="text-white text-sm font-medium mb-1">{action.milestone}</h4>
          {action.value !== "N/A" && (
            <div className="text-xs text-green-400">Valor: {action.value} del contrato</div>
          )}
        </div>
      </div>

      {/* AI Evidence */}
      <div className="mb-3 p-3 bg-[#1a1a24] rounded-lg">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Evidencia Detectada por IA:</span>
        </div>
        <div className="space-y-1.5">
          {action.evidence.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Confianza de Validación</span>
          <span className="text-xs text-green-400">{action.confidence}%</span>
        </div>
        <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${action.confidence}%` }}
            transition={{ delay: delay + 0.3, duration: 0.5 }}
            className={`h-full bg-gradient-to-r ${config.color}`}
          />
        </div>
      </div>

      {/* Action Button */}
      <button className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 group font-medium`}>
        {action.actionNeeded}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* ID Badge */}
      <div className="mt-2 text-xs text-gray-500 text-center">ID: {action.id}</div>
    </motion.div>
  );
}
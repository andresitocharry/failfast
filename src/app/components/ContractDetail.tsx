import { useState } from "react";
import { type Contract } from "@/app/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { 
  MapPin, Calendar, DollarSign, TrendingUp, Users, FileText, 
  CheckCircle2, Clock, AlertCircle, Bot, Download, Eye 
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { motion } from "motion/react";

interface ContractDetailProps {
  contract: Contract;
}

export function ContractDetail({ contract }: ContractDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-[#1a1a24] p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl text-white mb-2">{contract.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {contract.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {contract.startDate} - {contract.endDate}
              </span>
              <span className="flex items-center gap-1.5 text-green-400">
                <DollarSign className="w-4 h-4" />
                {contract.value}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border",
              contract.health >= 80 ? "bg-green-500/10 border-green-500/30 text-green-400" :
              contract.health >= 60 ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
              "bg-red-500/10 border-red-500/30 text-red-400"
            )}>
              <TrendingUp className="w-4 h-4" />
              Salud: {contract.health}%
            </div>
            <p className="text-xs text-gray-500 mt-1">ID: {contract.id}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progreso General</span>
            <span className="text-sm text-white font-medium">{contract.progress}%</span>
          </div>
          <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${contract.progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <QuickStat label="Fase Actual" value={contract.phase.toUpperCase()} />
          <QuickStat label="Riesgo" value={contract.riskLevel.toUpperCase()} />
          <QuickStat label="Equipo" value={`${contract.team.length} miembros`} />
          <QuickStat label="Hitos" value={`${contract.milestones.length} totales`} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b border-[#1a1a24] bg-transparent rounded-none px-6">
          <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="milestones" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Hitos de Pago
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Equipo
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Documentos
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-6">
          <TabsContent value="overview" className="mt-0">
            <OverviewTab contract={contract} />
          </TabsContent>

          <TabsContent value="milestones" className="mt-0">
            <MilestonesTab milestones={contract.milestones} />
          </TabsContent>

          <TabsContent value="team" className="mt-0">
            <TeamTab team={contract.team} projectManager={contract.projectManager} />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <DocumentsTab documents={contract.documents} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0f0f17] rounded-lg p-3 border border-[#1a1a24]">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  );
}

function OverviewTab({ contract }: { contract: Contract }) {
  return (
    <div className="space-y-6">
      {/* Client Info */}
      <div className="bg-[#0f0f17] rounded-lg p-4 border border-[#1a1a24]">
        <h3 className="text-white mb-3">Información del Cliente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Cliente</p>
            <p className="text-sm text-white">{contract.client}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Project Manager</p>
            <p className="text-sm text-white">{contract.projectManager}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Tipo de Proyecto</p>
            <p className="text-sm text-white capitalize">{contract.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Valor Total</p>
            <p className="text-sm text-green-400 font-medium">{contract.value}</p>
          </div>
        </div>
      </div>

      {/* AI Monitoring */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-5 h-5 text-blue-400" />
          <h3 className="text-white">Monitoreo Autónomo</h3>
        </div>
        <div className="space-y-2">
          <MonitoringItem
            label="Agentes Activos"
            value="8 agentes"
            status="active"
          />
          <MonitoringItem
            label="Última Verificación"
            value="Hace 2 horas"
            status="active"
          />
          <MonitoringItem
            label="Alertas Pendientes"
            value="2 requieren atención"
            status="warning"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#0f0f17] rounded-lg p-4 border border-[#1a1a24]">
        <h3 className="text-white mb-3">Actividad Reciente</h3>
        <div className="space-y-3">
          <ActivityItem
            action="Agente IA aprobó entregable"
            detail="Reporte Diario de Perforación - Mar 15"
            time="Hace 3 horas"
          />
          <ActivityItem
            action="Hito completado"
            detail="Perforación Fase 1 (0-1500m)"
            time="Hace 1 día"
          />
          <ActivityItem
            action="Documento cargado"
            detail="Plan de Perforación v2.3.pdf"
            time="Hace 2 días"
          />
        </div>
      </div>
    </div>
  );
}

function MilestonesTab({ milestones }: { milestones: Contract["milestones"] }) {
  const statusConfig = {
    completed: { icon: CheckCircle2, label: "Completado", color: "text-green-400 bg-green-500/10 border-green-500/30" },
    "in-progress": { icon: Clock, label: "En Progreso", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    pending: { icon: Clock, label: "Pendiente", color: "text-gray-400 bg-gray-500/10 border-gray-500/30" },
    delayed: { icon: AlertCircle, label: "Retrasado", color: "text-red-400 bg-red-500/10 border-red-500/30" },
  };

  return (
    <div className="space-y-4">
      {milestones.map((milestone, index) => {
        const config = statusConfig[milestone.status];
        const Icon = config.icon;

        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#0f0f17] rounded-lg p-4 border border-[#1a1a24] hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-white mb-1">{milestone.name}</h4>
                <p className="text-xs text-gray-500">Fase: {milestone.phase.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border mb-1", config.color)}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </div>
                <p className="text-sm text-green-400 font-medium">{milestone.value}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">Fecha límite: {milestone.dueDate}</span>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Entregables:</p>
              <div className="space-y-1">
                {milestone.deliverables.map((deliverable, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-gray-400">{deliverable}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function TeamTab({ team, projectManager }: { team: Contract["team"]; projectManager: string }) {
  return (
    <div className="space-y-3">
      {team.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-[#0f0f17] rounded-lg p-4 border border-[#1a1a24] flex items-center gap-4 hover:border-purple-500/30 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <h4 className="text-white mb-1">{member.name}</h4>
            <p className="text-sm text-gray-400">{member.role}</p>
            <p className="text-xs text-gray-500">{member.email}</p>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs",
            member.status === "active" 
              ? "bg-green-500/10 text-green-400 border border-green-500/30"
              : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
          )}>
            {member.status === "active" ? "Activo" : "Inactivo"}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DocumentsTab({ documents }: { documents: Contract["documents"] }) {
  const typeColors = {
    contrato: "text-blue-400 bg-blue-500/10",
    tecnico: "text-purple-400 bg-purple-500/10",
    legal: "text-yellow-400 bg-yellow-500/10",
    financiero: "text-green-400 bg-green-500/10",
  };

  const statusConfig = {
    approved: { label: "Aprobado", color: "text-green-400 bg-green-500/10 border-green-500/30" },
    pending: { label: "Pendiente", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
    review: { label: "En Revisión", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  };

  return (
    <div className="space-y-3">
      {documents.map((doc, index) => {
        const status = statusConfig[doc.status];
        return (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#0f0f17] rounded-lg p-4 border border-[#1a1a24] hover:border-purple-500/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", typeColors[doc.type])}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white mb-1 truncate">{doc.name}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>Subido por: {doc.uploadedBy}</span>
                  <span>•</span>
                  <span>{doc.uploadDate}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("px-2 py-1 rounded-md text-xs border", status.color)}>
                  {status.label}
                </div>
                <button className="w-8 h-8 rounded-lg bg-[#1a1a24] hover:bg-purple-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#1a1a24] hover:bg-purple-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function MonitoringItem({ label, value, status }: { label: string; value: string; status: "active" | "warning" }) {
  return (
    <div className="flex items-center justify-between p-2 bg-[#0f0f17]/50 rounded-lg">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={cn(
        "text-sm",
        status === "active" ? "text-green-400" : "text-yellow-400"
      )}>
        {value}
      </span>
    </div>
  );
}

function ActivityItem({ action, detail, time }: { action: string; detail: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[#1a1a24] rounded-lg">
      <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white mb-1">{action}</p>
        <p className="text-xs text-gray-400 truncate">{detail}</p>
      </div>
      <span className="text-xs text-gray-500 flex-shrink-0">{time}</span>
    </div>
  );
}

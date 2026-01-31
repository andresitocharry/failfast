import { Upload, FileText, Sparkles, Bot, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export function ContractUpload() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file.name);
      setIsAnalyzing(true);
      // Simulate analysis completion after 3 seconds
      setTimeout(() => setIsAnalyzing(false), 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (uploadedFile) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Uploaded PDF Preview */}
        <div className="bg-[#0f0f17] border border-[#1a1a24] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white">Contrato Subido</h3>
              <p className="text-xs text-gray-500">{uploadedFile}</p>
            </div>
          </div>

          {/* PDF Preview Mock */}
          <div className="bg-[#1a1a24] rounded-lg p-6 h-[500px] overflow-hidden">
            <div className="space-y-3">
              <div className="h-2 bg-gray-700 rounded w-3/4"></div>
              <div className="h-2 bg-gray-700 rounded w-full"></div>
              <div className="h-2 bg-gray-700 rounded w-5/6"></div>
              <div className="h-2 bg-gray-700 rounded w-full"></div>
              <div className="h-4"></div>
              <div className="h-2 bg-blue-500/30 rounded w-2/3"></div>
              <div className="h-2 bg-gray-700 rounded w-full"></div>
              <div className="h-2 bg-gray-700 rounded w-4/5"></div>
              <div className="h-4"></div>
              <div className="h-2 bg-purple-500/30 rounded w-1/2"></div>
              <div className="h-2 bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        </div>

        {/* Right: AI Agent Analysis */}
        <div className="bg-gradient-to-br from-green-900/20 via-transparent to-blue-900/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bot className="w-5 h-5 text-green-400" />
            <h3 className="text-white">Agente de Análisis Legal</h3>
            {isAnalyzing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"
              />
            )}
          </div>

          <div className="space-y-4">
            {/* Analysis Steps */}
            <AnalysisStep
              label="Extrayendo cláusulas legales"
              status={isAnalyzing ? "processing" : "completed"}
              delay={0}
            />
            <AnalysisStep
              label="Identificando hitos de pago"
              status={isAnalyzing ? "processing" : "completed"}
              delay={0.5}
            />
            <AnalysisStep
              label="Generando misiones de agente"
              status={isAnalyzing ? "processing" : "completed"}
              delay={1}
            />

            {/* Structured Results - Three Columns */}
            {!isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 space-y-4"
              >
                <p className="text-sm text-gray-400 mb-4">
                  Estructura Generada Automáticamente:
                </p>
                
                <div className="space-y-3">
                  <PhaseColumn
                    phase="Fase 1: Inicio"
                    color="blue"
                    actions={[
                      "Kick-off con stakeholders",
                      "Movilización de equipo y personal",
                      "Permisos ambientales y HSE",
                      "Aprobación de alcance legal"
                    ]}
                  />
                  <PhaseColumn
                    phase="Fase 2: Ejecución"
                    color="purple"
                    actions={[
                      "Perforación Fase 1 (0-1500m)",
                      "Perforación Fase 2 (1500-3000m)",
                      "Hito de pago #1 (25%)",
                      "Completación del pozo",
                      "Hito de pago #2 (30%)",
                      "Pruebas de producción"
                    ]}
                  />
                  <PhaseColumn
                    phase="Fase 3: Cierre"
                    color="cyan"
                    actions={[
                      "Desmovilización de equipo",
                      "Reporte técnico final",
                      "Certificaciones y entrega",
                      "Pago final (10%)"
                    ]}
                  />
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-6">
                  <p className="text-sm text-green-400 mb-2">
                    ✓ Análisis completado: <span className="text-white font-medium">15 misiones</span> identificadas
                  </p>
                  <p className="text-xs text-gray-400">
                    El sistema está listo para desplegar agentes de seguimiento automático
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  <Bot className="w-5 h-5" />
                  Confirmar Estructura y Desplegar Agentes de Seguimiento
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-[#2a2a34] rounded-xl p-12 text-center hover:border-purple-500/50 transition-all cursor-pointer bg-[#0f0f17]"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <Upload className="w-10 h-10 text-purple-400" />
        </div>
        <div>
          <h3 className="text-white text-xl mb-2">Arrastra un contrato PDF aquí</h3>
          <p className="text-gray-500">o haz clic para seleccionar un archivo</p>
        </div>
        <button className="mt-4 px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg border border-purple-500/50 transition-all">
          Seleccionar Archivo
        </button>
      </div>
    </div>
  );
}

function AnalysisStep({
  label,
  status,
  delay,
}: {
  label: string;
  status: "processing" | "completed";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 p-3 bg-[#0f0f17] rounded-lg border border-[#1a1a24]"
    >
      {status === "completed" ? (
        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      ) : (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </motion.div>
      )}
      <span className="text-sm text-gray-300">{label}</span>
    </motion.div>
  );
}

function PhaseColumn({
  phase,
  color,
  actions,
}: {
  phase: string;
  color: "blue" | "purple" | "cyan";
  actions: string[];
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  };

  return (
    <div className={`flex flex-col ${colorClasses[color]}`}>
      <div className="flex items-center justify-between p-3 rounded-lg border">
        <span className="font-medium">{phase}</span>
        <span className="text-sm">{actions.length} acciones</span>
      </div>
      <div className="space-y-2 px-3 py-2">
        {actions.map((action, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">{action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
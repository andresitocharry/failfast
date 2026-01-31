import { Upload, FileText, Sparkles, Bot, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "motion/react";

interface ActionItem {
  id: string;
  description: string;
  criteria: string;
  status: string;
  insight?: string;
  citation?: string;
}

interface Phase {
  name: string;
  description: string;
  actions: ActionItem[];
  status: string;
}

interface ContractData {
  contract_id: string;
  title: string;
  summary: string;
  thought_process: string;
  erp_vendor_id: string;
  erp_cost_center: string;
  erp_material_group: string;
  parties: string[];
  phases: Phase[];
}

export function ContractUpload() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setUploadedFile(file.name);
    setIsAnalyzing(true);
    setError(null);
    setContractData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/analyze-contract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setContractData(data);
    } catch (err: any) {
      console.error("Upload error:", err);
      // Show the actual error message if available
      setError(err.message || "Error desconocido al procesar el archivo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (uploadedFile) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Uploaded PDF Preview */}
        <div className="bg-[#0f0f17] border border-[#1a1a24] rounded-xl p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white">Contrato Subido</h3>
              <p className="text-xs text-gray-500">{uploadedFile}</p>
            </div>
          </div>

          <div className="bg-[#1a1a24] rounded-lg p-6 flex flex-col items-center justify-center h-[300px] text-gray-500 italic">
            Vista previa no disponible en MVP
          </div>

          <button
            onClick={() => {
              setUploadedFile(null);
              setContractData(null);
              setError(null);
            }}
            className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
          >
            Subir otro archivo
          </button>
        </div>

        {/* Right: AI Agent Analysis */}
        <div className="bg-gradient-to-br from-green-900/20 via-transparent to-blue-900/20 border border-green-500/30 rounded-xl p-6 min-h-[500px]">
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
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {isAnalyzing && (
              <>
                <AnalysisStep label="Leyendo documento..." status="processing" delay={0} />
                <AnalysisStep label="Consultando Gemini Pro (Análisis Experto)..." status="processing" delay={0.5} />
                <AnalysisStep label="Extrayendo estructura del proyecto..." status="processing" delay={1} />
              </>
            )}

            {/* Structured Results */}
            {!isAnalyzing && contractData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2 space-y-4"
              >
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{contractData.title}</h4>
                    <div className="flex gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        SAP Vendor: {contractData.erp_vendor_id || "N/A"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        CC: {contractData.erp_cost_center || "N/A"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-2 mb-2 italic">"{contractData.summary}"</p>

                  <p className="text-sm text-gray-300 mt-2 mb-2 italic">"{contractData.summary}"</p>
                  <p className="text-xs text-gray-400 mt-3">Partes: {contractData.parties.join(", ")}</p>
                </div>

                <p className="text-sm text-gray-400 mb-2">Estructura Detectada:</p>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {contractData.phases.map((phase, idx) => {
                    const colors: Array<"blue" | "purple" | "cyan"> = ["blue", "purple", "cyan"];
                    return (
                      <PhaseColumn
                        key={idx}
                        phase={phase.name}
                        description={phase.description}
                        color={colors[idx % 3]}
                        actions={phase.actions}
                        onActionClick={setSelectedAction}
                      />
                    );
                  })}
                </div>

                {/* Task Detail Modal/Overlay */}
                {selectedAction && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#1a1a24] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative"
                    >
                      <button
                        onClick={() => setSelectedAction(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
                      >
                        ×
                      </button>

                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <Lightbulb className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-white text-lg font-bold">Razón del Agente AI</h3>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-tighter">RAG Verified</span>
                          </div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{selectedAction.id}</p>
                        </div>
                      </div>

                      <div className="space-y-6 text-left">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Tarea Detectada</p>
                          <p className="text-[13px] text-white bg-white/5 p-3 rounded-lg border border-white/5 leading-relaxed">
                            {selectedAction.description}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-amber-400 uppercase font-bold mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Insight BARI Professional
                          </p>
                          <p className="text-[13px] text-gray-300 italic leading-relaxed">
                            "{selectedAction.insight || "No hay insight adicional para esta tarea."}"
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-blue-400 uppercase font-bold mb-2">Fundamento Legal (Cita)</p>
                          <div className="text-[12px] text-gray-400 font-mono bg-black/40 p-4 rounded-lg border border-blue-500/20 max-h-[150px] overflow-y-auto custom-scrollbar">
                            {selectedAction.citation || "No se encontró cita directa."}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedAction(null)}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all font-bold mt-4 shadow-lg shadow-blue-500/20"
                        >
                          Entendido
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-6">
                  <p className="text-sm text-green-400 mb-2">
                    ✓ Análisis completado: <span className="text-white font-medium">{contractData.contract_id}</span> procesado
                  </p>
                  <p className="text-xs text-gray-400">
                    El sistema está listo para desplegar agentes de seguimiento.
                  </p>
                </div>
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
      onClick={handleClick}
      className="border-2 border-dashed border-[#2a2a34] rounded-xl p-12 text-center hover:border-purple-500/50 transition-all cursor-pointer bg-[#0f0f17]"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.txt,.md"
      />

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
      {status === "processing" && <span className="text-xs text-gray-500 animate-pulse">...</span>}
    </motion.div>
  );
}

function PhaseColumn({
  phase,
  description,
  color,
  actions,
  onActionClick,
}: {
  phase: string;
  description: string;
  color: "blue" | "purple" | "cyan";
  actions: ActionItem[];
  onActionClick: (action: ActionItem) => void;
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  };

  return (
    <div className={`flex flex-col ${colorClasses[color]} rounded-lg border overflow-hidden`}>
      <div className="flex items-center justify-between p-3 bg-black/20">
        <div>
          <span className="font-medium block lowercase first-letter:uppercase">{phase}</span>
          <span className="text-xs opacity-70">{description}</span>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-black/20">{actions.length} acciones</span>
      </div>
      <div className="space-y-1 p-2">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-start gap-2 hover:bg-white/10 p-2 rounded-lg transition-all cursor-pointer group active:scale-[0.98]"
            onClick={() => onActionClick(action)}
          >
            <CheckCircle2 className="w-3 h-3 mt-1 opacity-50 group-hover:opacity-100 group-hover:text-amber-400 flex-shrink-0 transition-all" />
            <span className="text-xs opacity-90 group-hover:text-white transition-colors">{action.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
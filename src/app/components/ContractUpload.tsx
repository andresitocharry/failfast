<<<<<<< HEAD
import { Upload, CheckCircle2, Loader2, X, AlertCircle, ExternalLink } from "lucide-react";
=======
import { Upload, FileText, Sparkles, Bot, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
>>>>>>> ai-service
import { useState, useRef } from "react";

<<<<<<< HEAD
const CLOUDINARY_CLOUD_NAME = "datll7nec";
const CLOUDINARY_UPLOAD_PRESET = "presset-fast";
=======
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
>>>>>>> ai-service

export function ContractUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setError(null);
    setUploadedUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Upload to Cloudinary - use 'auto' resource type for PDFs
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
<<<<<<< HEAD
        const errData = await response.json();
        throw new Error(errData.error?.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUploadedUrl(data.secure_url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Error al subir el archivo.");
=======
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setContractData(data);
    } catch (err: any) {
      console.error("Upload error:", err);
      // Show the actual error message if available
      setError(err.message || "Error desconocido al procesar el archivo.");
>>>>>>> ai-service
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      processFile(file);
    } else {
      setError("Por favor solo archivos PDF.");
    }
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

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    setUploadedUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

<<<<<<< HEAD
  if (uploadedUrl && uploadedFile) {
    return (
      <div className="bg-[#0f0f17] border border-green-500/30 rounded-xl p-8 text-center flex flex-col items-center justify-center animate-in fade-in duration-500">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl text-white mb-2">¡Subida Exitosa!</h3>
        <p className="text-gray-400 mb-6">{uploadedFile.name}</p>

        {/* Thumbnail Preview */}
        <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="block relative w-48 aspect-[3/4] mx-auto mb-6 group cursor-pointer overflow-hidden rounded-lg border border-gray-700 shadow-xl transition-all hover:scale-105 hover:border-purple-500">
          <img
            src={uploadedUrl.endsWith('.pdf') ? uploadedUrl.replace('.pdf', '.jpg') : uploadedUrl}
            alt="PDF Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if generic file
              e.currentTarget.src = "https://res.cloudinary.com/demo/image/upload/v1680194689/pdf-icon.png";
=======
          <div className="bg-[#1a1a24] rounded-lg p-6 flex flex-col items-center justify-center h-[300px] text-gray-500 italic">
            Vista previa no disponible en MVP
          </div>

          <button
            onClick={() => {
              setUploadedFile(null);
              setContractData(null);
              setError(null);
>>>>>>> ai-service
            }}
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
        </a>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => window.open(uploadedUrl, '_blank')}
            className="w-full px-6 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/50 flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Ver PDF Completo
          </button>

          <button
            onClick={handleReset}
            className="w-full px-6 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-all border border-gray-700 hover:border-gray-600">
            Subir Otro Archivo
          </button>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  if (isUploading) {
    return (
      <div className="bg-[#0f0f17] border border-[#2a2a34] rounded-xl p-8 text-center flex flex-col items-center justify-center h-[300px]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <h3 className="text-xl text-white mb-2">Subiendo a Cloudinary...</h3>
        <p className="text-gray-500">Procesando: {uploadedFile?.name}</p>
=======
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
>>>>>>> ai-service
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer bg-[#0f0f17] relative flex flex-col items-center justify-center min-h-[300px] ${error ? "border-red-500/50" : "border-[#2a2a34] hover:border-purple-500/50"
        }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
<<<<<<< HEAD
        accept="application/pdf"
      />
=======
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
>>>>>>> ai-service

      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6">
        <Upload className="w-10 h-10 text-purple-400" />
      </div>

      <h3 className="text-white text-xl mb-2">Arrastra tu Contrato PDF aquí</h3>
      <p className="text-gray-500 mb-4">o haz clic para buscar en tu equipo</p>

      <button className="px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg border border-purple-500/50 transition-all pointer-events-none">
        Seleccionar Archivo
      </button>

      {error && (
        <div className="mt-6 flex items-center justify-center gap-2 text-red-400 bg-red-500/10 p-2 rounded-lg" onClick={(e) => e.stopPropagation()}>
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
          <button onClick={handleReset}><X className="w-4 h-4 ml-2 hover:text-white" /></button>
        </div>
      )}
<<<<<<< HEAD
=======
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
>>>>>>> ai-service
    </div>
  );
}
import { Upload, FileText, Sparkles, Bot, CheckCircle2, AlertCircle, Lightbulb, Loader2, X, ExternalLink, Save, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_USERS } from "@/app/data/queries";

const INSERT_CONTRACT = gql`
  mutation InsertContract($object: contracts_insert_input!) {
    insert_contracts_one(object: $object) {
      id
      title
      summary
    }
  }
`;

const INSERT_MILESTONES = gql`
  mutation InsertMilestones($objects: [milestones_insert_input!]!) {
    insert_milestones(objects: $objects) {
      affected_rows
    }
  }
`;

const CLOUDINARY_CLOUD_NAME = "datll7nec";
const CLOUDINARY_UPLOAD_PRESET = "presset-fast";

interface ActionItem {
  id: string;
  description: string;
  criteria: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  insight?: string;
  citation?: string;
  due_date: string;
  milestone_value: string;
  deliverables: string[];
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
  audit_summary: string;
  audit_insights: string[];

  // Neon Synchronization Fields
  client: string;
  type: string;
  status: string;
  progress: number;
  value: string;
  start_date: string;
  end_date: string;
  location: string;
  health: number;
  risk_level: 'bajo' | 'medio' | 'alto';
  project_manager_id: string;
}

export function ContractUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPmId, setSelectedPmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userData } = useQuery(GET_USERS);
  const [insertContract] = useMutation(INSERT_CONTRACT);
  const [insertMilestones] = useMutation(INSERT_MILESTONES);

  useEffect(() => {
    if (userData?.users && userData.users.length > 0 && !selectedPmId) {
      setSelectedPmId(userData.users[0].id);
    }
  }, [userData, selectedPmId]);

  const handleSaveToNeon = async () => {
    if (!contractData || !selectedPmId) {
      if (!selectedPmId) alert('Por favor selecciona un Project Manager');
      return;
    }
    setIsSaving(true);
    try {
      // 1. Insert Contract
      await insertContract({
        variables: {
          object: {
            id: contractData.contract_id,
            title: contractData.title,
            summary: `${contractData.audit_summary}\n\nINSIGHTS DE AUDITORÍA:\n${contractData.audit_insights.join('\n')}`,
            client: contractData.client,
            type: contractData.type,
            status: contractData.status,
            progress: contractData.progress,
            value: contractData.value,
            start_date: contractData.start_date,
            end_date: contractData.end_date,
            location: contractData.location,
            phase: contractData.phases[0]?.name.toLowerCase() || 'inicio',
            health: contractData.health,
            risk_level: contractData.risk_level,
            project_manager_id: selectedPmId, // Usar el ID seleccionado y validado
            pdf_url: uploadedUrl
          }
        }
      });

      // 2. Prepare Milestones from AI actions
      const allMilestones = contractData.phases.flatMap(phase =>
        phase.actions.map(action => ({
          id: `${contractData.contract_id}-${action.id}`, // Generar ID único
          contract_id: contractData.contract_id,
          name: action.description,
          phase: phase.name.toLowerCase(),
          due_date: action.due_date,
          status: action.status,
          value: action.milestone_value,
          deliverables: action.deliverables
        }))
      );

      // 3. Insert Milestones
      if (allMilestones.length > 0) {
        await insertMilestones({
          variables: {
            objects: allMilestones
          }
        });
      }

      alert('¡Contrato e Hitos guardados exitosamente en Neon! 🚀');
    } catch (err: any) {
      console.error('Error saving to Neon:', err);
      setError('Error al guardar en la base de datos: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setError(null);
    setUploadedUrl(null);
    setContractData(null);

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const cloudResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData,
      });

      if (!cloudResponse.ok) {
        const errData = await cloudResponse.json();
        throw new Error(errData.error?.message || "Error al subir a Cloudinary");
      }

      const cloudData = await cloudResponse.json();
      setUploadedUrl(cloudData.secure_url);
      setIsUploading(false);

      // 2. Start AI Analysis
      setIsAnalyzing(true);
      const aiFormData = new FormData();
      aiFormData.append("file", file);

      // Use environment variable for AI service URL (falls back to localhost for development)
      const AI_SERVICE_URL = "https://ai-service-348160653438.us-central1.run.app";
      const aiResponse = await fetch(`${AI_SERVICE_URL}/analyze-contract`, {
        method: "POST",
        body: aiFormData,
      });

      if (!aiResponse.ok) {
        const aiErr = await aiResponse.json().catch(() => null);
        throw new Error(aiErr?.detail || "Error en el análisis de IA");
      }

      const aiData = await aiResponse.json();
      setContractData(aiData);
    } catch (err: any) {
      console.error("Process error:", err);
      setError(err.message || "Error al procesar el contrato.");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
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
    setContractData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (uploadedFile && (isUploading || isAnalyzing || contractData)) {
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
          {/* Left: Storage & Context */}
          <div className="bg-[#0f0f17] border border-[#1a1a24] rounded-xl p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Contrato Original</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-mono">{uploadedFile.name}</p>
                </div>
              </div>
              {(uploadedUrl || isUploading) && (
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase ${uploadedUrl ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {uploadedUrl ? <><CheckCircle2 className="w-2.5 h-2.5" /> Almacenado en Cloudinary</> : <><Loader2 className="w-2.5 h-2.5 animate-spin" /> Subiendo...</>}
                </div>
              )}
            </div>

            {/* PDF Preview / Placeholder */}
            <div className="relative aspect-[3/4] w-full max-w-[320px] mx-auto mb-6 bg-[#1a1a24] rounded-lg border border-[#2a2a34] overflow-hidden group">
              {uploadedUrl ? (
                <img
                  src={uploadedUrl.replace('.pdf', '.jpg')}
                  alt="Quick Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://res.cloudinary.com/demo/image/upload/v1680194689/pdf-icon.png";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-500/30" />
                  <span className="text-xs italic uppercase tracking-widest">Generando vista previa...</span>
                </div>
              )}

              {uploadedUrl && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all shadow-xl"
                  >
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {uploadedUrl && (
                <button
                  onClick={() => window.open(uploadedUrl, '_blank')}
                  className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Ver Documento Full
                </button>
              )}
              <button
                onClick={handleReset}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl transition-all text-sm"
              >
                Subir otro archivo
              </button>
            </div>
          </div>

          {/* Right: AI Analysis Engine */}
          <div className="bg-gradient-to-br from-[#0f0f17] to-[#12121c] border border-purple-500/20 rounded-xl p-6 min-h-[500px] shadow-2xl relative overflow-hidden">
            {/* Analysis Background Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] pointer-events-none" />

            <div className="flex items-center gap-2 mb-8">
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-medium">Análisis del Agente BARI</h3>
              {contractData && !isAnalyzing && (
                <div className="ml-auto flex items-center gap-3">
                  {/* PM Selector */}
                  <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                    <Users className="w-3 h-3 text-purple-400" />
                    <select
                      value={selectedPmId || ''}
                      onChange={(e) => setSelectedPmId(e.target.value)}
                      className="bg-transparent text-[10px] text-gray-300 outline-none cursor-pointer border-none p-0 focus:ring-0"
                    >
                      <option value="" disabled className="bg-[#0f0f17]">Seleccionar PM</option>
                      {userData?.users?.map((user: any) => (
                        <option key={user.id} value={user.id} className="bg-[#0f0f17]">
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSaveToNeon}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-[10px] font-bold uppercase transition-all"
                  >
                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    {isSaving ? 'Guardando...' : 'Guardar en Base de Datos'}
                  </button>
                </div>
              )}
              {isAnalyzing && (
                <div className="flex gap-1 ml-auto">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                </div>
              )}
            </div>

            {isAnalyzing && (
              <div className="space-y-3">
                <AnalysisStep label="Consultando manual de BARI..." status="processing" delay={0.1} />
                <AnalysisStep label="Buscando proveedores en SAP..." status="processing" delay={0.3} />
                <AnalysisStep label="Generando plan de ejecución..." status="processing" delay={0.5} />
              </div>
            )}

            {!isAnalyzing && contractData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Contract Header Data */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{contractData.title}</h4>
                      <p className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">BARI ID: {contractData.contract_id} | CLIENTE: {contractData.client}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex gap-2">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-bold">{contractData.value}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">V: {contractData.erp_vendor_id}</span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold">CC: {contractData.erp_cost_center}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 italic mb-4 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">"{contractData.summary}"</p>

                  {/* Audit Agent Section */}
                  <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-all">
                      <Bot className="w-12 h-12 text-amber-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Informe del Agente Auditor BARI</h5>
                    </div>
                    <p className="text-[13px] text-gray-300 leading-relaxed mb-4">
                      {contractData.audit_summary}
                    </p>
                    <div className="space-y-2">
                      {contractData.audit_insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-gray-400 border-l border-amber-500/30 pl-3">
                          <div className="w-1 h-1 rounded-full bg-amber-500/50 mt-1.5" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 mt-4">
                    <span className="text-[9px] text-gray-500 uppercase font-bold">Partes: </span>
                    {contractData.parties.map((p, i) => (
                      <span key={i} className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-gray-400">{p}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest pl-1">Estructura Estratégica</p>
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

                {/* Final Completion Message */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-green-400 font-medium italic">Análisis listo para ERP</p>
                    <p className="text-[10px] text-gray-500">Haz click en las tareas para ver la razón de la IA.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Task Detail Modal */}
        {
          selectedAction && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1a24] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
              >
                {/* Modal Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none" />

                <button
                  onClick={() => setSelectedAction(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center shadow-inner">
                    <Lightbulb className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white text-xl font-bold">Análisis del Agente</h3>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-tighter shadow-sm">RAG Verified</span>
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-mono mt-1">{selectedAction.id}</p>
                  </div>
                </div>

                <div className="space-y-6 text-left">
                  <section>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-3 tracking-widest pl-1">Tarea Identificada</p>
                    <div className="text-[14px] text-white bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed shadow-sm">
                      {selectedAction.description}
                    </div>
                  </section>

                  <section>
                    <p className="text-[10px] text-amber-400 uppercase font-bold mb-3 tracking-widest flex items-center gap-1.5 pl-1">
                      <Sparkles className="w-3 h-3" /> Insight BARI Pro
                    </p>
                    <div className="text-[13px] text-gray-300 italic leading-relaxed pl-4 border-l-2 border-amber-500/30">
                      "{selectedAction.insight || "No hay insight adicional para esta tarea."}"
                    </div>
                  </section>

                  <section>
                    <p className="text-[10px] text-blue-400 uppercase font-bold mb-3 tracking-widest pl-1">Fundamento Contractual</p>
                    <div className="text-[12px] text-gray-400 font-mono bg-black/40 p-5 rounded-xl border border-blue-500/20 max-h-[180px] overflow-y-auto custom-scrollbar leading-relaxed">
                      {selectedAction.citation || "No se encontró cita directa."}
                    </div>
                  </section>

                  <button
                    onClick={() => setSelectedAction(null)}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl transition-all font-bold mt-4 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                  >
                    Continuar con el Análisis
                  </button>
                </div>
              </motion.div>
            </div>
          )}
      </>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-xl p-16 text-center transition-all cursor-pointer bg-[#0f0f17] relative flex flex-col items-center justify-center min-h-[400px] group ${error ? "border-red-500/50" : "border-[#2a2a34] hover:border-purple-500/50"}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf"
      />

      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500">
        <div className="absolute inset-0 bg-purple-500/5 blur-2xl rounded-full" />
        <Upload className="w-12 h-12 text-purple-400 relative z-10" />
      </div>

      <h3 className="text-white text-2xl mb-3 font-bold tracking-tight">Cargar Contrato para BARI</h3>
      <p className="text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">Arrastra tu PDF aquí o haz click para explorar. El agente detectará automáticamente proveedores, centros de costo y tareas.</p>

      <button className="px-8 py-3 bg-purple-500/20 group-hover:bg-purple-500/30 text-purple-400 rounded-xl border border-purple-500/50 transition-all font-bold pointer-events-none">
        Seleccionar de mi PC
      </button>

      {error && (
        <div className="mt-8 flex items-center justify-center gap-3 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20" onClick={(e) => e.stopPropagation()}>
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{error}</span>
          <button onClick={handleReset} className="ml-2 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}

function AnalysisStep({ label, status, delay }: { label: string; status: "processing" | "completed"; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5"
    >
      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
        {status === "processing" ? (
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
        )}
      </div>
      <span className="text-xs text-gray-300">{label}</span>
      <span className={`text-[10px] ml-auto italic ${status === "processing" ? "text-gray-500" : "text-green-500"}`}>
        {status === "processing" ? "Analizando..." : "Completado"}
      </span>
    </motion.div>
  );
}

function PhaseColumn({ phase, description, color, actions, onActionClick }: { phase: string; description: string; color: "blue" | "purple" | "cyan"; actions: ActionItem[]; onActionClick: (action: ActionItem) => void; }) {
  const colorClasses = {
    blue: "bg-blue-500/5 border-blue-500/20 text-blue-400",
    purple: "bg-purple-500/5 border-purple-500/20 text-purple-400",
    cyan: "bg-cyan-500/5 border-cyan-500/20 text-cyan-400",
  };

  return (
    <div className={`flex flex-col ${colorClasses[color]} rounded-xl border overflow-hidden transition-all hover:bg-white/[0.02]`}>
      <div className="flex items-center justify-between p-4 bg-white/5">
        <div>
          <span className="font-bold text-xs block uppercase tracking-tighter">{phase}</span>
          <span className="text-[10px] opacity-60 italic">{description}</span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/40 font-bold border border-white/10">{actions.length}</span>
      </div>
      <div className="space-y-1 p-2">
        {actions.length > 0 ? actions.map((action, index) => (
          <div
            key={index}
            className="flex items-start gap-3 hover:bg-white/10 p-2.5 rounded-lg transition-all cursor-pointer group active:scale-[0.98]"
            onClick={() => onActionClick(action)}
          >
            <div className=" mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 group-hover:text-amber-400 transition-all" />
            </div>
            <span className="text-xs opacity-80 group-hover:text-white group-hover:font-medium transition-all leading-tight">{action.description}</span>
          </div>
        )) : <p className="p-4 text-[10px] text-gray-600 text-center italic">No hay tareas específicas en esta fase.</p>}
      </div>
    </div>
  );
}
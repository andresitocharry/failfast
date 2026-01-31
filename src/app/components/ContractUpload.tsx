import { Upload, CheckCircle2, Loader2, X, AlertCircle, ExternalLink } from "lucide-react";
import { useState, useRef } from "react";

const CLOUDINARY_CLOUD_NAME = "datll7nec";
const CLOUDINARY_UPLOAD_PRESET = "presset-fast";

export function ContractUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        const errData = await response.json();
        throw new Error(errData.error?.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUploadedUrl(data.secure_url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Error al subir el archivo.");
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

  if (isUploading) {
    return (
      <div className="bg-[#0f0f17] border border-[#2a2a34] rounded-xl p-8 text-center flex flex-col items-center justify-center h-[300px]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <h3 className="text-xl text-white mb-2">Subiendo a Cloudinary...</h3>
        <p className="text-gray-500">Procesando: {uploadedFile?.name}</p>
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
        accept="application/pdf"
      />

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
    </div>
  );
}
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: (text: string) => void;
  onTextPaste: (text: string) => void;
  isExtracting: boolean;
  setIsExtracting: (val: boolean) => void;
}

export function ResumeUpload({ onUpload, onTextPaste, isExtracting, setIsExtracting }: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Upload failed with status ${response.status}`);
        } else {
          const errorText = await response.text();
          console.error("Server returned non-JSON error:", errorText);
          throw new Error(`Upload failed with status ${response.status}. Please check server logs.`);
        }
      }

      const data = await response.json();
      if (data.text) {
        onUpload(data.text);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert(error instanceof Error ? error.message : "Failed to extract text from PDF");
    } finally {
      setIsExtracting(false);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border border-black p-4 md:p-8 flex flex-col items-center justify-center cursor-pointer bg-white neo-shadow neo-shadow-hover group w-full"
      >
        <div className="bg-black p-3 rounded-none mb-4 group-hover:bg-blue-600 transition-colors">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-widest text-black text-center">Upload Resume PDF</p>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight text-center">Max 5MB &bull; PDF only</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf"
        />
        {isExtracting && (
          <div className="mt-4 flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
            Processing...
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-black border-dashed"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
          <span className="bg-[#f8f8f8] px-2 text-gray-400">OR</span>
        </div>
      </div>

      <textarea
        placeholder="Paste plain text content here..."
        className="w-full h-24 p-4 border border-black bg-white focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all resize-none text-xs font-bold font-sans"
        onChange={(e) => onTextPaste(e.target.value)}
      ></textarea>
    </div>
  );
}

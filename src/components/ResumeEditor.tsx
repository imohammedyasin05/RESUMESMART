import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeEditorProps {
  content: string;
  setContent: (content: string) => void;
  isLoading: boolean;
}

export function ResumeEditor({ content, setContent, isLoading }: ResumeEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!editorRef.current) return;
    const editorElement = editorRef.current.querySelector('.ql-editor') as HTMLElement;
    if (!editorElement) return;

    try {
      const canvas = await html2canvas(editorElement, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume-improved.pdf');
    } catch (error) {
      console.error('PDF generation failed', error);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  return (
    <div className="h-full flex flex-col items-center relative gap-6">
      <div className="absolute top-0 right-0 z-10 flex gap-2">
         <button 
           onClick={() => setContent('')}
           className="w-10 h-10 border border-black bg-white flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:text-white transition-all uppercase text-[10px]"
         >
           X
         </button>
         <button 
           onClick={downloadPDF}
           disabled={!content || isLoading}
           className="w-10 h-10 border border-black bg-white flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
         >
           <Download className="w-4 h-4" />
         </button>
      </div>

      <div className="w-full max-w-[640px] bg-white border border-black p-6 md:p-12 shadow-[10px_10px_30px_rgba(0,0,0,0.1)] md:shadow-[20px_20px_60px_rgba(0,0,0,0.1)] flex flex-col min-h-[500px] md:min-h-[800px] mb-12">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 border-4 border-black border-t-blue-600 animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Polishing Resume...</p>
            </div>
          </div>
        ) : null}
        
        <div className="flex-1 ql-bold-theme" ref={editorRef}>
          <ReactQuill 
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Your improved resume text payload will be output here..."
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}

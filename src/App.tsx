/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ResumeUpload } from "./components/ResumeUpload";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { ResumeEditor } from "./components/ResumeEditor";
import { analyzeResume, improveResume } from "./services/gemini";
import { FileText, Sparkles, Wand2, BarChart3, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AnalysisResult {
  score: number;
  weaknesses: string[];
  missing_keywords: string[];
  suggestions: string[];
}

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [improvedContent, setImprovedContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText) return;
    if (!targetRole.trim()) {
      alert("Please enter a target job role first!");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Job description is required!");
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeText, targetRole, jobDescription);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImprove = async () => {
    if (!resumeText) return;
    if (!targetRole.trim()) {
      alert("Please enter a target job role first!");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Job description is required!");
      return;
    }
    setIsImproving(true);
    try {
      const improved = await improveResume(resumeText, targetRole, jobDescription);
      // Basic formatting to convert plain text to simple HTML for Quill
      const formatted = improved
        .split('\n')
        .map((line: string) => line.trim() ? `<p>${line}</p>` : '<p><br></p>')
        .join('');
      setImprovedContent(formatted);
    } catch (error) {
      console.error("Improvement failed", error);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans text-[#1a1a1a]">
      {/* Header */}
      <header className="h-16 border-b border-black flex items-center justify-between px-8 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-black text-2xl tracking-tighter uppercase">Resume<span className="text-blue-600">Smart</span></span>
          <span className="bg-black text-white text-[10px] px-1.5 py-0.5 font-bold uppercase tracking-widest leading-none">v1.2</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest">
          <a href="#" className="border-b-2 border-black pb-1">Optimizer</a>
          <a href="#" className="text-gray-400 hover:text-black transition-colors">Templates</a>
          <a href="#" className="text-gray-400 hover:text-black transition-colors">History</a>
        </nav>
      </header>

      <main className="flex flex-col lg:flex-row flex-1 overflow-x-hidden">
        {/* Left Column: Tools & Analysis (Sidebar style) */}
        <aside className="w-full lg:w-[420px] lg:border-r border-black flex flex-col bg-white shrink-0">
          <div className="p-4 md:p-8 border-b border-black bg-[#f8f8f8] space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Target Role</label>
              <span className="text-[10px] font-mono text-blue-600 font-bold hidden sm:inline">STATUS_ACTIVE</span>
            </div>
            
            <div className="mt-1">
              <input 
                type="text"
                placeholder="Enter target role (e.g. AI Engineer)"
                className="w-full p-4 border-2 border-black bg-white font-bold uppercase text-xs tracking-widest focus:outline-none neo-shadow transition-all appearance-none placeholder:text-gray-300 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Job Description</label>
              <textarea 
                placeholder="Paste job description here..."
                className="w-full p-4 border-2 border-black bg-white font-medium text-xs tracking-wide focus:outline-none neo-shadow transition-all appearance-none placeholder:text-gray-300 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none min-h-[120px] md:min-h-[150px] resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <ResumeUpload 
              onUpload={(text) => { 
                setResumeText(text); 
                setImprovedContent(text.split('\n').map(l => `<p>${l}</p>`).join(''));
              }}
              onTextPaste={(text) => {
                setResumeText(text);
                setImprovedContent(text.split('\n').map(l => `<p>${l}</p>`).join(''));
              }}
              isExtracting={isExtracting}
              setIsExtracting={setIsExtracting}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAnalyze}
                disabled={!resumeText || isAnalyzing}
                className="btn-neo-secondary py-3 flex items-center justify-center gap-2 disabled:opacity-50 w-full"
              >
                <BarChart3 className="w-4 h-4" />
                Analyze
              </button>
              <button
                onClick={handleImprove}
                disabled={!resumeText || isImproving}
                className="btn-neo-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 w-full"
              >
                <Wand2 className="w-4 h-4" />
                Rewrite
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">AI Analysis Report</h3>
              {isAnalyzing && (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-black border-t-transparent"></div>
              )}
            </div>
            <AnalysisPanel result={analysis} isAnalyzing={isAnalyzing} />
          </div>
        </aside>

        {/* Right Column: Live Editor */}
        <section className="flex-1 bg-[#eeeeee] p-4 md:p-8 lg:p-12 flex flex-col items-center justify-start overflow-hidden relative min-h-screen">
          <div className="w-full max-w-[800px] h-full">
            <ResumeEditor 
              content={improvedContent} 
              setContent={setImprovedContent} 
              isLoading={isImproving}
            />
          </div>
        </section>
      </main>

      <footer className="h-10 bg-white border-t border-black flex items-center justify-center px-8">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
          Powered by Gemini AI &bull; Built with React &bull; 2026
        </span>
      </footer>
    </div>
  );
}


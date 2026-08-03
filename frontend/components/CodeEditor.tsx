"use client";

import React, { useRef, useState } from "react";
import { Code2, Play, Upload, Copy, Trash2, Check, FileCode, Sparkles } from "lucide-react";
import { CODE_PRESETS, CodePreset } from "@/constants/presets";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onReview: () => void;
  loading: boolean;
  language: string;
  onLanguageChange: (lang: string) => void;
  onSelectPreset: (preset: CodePreset) => void;
}

const SUPPORTED_LANGUAGES = [
  { id: "javascript", label: "JavaScript (.js)" },
  { id: "typescript", label: "TypeScript (.ts)" },
  { id: "python", label: "Python (.py)" },
  { id: "cpp", label: "C++ (.cpp)" },
  { id: "sql", label: "SQL (.sql)" },
  { id: "rust", label: "Rust (.rs)" },
  { id: "go", label: "Go (.go)" },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onReview,
  loading,
  language,
  onLanguageChange,
  onSelectPreset,
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChange(content);
        // Auto detect language from extension
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "py") onLanguageChange("python");
        else if (ext === "js" || ext === "jsx") onLanguageChange("javascript");
        else if (ext === "ts" || ext === "tsx") onLanguageChange("typescript");
        else if (ext === "cpp" || ext === "c" || ext === "h") onLanguageChange("cpp");
        else if (ext === "sql") onLanguageChange("sql");
        else if (ext === "rs") onLanguageChange("rust");
        else if (ext === "go") onLanguageChange("go");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-md">
      
      {/* Editor Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-950/70 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          
          <div className="h-4 w-[1px] bg-slate-800" />
          
          {/* Language Selector */}
          <div className="flex items-center space-x-1">
            <FileCode className="h-4 w-4 text-indigo-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-slate-900 text-slate-200">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center space-x-2">
          
          {/* Preset Selector */}
          <select
            onChange={(e) => {
              const selected = CODE_PRESETS.find((p) => p.id === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            defaultValue=""
            className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs text-slate-300 border border-slate-800 focus:border-indigo-500 focus:outline-none"
          >
            <option value="" disabled>Load Bug Preset...</option>
            {CODE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".js,.ts,.py,.cpp,.c,.h,.sql,.rs,.go,.txt"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload code file"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <Upload className="h-4 w-4" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>

          <button
            onClick={() => onChange("")}
            title="Clear editor"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex flex-1 min-h-[380px] max-h-[550px] overflow-auto bg-slate-950/60 font-mono text-sm">
        
        {/* Line Numbers Sidebar */}
        <div className="select-none py-4 px-3 text-right text-xs text-slate-600 bg-slate-950/80 border-r border-slate-800/60">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder="// Paste or write code here for instant AI review..."
          spellCheck={false}
          className="w-full resize-none bg-transparent p-4 text-slate-100 placeholder-slate-600 leading-6 focus:outline-none border-none font-mono"
        />
      </div>

      {/* Editor Bottom Bar & Run Review Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/90 px-4 py-3">
        
        {/* Code Stats */}
        <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
          <span>{lineCount} lines</span>
          <span>{code.length} chars</span>
          <span>{(code.length / 1024).toFixed(1)} KB</span>
        </div>

        {/* Review Execution Button */}
        <button
          onClick={onReview}
          disabled={loading || !code.trim()}
          className={`relative group flex items-center justify-center space-x-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 ${
            loading || !code.trim()
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
              : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95"
          }`}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Analyzing Agent Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Analyze Code with AI</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
};

"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { MarkdownRenderer } from "@/components/markdown-renderer";

function ResultsContent() {
  const searchParams = useSearchParams();
  const filename = searchParams.get("filename") || "result";
  const markdown = searchParams.get("markdown") || "";

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename.replace(/\.[^.]+$/, "")}_transaction.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!markdown) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-2">No results to display</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Upload a new image
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="glass rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/30 p-6 sm:p-8 mb-6 border border-white/20 dark:border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-white bg-clip-text text-transparent">
                  Transaction Document
                </h1>
                <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Source: <span className="font-medium text-zinc-700 dark:text-zinc-300">{filename}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setViewMode(viewMode === "preview" ? "raw" : "preview")}
                className="px-4 py-2.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-all font-medium text-sm flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {viewMode === "preview" ? "View Raw" : "View Preview"}
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-all font-medium text-sm flex items-center gap-2 shadow-sm"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600 dark:text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all font-medium text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <a
                href="/"
                className="px-4 py-2.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-all font-medium text-sm flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Upload
              </a>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="glass rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/30 border border-white/20 dark:border-white/5 overflow-hidden">
          {viewMode === "preview" ? (
            <div className="p-6 sm:p-10">
              <MarkdownRenderer content={markdown} />
            </div>
          ) : (
            <div className="relative">
              <pre className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900/50 overflow-x-auto text-sm leading-relaxed">
                <code className="text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap break-words">
                  {markdown}
                </code>
              </pre>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-6 glass-subtle rounded-xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">About this document</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                This transaction document was generated using AI-powered OCR technology. 
                The data has been cleaned and structured for better readability. 
                Please verify important details with the original receipt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">Loading document...</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Preparing your transaction data</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

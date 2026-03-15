"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (PNG, JPG, JPEG, WEBP)");
      return;
    }

    setFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const ocrData = await ocrResponse.json();

      if (!ocrResponse.ok) {
        throw new Error(ocrData.error || "OCR processing failed");
      }

      const aiResponse = await fetch("/api/clean", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawText: ocrData.raw_text,
        }),
      });

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        throw new Error(aiData.error || "AI cleaning failed");
      }

      router.push(
        `/results?filename=${encodeURIComponent(file.name)}&markdown=${encodeURIComponent(aiData.markdown)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered OCR
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-white bg-clip-text text-transparent mb-4">
            NotaBypass
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Transform receipt images into structured transaction documents using AI
          </p>
        </div>

        {/* Upload Card */}
        <div className="glass rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/30 p-6 sm:p-8 border border-white/20 dark:border-white/5 mb-6">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]"
                : "border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 hover:border-zinc-400 dark:hover:border-zinc-600"
            } ${preview ? "p-4" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-80 mx-auto rounded-lg shadow-lg object-contain"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                  Upload your receipt
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">
                  Drag and drop your image here, or click to browse from your device
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <button
                  onClick={() => inputRef.current?.click()}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Select Image
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-red-800 dark:text-red-300">Upload Error</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {file && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                loading
                  ? "bg-zinc-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-500/30"
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing your image...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Process Image
                </span>
              )}
            </button>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-subtle rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Smart OCR</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Extract text accurately from any receipt or transaction image</p>
          </div>

          <div className="glass-subtle rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">AI Cleaning</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Clean and structure data using advanced AI technology</p>
          </div>

          <div className="glass-subtle rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Markdown Export</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Get beautiful, readable transaction documents</p>
          </div>

          <div className="glass-subtle rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Secure & Private</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Your data is processed securely and never stored</p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-8 glass-subtle rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            How it works
          </h3>
          <div className="space-y-4">
            {[
              { step: 1, title: "Upload Image", desc: "Select or drag your receipt image", color: "blue" },
              { step: 2, title: "OCR Processing", desc: "Extract text using PaddleOCR", color: "purple" },
              { step: 3, title: "AI Cleaning", desc: "Structure data with Google Gemma AI", color: "green" },
              { step: 4, title: "Get Results", desc: "Download formatted markdown document", color: "amber" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-sm font-bold text-${item.color}-600 dark:text-${item.color}-400`}>{item.step}</span>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.title}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

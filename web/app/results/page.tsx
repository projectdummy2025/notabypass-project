"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const filename = searchParams.get("filename") || "result";
  const markdown = searchParams.get("markdown") || "";

  const [copied, setCopied] = useState(false);

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

  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let listLevel = 0;

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre key={index} className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm">{codeContent.join("\n")}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold mt-6 mb-4 text-zinc-900 dark:text-white">
            {line.slice(2)}
          </h1>
        );
        return;
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold mt-5 mb-3 text-zinc-900 dark:text-white">
            {line.slice(3)}
          </h2>
        );
        return;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-zinc-900 dark:text-white">
            {line.slice(4)}
          </h3>
        );
        return;
      }

      // Bold and italic
      let processedLine: React.ReactNode = line;

      // Tables
      if (line.includes("|") && line.trim().startsWith("|")) {
        const cells = line.split("|").filter((_, i, arr) => i !== 0 && i !== arr.length - 1);
        const isSeparator = cells.every(cell => /^[\s:-]+$/.test(cell));
        
        if (!isSeparator) {
          elements.push(
            <div key={index} className="flex border-b border-zinc-200 dark:border-zinc-700">
              {cells.map((cell, i) => (
                <div
                  key={i}
                  className={`flex-1 py-2 px-3 text-zinc-700 dark:text-zinc-300 ${i === 0 ? "font-medium" : ""}`}
                >
                  {cell.trim()}
                </div>
              ))}
            </div>
          );
        }
        return;
      }

      // List items
      const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.*)/);
      if (listMatch) {
        const indent = listMatch[1].length / 2;
        const marker = listMatch[2];
        const content = listMatch[3];
        
        elements.push(
          <div
            key={index}
            className="flex items-start gap-2 my-1"
            style={{ marginLeft: `${indent * 1.5}rem` }}
          >
            <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">
              {marker}
            </span>
            <span className="text-zinc-700 dark:text-zinc-300">{content}</span>
          </div>
        );
        return;
      }

      // Horizontal rule
      if (line.match(/^---+$/)) {
        elements.push(<hr key={index} className="my-6 border-zinc-300 dark:border-zinc-700" />);
        return;
      }

      // Empty line
      if (line.trim() === "") {
        elements.push(<div key={index} className="h-4" />);
        return;
      }

      // Regular paragraph with inline formatting
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
      processedLine = parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm">{part.slice(1, -1)}</code>;
        }
        return part;
      });

      elements.push(
        <p key={index} className="text-zinc-700 dark:text-zinc-300 my-2">
          {processedLine}
        </p>
      );
    });

    return elements;
  };

  if (!markdown) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">No results to display</p>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Upload a new image
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Transaction Document
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Source: {filename}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Upload New
            </a>
          </div>
        </div>

        {/* Document Content */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-8">
          <article className="prose dark:prose-invert max-w-none">
            {renderMarkdown(markdown)}
          </article>
        </div>

        {/* Raw Markdown View */}
        <details className="mt-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
          <summary className="p-4 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
            View Raw Markdown
          </summary>
          <pre className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-b-xl overflow-x-auto text-sm text-zinc-800 dark:text-zinc-200">
            {markdown}
          </pre>
        </details>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-zinc-600 dark:text-zinc-400 mt-4">Loading...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

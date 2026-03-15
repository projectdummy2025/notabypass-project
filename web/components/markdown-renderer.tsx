"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

// Helper component untuk tabel dengan styling fintech
function Table({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
      {children}
    </thead>
  );
}

function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">{children}</tbody>;
}

function TableRow({ children }: { children: ReactNode }) {
  return (
    <tr className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 transition-colors duration-150">
      {children}
    </tr>
  );
}

function TableHeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
      {children}
    </th>
  );
}

function TableCell({ children, align = "left" }: { children: ReactNode; align?: "left" | "right" | "center" }) {
  const alignment = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };

  return (
    <td className={`px-4 py-3.5 text-zinc-700 dark:text-zinc-300 ${alignment[align]}`}>
      {children}
    </td>
  );
}

// Komponen utama Markdown Renderer
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-zinc dark:prose-invert max-w-none markdown-premium ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings dengan styling fintech yang berani
          h1: ({ node, children, ...props }) => (
            <h1
              className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 pb-2 border-b-2 border-zinc-200 dark:border-zinc-800"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2
              className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white mt-8 mb-4 pb-1.5 border-b border-zinc-200 dark:border-zinc-800"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3
              className="text-lg font-medium tracking-tight text-zinc-800 dark:text-zinc-100 mt-6 mb-3"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ node, children, ...props }) => (
            <h4
              className="text-base font-medium tracking-tight text-zinc-800 dark:text-zinc-100 mt-5 mb-2"
              {...props}
            >
              {children}
            </h4>
          ),

          // Paragraph dengan line-height yang lega
          p: ({ node, children, ...props }) => (
            <p
              className="text-zinc-700 dark:text-zinc-300 leading-8 mb-4 font-normal"
              {...props}
            >
              {children}
            </p>
          ),

          // Table dengan styling premium
          table: ({ node, children }) => (
            <Table>{children}</Table>
          ),
          thead: ({ node, children }) => (
            <TableHead>{children}</TableHead>
          ),
          tbody: ({ node, children }) => (
            <TableBody>{children}</TableBody>
          ),
          tr: ({ node, children }) => (
            <TableRow>{children}</TableRow>
          ),
          th: ({ node, children }) => (
            <TableHeaderCell>{children}</TableHeaderCell>
          ),
          td: ({ node, children, ...props }: any) => {
            // Deteksi apakah ini kolom angka/harga
            const contentStr = String(children || "");
            const isNumeric = /^[\d.,\sRp$¥€£\-]+$/.test(contentStr.trim());
            const isAlignRight = isNumeric || props.className?.includes("text-right");

            return (
              <TableCell align={isAlignRight ? "right" : "left"}>
                {children}
              </TableCell>
            );
          },

          // List dengan indentasi cantik
          ul: ({ node, children, ...props }) => (
            <ul
              className="my-4 space-y-2 pl-2 list-none"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol
              className="my-4 space-y-2 pl-2 list-decimal list-outside"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }) => (
            <li
              className="text-zinc-700 dark:text-zinc-300 leading-7 pl-3 relative"
              {...props}
            >
              {children}
            </li>
          ),

          // Text formatting dengan sentuhan premium
          strong: ({ node, children, ...props }) => {
            const contentStr = String(children || "");
            // Styling khusus untuk kata "Total" atau kata kunci penting
            const isEmphasis = /total|subtotal|grand total|jumlah|keseluruhan/i.test(contentStr);

            return (
              <strong
                className={`font-semibold ${
                  isEmphasis
                    ? "text-zinc-900 dark:text-white text-base"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
                {...props}
              >
                {children}
              </strong>
            );
          },
          em: ({ node, children, ...props }) => (
            <em
              className="text-zinc-600 dark:text-zinc-400 italic font-normal"
              {...props}
            >
              {children}
            </em>
          ),

          // Inline code dengan styling minimal
          code: ({ node, inline, children, ...props }: any) =>
            inline ? (
              <code
                className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-sm font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="block p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-sm font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 overflow-x-auto"
                {...props}
              >
                {children}
              </code>
            ),

          // Blockquote dengan accent color
          blockquote: ({ node, children, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 py-3 my-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg text-zinc-700 dark:text-zinc-300 italic"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Horizontal rule yang clean
          hr: ({ node, ...props }) => (
            <hr
              className="my-8 border-zinc-200 dark:border-zinc-800"
              {...props}
            />
          ),

          // Link dengan styling subtle
          a: ({ node, children, ...props }) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline-offset-2 hover:underline font-medium transition-colors"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;

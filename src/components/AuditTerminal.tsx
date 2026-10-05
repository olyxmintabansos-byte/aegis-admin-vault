"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, ChevronUp, ChevronDown, Download } from "lucide-react";
import { AUDIT_LOGS_INITIAL } from "@/lib/utils";

interface Props {
  logs: string[];
}

export default function AuditTerminal({ logs }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      logs: logs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aegis-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Toggle Bar */}
      <div
        className="bg-[#0E111A] border-t border-[#1F293D] px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1a1f2e] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-[var(--accent-emerald)]" />
          <span className="font-mono text-sm text-white">
            REAL-TIME AUDIT LEDGER
          </span>
          <span className="text-xs text-gray-500">({logs.length} entries)</span>
        </div>
        <div className="flex items-center gap-3">
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExport();
              }}
              className="flex items-center gap-1 px-3 py-1 bg-[var(--accent-cyan)] text-black text-xs font-mono rounded hover:opacity-90 transition-opacity"
            >
              <Download size={14} />
              EXPORT .json
            </button>
          )}
          {isOpen ? (
            <ChevronDown size={20} className="text-gray-400" />
          ) : (
            <ChevronUp size={20} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Terminal Content */}
      {isOpen && (
        <div className="bg-black border-t border-[#1F293D] p-4 h-64 overflow-y-auto">
          <div className="font-mono text-xs space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="text-[var(--accent-emerald)]">
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface AnalysisTerminalProps {
  onComplete?: () => void;
}

const LOG_STEPS = [
  "> Initializing Vision AI...",
  "> Capturing target website...",
  "> Analyzing visual hierarchy...",
  "> Extracting USP and color tokens...",
  "> Done.",
];

export function AnalysisTerminal({ onComplete }: AnalysisTerminalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < LOG_STEPS.length) {
        setLogs((prev) => [...prev, LOG_STEPS[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
            onComplete?.();
        }, 500);
      }
    }, 800); // Slightly slower for better readability

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-2xl bg-zinc-950 border border-zinc-800 font-mono text-sm"
    >
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
        <div className="flex items-center text-zinc-400 text-xs">
          <Terminal className="w-3 h-3 mr-2" />
          <span>vision-analysis-agent — zsh</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="p-6 h-64 overflow-y-auto text-emerald-400 space-y-2"
      >
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {log}
          </motion.div>
        ))}
        <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-emerald-400 ml-1 align-middle"
        />
      </div>
    </motion.div>
  );
}

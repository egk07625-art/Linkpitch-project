"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnalysisTerminal } from "@/components/mixer/AnalysisTerminal";
import { analyzeUrl } from "@/app/actions/analyze-url";

export default function VisionAnalysisPage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setShowTerminal(true);

    const formData = new FormData();
    formData.append("url", url);

    try {
      const result = await analyzeUrl(formData);
      
      if (result.success && result.prospectId) {
        // Wait for terminal animation to finish (handled by onComplete)
        // We store the ID to redirect later or redirect here if terminal is done?
        // The terminal takes about 5 * 0.8s + 0.5s = 4.5s
        // The server action takes 3s.
        // So the server action will finish before the terminal.
        // We can just wait for the terminal onComplete callback to redirect.
        
        // We'll use a ref or state to hold the ID if we needed to, 
        // but here we can just pass the ID to the onComplete handler or use a closure.
        // Actually, onComplete is called by the Terminal.
        // We need to pass the prospectId to the onComplete handler.
        
        // Let's store it in a ref or just use the closure if we define onComplete here.
        // But onComplete is defined in the render.
        
        // Better approach:
        // 1. Start analysis.
        // 2. When analysis is done, set a flag "analysisReady" with the ID.
        // 3. When terminal is done, check "analysisReady".
        //    If ready, redirect. If not, wait (maybe show a "Finalizing..." log).
        
        // For this MVP, since the mock is 3s and terminal is ~4.5s, 
        // we can just redirect in the terminal's onComplete.
        // But we need the ID.
        
        // Let's just use a simple approach:
        // The onComplete of the terminal will trigger the redirect.
        // We need to pass the ID to it.
        
        // We can use a state for prospectId.
        setProspectId(result.prospectId);
      }
    } catch (error) {
      console.error("Analysis failed", error);
      setIsAnalyzing(false);
      setShowTerminal(false);
    }
  };

  const [prospectId, setProspectId] = useState<string | null>(null);

  const handleTerminalComplete = () => {
    if (prospectId) {
      router.push(`/prospects/${prospectId}/mix`);
    } else {
      // If terminal finishes but analysis isn't done (unlikely with current timings),
      // we should probably wait or show an error.
      // For now, let's assume happy path.
      console.log("Terminal finished, waiting for prospectId...");
      // In a real app we'd handle this better.
    }
  };

  // Effect to redirect if both are ready?
  // No, let's just let the terminal callback handle it if ID is present.
  // If ID comes LATER than terminal, we need to redirect then.
  
  // Let's use an effect.
  const [terminalDone, setTerminalDone] = useState(false);
  
  if (terminalDone && prospectId) {
      router.push(`/prospects/${prospectId}/mix`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-zinc-50">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!showTerminal ? (
            <motion.div
              key="input-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12 text-center"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center space-x-2 text-zinc-500 mb-8"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium tracking-wider uppercase">Vision AI Analyst</span>
                </motion.div>
                
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                    어떤 브랜드를
                    <br />
                    분석할까요?
                  </span>
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="relative group">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-transparent border-b-2 border-zinc-800 py-4 text-2xl md:text-4xl text-center focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-800"
                  autoFocus
                />
                
                <AnimatePresence>
                  {url.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      type="submit"
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-400 transition-colors"
                    >
                      <ArrowRight className="w-8 h-8" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-zinc-600 text-sm"
              >
                Press Enter to start analysis
              </motion.p>
            </motion.div>
          ) : (
            <AnalysisTerminal onComplete={() => setTerminalDone(true)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

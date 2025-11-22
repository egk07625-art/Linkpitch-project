"use client";

import { FloatingNavbar } from "@/components/landing/FloatingNavbar";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
      <FloatingNavbar />

      <main className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Background Gradient Orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center mb-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
              <span className="block text-white">콜드메일 작성 시간을</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 to-indigo-600">
                6시간 → 10분으로
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              퍼포먼스 마케터를 위한 AI 수주 비서 Linkpitch
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-all duration-300 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.6)] hover:-translate-y-1"
              >
                <span className="relative z-10">시작하기</span>
                <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Bento Grid Section */}
        <BentoGrid />
      </main>

      <Footer />
    </div>
  );
}

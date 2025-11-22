"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FloatingNavbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm sm:max-w-md"
    >
      <div className="flex items-center justify-between px-6 py-3 mx-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/5">
        <Link href="/" className="text-lg font-bold text-white tracking-tight">
          Linkpitch
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}

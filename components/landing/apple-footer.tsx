'use client';

import { motion } from 'framer-motion';

export function AppleFooter() {
  return (
    <footer className="py-16 px-6 md:px-20 border-t border-white/10 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">LinkPitch</h3>
          <p className="text-[#A1A1A6] text-sm">
            퍼포먼스마케터를 위한 콜드메일 AI 오토메이션
          </p>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2025 LinkPitch. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}

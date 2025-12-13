'use client';

import { motion } from 'framer-motion';

export function AppleFooter() {
  return (
    <footer className="bg-black pt-20 pb-12 border-t border-white/10 text-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-6xl mx-auto px-6"
      >
        {/* 1. Brand Identity */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">LinkPitch</h3>
            <p className="text-gray-500 font-medium">
              가장 진보된 AI 콜드메일 오토메이션
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/10 mb-8"></div>

        {/* 2. Business Info & Links */}
        <div className="flex flex-col md:flex-row justify-between gap-8 text-xs leading-relaxed text-gray-600">
          {/* Left: Company Details */}
          <div className="flex flex-col gap-1.5">
            <p className="flex flex-wrap gap-2">
              <span className="font-bold text-gray-500">링크피치</span>
              <span className="text-gray-700">|</span>
              <span>대표: 강은교</span>
            </p>
            <p>
              문의:{' '}
              <a
                href="mailto:egk07625@gmail.com"
                className="hover:text-gray-400 transition-colors underline decoration-gray-700 underline-offset-2"
              >
                egk07625@gmail.com
              </a>
              <span className="mx-2 text-gray-700">|</span>
              010-7733-9238
            </p>
          </div>

          {/* Right: Legal & Copyright */}
          <div className="flex flex-col md:items-end gap-4">
            <div className="flex gap-6 font-medium text-gray-500">
              <a href="#" className="hover:text-white transition-colors">
                이용약관
              </a>
              <a href="#" className="hover:text-white transition-colors font-bold">
                개인정보처리방침
              </a>
            </div>
            <p className="text-gray-700 font-mono">© 2025 LinkPitch. All rights reserved.</p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

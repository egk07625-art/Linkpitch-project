'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const stats = [
  { value: '300%↑', label: '제안서 읽음률 증가' },
  { value: 'Hot Lead', label: '자동 감지 시스템' },
  { value: '20 mins', label: '평균 제작 시간' },
];

export function SocialProofPricing() {
  return (
    <section className="pt-24 md:pt-32 pb-24 md:pb-32 px-4 md:px-20 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Social Proof Stats */}
        <section className="pt-28 md:pt-32 pb-48 md:pb-64 bg-black border-t border-white/5 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            {/* Headline & Sub-copy */}
            <div className="text-center max-w-4xl mx-auto px-4 md:px-6 mb-24 md:mb-28">
              {/* Line 1 Wrapper */}
              <div className="overflow-hidden mb-3">
                <motion.h2
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black leading-snug bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent pb-1 break-keep"
                >
                  압도적인 시간 단축과
                </motion.h2>
              </div>

              {/* Line 2 Wrapper (Delayed) */}
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black leading-snug bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent pb-1 break-keep"
                >
                  성과를 경험하세요
                </motion.h2>
              </div>

              {/* Sub-copy (Cyan Accent) */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-10 md:mt-12"
              >
                <p className="text-sm sm:text-base md:text-2xl lg:text-3xl text-gray-400 font-medium leading-relaxed break-keep">
                  LinkPitch 도입 전과 후, 당신의<br className="md:hidden" />
                  <span className="relative inline-block ml-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] font-bold">
                      '아웃바운드 효율'
                    </span>
                  </span>
                  은 완전히 달라집니다.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 text-center">
              {/* 1. Growth (Gold) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="relative flex flex-col items-center group"
              >
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB2] via-[#FFC107] to-[#B45309]">
                    300
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB2] via-[#FFC107] to-[#B45309] ml-1">%</span>
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB2] via-[#FFC107] to-[#B45309] ml-1">↑</span>
                </div>
                <span className="mt-4 md:mt-8 text-white/90 font-medium text-sm md:text-2xl drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] break-keep">
                  미팅 성사율 증가
                </span>
                {/* Divider (Right) */}
                <div className="hidden md:block absolute right-[-24px] top-1/4 h-1/2 w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
              </motion.div>

              {/* 2. Speed (Gold) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="relative flex flex-col items-center group"
              >
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB2] via-[#FFC107] to-[#B45309]">
                    0.1
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB2] via-[#FFC107] to-[#B45309] ml-1">s</span>
                </div>
                <span className="mt-4 md:mt-8 text-white/90 font-medium text-sm md:text-2xl drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] break-keep">
                  열람 즉시 실시간 감지
                </span>
                {/* Divider (Right) */}
                <div className="hidden md:block absolute right-[-24px] top-1/4 h-1/2 w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
        </motion.div>

              {/* 3. Efficiency (Gold) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                className="relative flex flex-col items-center group"
              >
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB2] via-[#FFC107] to-[#B45309]">
                    20
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB2] via-[#FFC107] to-[#B45309] ml-1">min</span>
                </div>
                <span className="mt-4 md:mt-8 text-white/90 font-medium text-sm md:text-2xl drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] break-keep">
                  평균 제작 시간 단축
                  </span>
              </motion.div>
                </div>
              </div>
        </section>

        {/* Visual Bridge between Metrics and Bridge Text */}
        <div className="relative w-full h-[600px] flex justify-center items-center overflow-hidden bg-black">
          {/* The Static Line */}
          <div className="w-[1px] h-full bg-white/5 relative">
            {/* The Moving Light (Data Stream) */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-drop-stream" />
                </div>
              </div>

        {/* === THE BRIDGE === */}
        <div className="relative py-32 md:py-40 flex flex-col items-center justify-center bg-black overflow-visible">
          {/* Single Line Impact */}
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center font-black tracking-tighter leading-tight break-keep px-2 md:px-4"
          >
            {/* Mobile: Smaller text, Auto break by word */}
            <span className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-gray-500 mb-2 break-keep">
              성과를 내는 마케터는
            </span>
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-[length:250%_100%] animate-shine drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] pb-2 break-keep">
              도구부터 다릅니다.
            </span>
          </motion.h2>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 md:mt-12 text-sm sm:text-base md:text-2xl font-bold tracking-widest uppercase text-white/90 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] break-keep px-4 md:px-6 text-center"
          >
            이제, 당신이 증명할 차례입니다.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

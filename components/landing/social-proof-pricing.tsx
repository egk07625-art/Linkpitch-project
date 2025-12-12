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
    <section className="pt-20 md:pt-32 pb-20 md:pb-32 px-4 md:px-20 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Social Proof Stats */}
        <section className="pt-32 pb-64 bg-black border-t border-white/5 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            {/* Headline & Sub-copy */}
            <div className="text-center max-w-4xl mx-auto px-6 mb-20">
              {/* Line 1 Wrapper */}
              <div className="overflow-hidden mb-2">
                <motion.h2
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-5xl font-black leading-tight bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent pb-1"
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
                  className="text-4xl md:text-5xl font-black leading-tight bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent pb-1"
                >
                  성과를 경험하세요.
                </motion.h2>
              </div>

              {/* Sub-copy (Gold) */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-6"
              >
                <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed">
                  LinkPitch 도입 전과 후, 당신의<br className="md:hidden" />
                  <span className="relative inline-block ml-1">
                    <span className="bg-gradient-to-b from-[#FDE68A] via-[#D97706] to-[#B45309] bg-clip-text text-transparent font-bold">
                      '아웃바운드 효율'
                    </span>
                  </span>
                  은 완전히 달라집니다.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {/* 1. Growth (Emerald Accent) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="relative flex flex-col items-center group"
              >
                <div className="flex items-baseline justify-center">
                  <span className="text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600">
                    300
                  </span>
                  <span className="text-4xl md:text-5xl text-gray-500 ml-1">%</span>
                  <span className="text-3xl md:text-4xl text-gray-500 ml-1">↑</span>
                </div>
                <span className="mt-4 text-emerald-500/80 font-medium text-lg">
                  미팅 성사율 증가
                </span>
                {/* Divider (Right) */}
                <div className="hidden md:block absolute right-[-24px] top-1/4 h-1/2 w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
              </motion.div>

              {/* 2. Speed (Cyan Accent) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="relative flex flex-col items-center group"
              >
                <div className="flex items-baseline justify-center">
                  <span className="text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600">
                    0.1
                  </span>
                  <span className="text-4xl md:text-5xl text-gray-500 ml-1">s</span>
                </div>
                <span className="mt-4 text-cyan-500/80 font-medium text-lg">
                  열람 즉시 실시간 감지
                </span>
                {/* Divider (Right) */}
                <div className="hidden md:block absolute right-[-24px] top-1/4 h-1/2 w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
              </motion.div>

              {/* 3. Efficiency (Blue Accent) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                className="relative flex flex-col items-center group"
              >
                <div className="flex items-baseline justify-center">
                  <span className="text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600">
                    20
                  </span>
                  <span className="text-4xl md:text-5xl text-gray-500 ml-1">min</span>
                </div>
                <span className="mt-4 text-blue-500/80 font-medium text-lg">
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
        <div className="relative pt-64 pb-32 flex flex-col items-center justify-center bg-black">
          {/* Pure Typography, No Lines */}
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl md:text-4xl font-semibold text-center leading-relaxed tracking-normal text-gray-300 max-w-3xl mx-auto"
          >
            이 모든 성과, <span className="text-white font-medium">당신의 것</span>이 될 수 있습니다.
          </motion.h2>
        </div>
      </div>
    </section>
  );
}

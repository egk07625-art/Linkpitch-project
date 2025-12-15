'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

// Apple-style easing curve
const springEase = 'easeOut' as const;

// Timer Component - Simplified Style
function RedAlertTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2025-12-31T23:59:59').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex gap-2 md:gap-6 bg-white/5 border border-white/10 px-4 md:px-10 py-3 md:py-6 rounded-2xl backdrop-blur-sm">
      {/* Days */}
      <div className="text-center">
        <span className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</span>
        <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 mt-1">DAYS</p>
      </div>
      <span className="text-xl md:text-3xl lg:text-4xl text-gray-600">:</span>
      
      {/* Hours */}
      <div className="text-center">
        <span className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
        <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 mt-1">HOURS</p>
      </div>
      <span className="text-xl md:text-3xl lg:text-4xl text-gray-600">:</span>
      
      {/* Minutes */}
      <div className="text-center">
        <span className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 mt-1">MINS</p>
      </div>
      <span className="text-xl md:text-3xl lg:text-4xl text-gray-600">:</span>
      
      {/* Seconds */}
      <div className="text-center">
        <span className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 mt-1">SECS</p>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-32 pb-40 overflow-hidden bg-[#000000]">
      {/* Animated Background Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-cyan-600/30 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Bottom Fade Out Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center space-y-8 px-4">
          {/* 1. 상단 뱃지: 은은하게 */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: springEase, delay: 0.2 }}
          >
            <div className="inline-block px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-cyan-500/30 bg-cyan-900/20 text-cyan-400 text-sm md:text-base lg:text-lg font-medium mb-2">
              퍼포먼스 마케터 메일 영업 자동화 AI Tool
            </div>
          </motion.div>

          {/* 2. 헤드라인: 폰트 두께 차이로 강조 + 줄간격 확보 */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: springEase, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white break-keep"
          >
            스마트스토어 제안서 작성 <span className="text-cyan-400">20분</span>
            <span className="hidden md:inline"> </span>
            <span className="md:hidden"><br /></span>
            회신율 <span className="text-cyan-400">400%</span>
            <br />
            미팅률 <span className="text-cyan-400">300%</span> 상승
          </motion.h1>

          {/* 3. 본문: 회색조 사용 + 줄간격 넓힘(leading-relaxed) + 단어 끊김 방지(break-keep) */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: springEase, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed break-keep space-y-2"
          >
            <p>
              아직도 매일 스토어명만 수정하는
              <br />
              <span className="text-red-400 font-semibold">'복붙 메일'</span> 수십 통씩 뿌리시나요?
            </p>
            <p className="text-gray-400 text-base md:text-xl lg:text-2xl pt-4">
              지겨운 '단순 반복'의 굴레, 오늘부로 끊어내세요.
              <br />
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">LinkPitch</span>가 당신을{' '}
              <span className="text-red-400 font-semibold">'비효율의 늪'</span>에서
              <br />
              완벽하게 해방시킵니다.
            </p>
          </motion.div>

          {/* 4. 타이머 섹션: 명확한 대비 */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: springEase, delay: 0.7 }}
            className="pt-6"
          >
            <p className="text-red-500 text-sm md:text-base lg:text-lg font-bold tracking-[0.2em] mb-4">LIMITED TIME OFFER</p>
            <RedAlertTimer />
          </motion.div>

          {/* CTA 버튼 */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: springEase, delay: 0.8 }}
            className="pt-4"
          >
            <Link href="#pre-register" className="inline-block">
              <motion.button
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    '0 0 30px rgba(6,182,212,0.4)',
                    '0 0 50px rgba(6,182,212,0.6)',
                    '0 0 30px rgba(6,182,212,0.4)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 60px rgba(6,182,212,0.8)',
                }}
                whileTap={{ scale: 0.95 }}
                className="relative w-auto py-4 md:py-5 px-6 md:px-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base md:text-xl lg:text-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] overflow-hidden"
              >
                {/* Shimmer Effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatDelay: 1,
                  }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
                {/* Button Text */}
                <span className="relative z-10 block break-keep">
                  [ 7일 무제한 이용권 신청 ]
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Mobile Scroll to Top Button - Only on mobile */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-[#2F80ED] to-[#00C6FF] text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </section>
  );
}


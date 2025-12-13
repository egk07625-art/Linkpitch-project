'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

// Apple-style easing curve
const springEase = 'easeOut' as const;

// Scaled-Up Glass Timer Component
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
    <div className="flex flex-col items-center mb-12 mt-12">
      <span className="text-sm md:text-base font-bold text-red-400 tracking-[0.2em] uppercase mb-6 animate-pulse">
        Limited Time Offer
      </span>

      <div className="flex items-center gap-2 md:gap-4 px-4 md:px-10 py-4 md:py-5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* Time Block: Days */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-5xl font-mono font-bold text-white tabular-nums">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-sm font-medium text-gray-500 uppercase mt-1 md:mt-2">Days</span>
        </div>

        <span className="text-xl md:text-4xl text-gray-600 pb-4 md:pb-6">:</span>

        {/* Time Block: Hours */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-5xl font-mono font-bold text-white tabular-nums">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-sm font-medium text-gray-500 uppercase mt-1 md:mt-2">Hours</span>
        </div>

        <span className="text-xl md:text-4xl text-gray-600 pb-4 md:pb-6">:</span>

        {/* Time Block: Mins */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-5xl font-mono font-bold text-white tabular-nums">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-sm font-medium text-gray-500 uppercase mt-1 md:mt-2">Mins</span>
        </div>

        <span className="text-xl md:text-4xl text-gray-600 pb-4 md:pb-6">:</span>

        {/* Time Block: Secs (Red/Urgent Highlight) */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-5xl font-mono font-bold text-red-500 tabular-nums drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-sm font-bold text-red-500/70 uppercase mt-1 md:mt-2">Secs</span>
        </div>
      </div>
    </div>
  );
}

// Counter Component for "300% 상승" - Electric Cyan Gradient
function CountUpCounter({ end, duration = 2.5 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = end;

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000; // seconds
      const progress = Math.min(elapsed / duration, 1);

      // EaseOutCirc easing function
      const easeOutCirc = (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2));
      const easedProgress = easeOutCirc(progress);

      const currentValue = Math.floor(startValue + (endValue - startValue) * easedProgress);
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    const timer = setTimeout(() => {
      animate();
    }, 1000); // Start after 1 second delay

    return () => clearTimeout(timer);
  }, [end, duration]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-600 tabular-nums font-bold">
      {count}%
    </span>
  );
}

export function HeroSection() {
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNew(true);
    }, 1000); // Start transition after 1 second

    return () => clearTimeout(timer);
  }, []);

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

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Eyebrow - First to appear */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: springEase, delay: 0.2 }}
          className="inline-flex mb-8 md:mb-10"
        >
          <div className="rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm text-blue-400 px-6 py-3 text-sm md:text-base font-semibold leading-relaxed break-keep">
            이제 승부처는 '운영'이 아니라 '분석'입니다.
          </div>
        </motion.div>

        {/* Headline - Second to appear */}
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: springEase, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-center mb-8 md:mb-10 px-2 md:px-4 break-keep"
        >
          {/* Line 1: Simple Text */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4 flex-wrap">
            <span className="text-white font-medium">커스텀 제안서 작성</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-600 tabular-nums font-bold">
              20분
            </span>
          </div>

          {/* Line 2: Harmonious Counter */}
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <span className="text-white font-medium">미팅 성사율은</span>
            <CountUpCounter end={300} duration={2.5} />
            <span className="text-white font-medium">상승</span>
          </div>
        </motion.h1>

        {/* Sub-headline - Third to appear */}
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: springEase, delay: 0.6 }}
          className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 md:mb-14 leading-relaxed px-4 md:px-6 break-keep"
        >
          AI 정밀 분석으로 소구점을 찾고, '개인 맞춤 이메일'로 전환합니다.
          <br className="hidden md:block" />
          5시간 걸리던 설득의 과정, 이제 20분이면 충분합니다.
        </motion.p>

        {/* Scaled-Up Glass Timer - Fourth to appear */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: springEase, delay: 0.7 }}
        >
          <RedAlertTimer />
        </motion.div>

        {/* CTA Button - The Star - Fifth to appear */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: springEase, delay: 0.8 }}
          className="mb-16 md:mb-20"
        >
          <CTAButton />
        </motion.div>
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

// Separate CTA Button Component for clean code
function CTAButton() {
  return (
    <Link href="#pre-register" className="inline-block group">
      <motion.div
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative h-auto min-h-[60px] md:h-18 py-4 md:py-0 px-8 md:px-12 rounded-full bg-gradient-to-r from-[#2F80ED] to-[#00C6FF] flex items-center justify-center overflow-hidden cursor-pointer"
          style={{
            boxShadow: '0 0 20px rgba(47, 128, 237, 0.5)',
          }}
        >
          {/* Shimmer Effect */}
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 1,
            }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
          />

          {/* Button Text */}
          <span className="relative z-10 text-white text-base md:text-xl font-bold break-keep leading-snug text-center px-4">
            [ 7일 무제한 이용권 신청 ]
          </span>
        </motion.div>

        {/* Hover Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-full blur-2xl -z-20"
          style={{
            background: 'radial-gradient(circle, rgba(47, 128, 237, 0.8) 0%, transparent 70%)',
          }}
        />
      </motion.div>
    </Link>
  );
}

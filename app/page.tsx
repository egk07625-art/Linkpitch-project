'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppleNavbar } from '@/components/landing/apple-navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { ProblemSection } from '@/components/landing/problem-section';
import { DataStreamGap } from '@/components/landing/data-stream-gap';
import { SolutionBento } from '@/components/landing/solution-bento';
import { SocialProofPricing } from '@/components/landing/social-proof-pricing';
import { PreRegisterForm } from '@/components/landing/pre-register-form';
import { AppleFooter } from '@/components/landing/apple-footer';

export default function LandingPage() {
  const searchParams = useSearchParams();

  // UTM 파라미터 추적
  useEffect(() => {
    // GA4가 로드될 때까지 대기 (최대 3초)
    const checkGtag = () => {
      if (typeof window === 'undefined') return;
      
      // window.gtag 타입 선언
      const gtag = (window as any).gtag;
      if (!gtag) {
        // GA4가 아직 로드되지 않았으면 재시도
        setTimeout(checkGtag, 100);
        return;
      }

      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');
      const utmTerm = searchParams.get('utm_term');
      const utmContent = searchParams.get('utm_content');

      // UTM 파라미터가 있으면 GA4 이벤트로 전송
      if (utmSource || utmMedium || utmCampaign) {
        const utmParams: Record<string, string> = {};
        
        if (utmSource) utmParams.utm_source = utmSource;
        if (utmMedium) utmParams.utm_medium = utmMedium;
        if (utmCampaign) utmParams.utm_campaign = utmCampaign;
        if (utmTerm) utmParams.utm_term = utmTerm;
        if (utmContent) utmParams.utm_content = utmContent;

        // 페이지뷰 이벤트에 UTM 파라미터 포함
        gtag('event', 'page_view', {
          page_path: window.location.pathname + window.location.search,
          page_title: document.title,
          ...utmParams,
        });

        // 추가로 커스텀 이벤트로도 전송 (확실한 추적을 위해)
        gtag('event', 'utm_tracking', {
          event_category: 'marketing',
          ...utmParams,
        });
      }
    };

    // 초기 체크
    checkGtag();
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation */}
      <AppleNavbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Visual Gap (Data Stream Animation) */}
      <DataStreamGap />

      {/* Problem Section */}
      <ProblemSection />

      {/* Visual Gap (Data Stream Animation) */}
      <DataStreamGap />

      {/* Solution Section - Bento Grid */}
      <SolutionBento />

      {/* Visual Gap (Data Stream Animation) */}
      <DataStreamGap />

      {/* Social Proof & Pricing */}
      <SocialProofPricing />

      {/* Visual Gap (Data Stream Animation) */}
      <DataStreamGap />

      {/* Pre-registration Form */}
      <PreRegisterForm />

      {/* Footer */}
      <AppleFooter />
    </div>
  );
}

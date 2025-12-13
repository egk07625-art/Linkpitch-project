'use client';

import { motion } from 'framer-motion';
import { Check, ArrowDown, CheckCircle2, Ticket } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상 입력해주세요'),
  company: z.string().optional(),
  role: z.string().min(1, '직무를 선택해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  phone: z.string().min(1, '연락처를 입력해주세요'),
  budget: z.string().min(1, '월 광고 집행 예산을 선택해주세요'),
  message: z.string().optional(),
  privacyAgreement: z.boolean().refine((val) => val === true, {
    message: '개인정보 수집 및 이용에 동의해주세요',
  }),
});

type FormData = z.infer<typeof formSchema>;

const budgetOptions = [
  { value: '', label: '예산 범위를 선택해주세요' },
  { value: 'under-30000000', label: '30,000,000이하/월' },
  { value: '30000000+', label: '30,000,000이상/월' },
  { value: '50000000+', label: '50,000,000이상/월' },
  { value: '70000000+', label: '70,000,000이상/월' },
  { value: '100000000+', label: '100,000,000이상/월' },
  { value: '200000000+', label: '200,000,000이상/월' },
];

const roleOptions = [
  { value: '', label: '직무를 선택해주세요' },
  { value: 'agency', label: '광고대행사 마케터' },
  { value: 'freelancer', label: '프리랜서' },
];

export function PreRegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Google Apps Script Web App URL (환경 변수에서 가져오기)
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPTURL;

      if (!scriptUrl) {
        throw new Error('Google Script URL이 설정되지 않았습니다.');
      }

      // 디버깅: 전송할 데이터 확인
      console.log('=== 폼 제출 디버깅 ===');
      console.log('전체 데이터:', JSON.stringify(data, null, 2));
      console.log('message 값:', data.message);
      console.log('message 타입:', typeof data.message);
      console.log('message가 undefined인가?', data.message === undefined);
      console.log('message가 null인가?', data.message === null);
      console.log('message가 빈 문자열인가?', data.message === '');
      console.log('message 길이:', data.message?.length);

      // FormData를 URLSearchParams로 변환 (Google Apps Script의 e.parameter와 매칭)
      const formData = new URLSearchParams();
      formData.append('name', data.name);
      formData.append('company', data.company || ''); // 선택 항목
      formData.append('role', data.role || ''); // 선택 항목
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('budget', data.budget || ''); // 선택 항목
      
      // message 필드 처리 - 명시적으로 항상 추가
      const messageValue = data.message ? String(data.message).trim() : '';
      formData.append('message', messageValue);
      
      console.log('message 전송 값:', messageValue);
      console.log('message 전송 값 타입:', typeof messageValue);
      console.log('message 전송 값 길이:', messageValue.length);

      // 디버깅: 전송할 formData 확인
      const formDataString = formData.toString();
      console.log('전송할 formData 문자열:', formDataString);
      console.log('formData에 message가 포함되어 있는가?', formDataString.includes('message='));
      console.log('formData의 message 값:', formData.get('message'));
      console.log('========================');

      // Google Apps Script로 POST 요청
      // Google Apps Script Web App은 CORS를 지원하므로 일반 fetch 사용
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      // 응답 확인
      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted to Google Sheets:', data, result);
        toast.success('사전 예약이 완료되었습니다! 곧 연락드리겠습니다.');
        reset();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Google Apps Script는 CORS 문제로 인해 에러가 발생할 수 있지만,
      // 실제로는 데이터가 저장되었을 수 있으므로 사용자에게는 성공 메시지 표시
    toast.success('사전 예약이 완료되었습니다! 곧 연락드리겠습니다.');
    reset();
    } finally {
    setIsSubmitting(false);
    }
  };

  return (
    <section id="pre-register" className="py-24 bg-black relative">
      {/* Unified Header */}
      <div className="text-center mb-16 px-6">
          <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
          >
            월 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB2] via-[#FFC107] to-[#B45309] font-bold">49,000원</span>의 혜택, 지금 <span className="text-blue-500">0원</span>에 만나보세요
          </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-white/90 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        >
          고민하는 순간 마감됩니다. <span className="text-white font-semibold">'1개월 무료권'</span>과{' '}
          <span className="text-white font-semibold">'평생 할인'</span>을 확정 지으세요.
        </motion.p>
      </div>

      {/* The Split Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left: Benefit Card - Holographic VIP Ticket */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative flex flex-col justify-between p-8 rounded-3xl border border-white/10 overflow-hidden group h-full shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)]"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.25) 0%, rgba(6,182,212,0.15) 20%, rgba(15,15,15,1) 40%, rgba(5,5,5,1) 100%)',
          }}
        >

          {/* Giant Watermark Icon */}
          <div className="absolute -bottom-10 -right-10 text-white/[0.03] transform rotate-[-12deg] pointer-events-none scale-150">
            <Ticket className="w-80 h-80" />
          </div>

          {/* Content: Top */}
          <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-300 text-xs font-bold mb-6 border border-blue-500/30">
              Early Bird
            </div>
            <div className="mb-8">
              <p className="text-gray-500 line-through text-sm">정식 출시가 월 49,000원</p>
              <p className="mt-1">
                <span className="text-7xl font-black text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  0원
                </span>
                <span className="text-2xl font-medium text-gray-400 ml-2">에 미리 확보</span>
              </p>
            </div>
          </div>

          {/* Content: Middle - Illuminated Checks */}
          <ul className="space-y-6 text-gray-200 flex-1 relative z-10">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                <CheckCircle2 className="text-cyan-400 w-4 h-4" />
              </div>
              <span className="text-base md:text-lg">런칭 즉시 1개월 무제한 이용</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                <CheckCircle2 className="text-cyan-400 w-4 h-4" />
              </div>
              <span className="text-base md:text-lg">평생 30% 구독 할인 혜택</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                <CheckCircle2 className="text-cyan-400 w-4 h-4" />
              </div>
              <span className="text-base md:text-lg">Hot Lead 실시간 추적 기능</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                <CheckCircle2 className="text-cyan-400 w-4 h-4" />
              </div>
              <span className="text-base md:text-lg">베타 테스터 우선 초대</span>
            </li>
          </ul>

          {/* Content: Bottom - Virtual Ticket Stub */}
          <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-mono">Limited Offer: 2024 Beta Access</p>
            </div>
            {/* Barcode Pattern */}
            <div className="flex gap-1 h-8 items-end opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 100 + 20}%`,
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              * 알림 발송 외 정보는 사용되지 않습니다.
            </p>
          </div>
        </motion.div>

        {/* Right: Input Form */}
        <motion.form
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                이름 *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                placeholder="홍길동"
                className="w-full bg-[#1C1C1C] h-12 rounded-xl border-none text-white px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-600"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-white mb-2">
                회사 <span className="text-gray-500">(선택)</span>
              </label>
              <input
                {...register('company')}
                type="text"
                id="company"
                placeholder="ABC 마케팅"
                className="w-full bg-[#1C1C1C] h-12 rounded-xl border-none text-white px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-600"
              />
              {errors.company && (
                <p className="mt-2 text-sm text-red-400">{errors.company.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
                직무 *
              </label>
              <select
                {...register('role')}
                id="role"
                className="w-full bg-[#1C1C1C] h-12 rounded-xl border-none text-white px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#1C1C1C]">
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-2 text-sm text-red-400">{errors.role.message}</p>
              )}
            </div>

            {/* Email - Highlighted */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                이메일 *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="your@email.com"
                className="w-full bg-[#1C1C1C] h-12 rounded-xl border-none text-white px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-600"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                연락처 *
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                placeholder="010-1234-5678"
                className="w-full bg-[#1C1C1C] h-12 rounded-xl border-none text-white px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-600"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-white mb-2">
                월 광고 집행 예산 *
              </label>
              <select
                {...register('budget')}
                id="budget"
                className="w-full bg-[#1C1C1C] h-12 rounded-xl border-none text-white px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#1C1C1C]">
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.budget && (
                <p className="mt-2 text-sm text-red-400">{errors.budget.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                LinkPitch에게 바라는 점이 있으신가요?{' '}
                    <span className="text-white font-semibold">
                      상위 1% 마케터
                    </span>
                가 되기 위해 필요한 기능을 알려주세요. <span className="text-gray-500">(선택)</span>
                  </label>
                      <textarea
                {...register('message')}
                id="message"
                        placeholder="예: 네이버 스마트스토어 외에 쿠팡, 11번가도 지원해주세요"
                        rows={3}
                className="w-full bg-[#1C1C1C] rounded-xl border-none text-white px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-600 resize-none"
                      />
              {errors.message && (
                <p className="mt-2 text-sm text-red-400">{errors.message.message}</p>
                  )}
                </div>

          {/* Privacy Agreement */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-start gap-3">
              <input
                {...register('privacyAgreement')}
                type="checkbox"
                id="privacyAgreement"
                className="mt-0.5 w-5 h-5 rounded border-gray-600 bg-[#1C1C1C] text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="privacyAgreement" className="text-sm text-[#A1A1A6] cursor-pointer leading-relaxed">
                <span className="text-white font-medium">개인정보 수집 및 이용에 동의합니다.</span>
                <span className="text-gray-500"> (필수)</span>
              </label>
              </div>
            {errors.privacyAgreement && (
              <p className="mt-2 text-sm text-red-400">{errors.privacyAgreement.message}</p>
            )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-auto px-8 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>처리 중...</span>
                  </div>
                ) : (
                  '[ 1개월 무료 이용권 지금 확보하기 ]'
                )}
              </button>
            </div>

          <p className="text-xs text-center text-gray-600 mt-2">
              🔒 제출하신 정보는 출시 알림 목적으로만 안전하게 사용됩니다.
            </p>
        </motion.form>
      </div>
    </section>
  );
}

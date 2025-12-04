"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProspect } from "@/app/actions/prospects";
import type { Prospect, UpdateProspectInput } from "@/types/prospect";

interface ProspectEditDialogProps {
  prospect: Prospect;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProspectEditDialog({
  prospect,
  open,
  onOpenChange,
}: ProspectEditDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: prospect.name,
    contact_name: prospect.contact_name || "",
    contact_email: prospect.contact_email || "",
    contact_phone: prospect.contact_phone || "",
    url: prospect.url || "",
    memo: prospect.memo || "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: prospect.name,
        contact_name: prospect.contact_name || "",
        contact_email: prospect.contact_email || "",
        contact_phone: prospect.contact_phone || "",
        url: prospect.url || "",
        memo: prospect.memo || "",
      });
    }
  }, [open, prospect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData: UpdateProspectInput = {
        name: formData.name,
        contact_name: formData.contact_name || undefined,
        contact_email: formData.contact_email || undefined,
        contact_phone: formData.contact_phone || undefined,
        url: formData.url || undefined,
        memo: formData.memo || undefined,
      };

      await updateProspect(prospect.id, updateData);
      toast.success("고객사 정보가 업데이트되었습니다.");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Prospect 업데이트 실패:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "고객사 정보 업데이트에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#161618] border border-[#333] rounded-2xl p-8 shadow-2xl mx-4">
        {/* Header */}
        <h2 className="text-2xl font-bold text-white mb-1">고객사 정보 수정</h2>
        <p className="text-gray-400 text-sm mb-6">고객사 정보를 수정할 수 있습니다.</p>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 회사명 */}
          <div>
            <label htmlFor="edit-name" className="block text-sm font-semibold text-gray-400 mb-1">
              회사명 <span className="text-red-400">*</span>
            </label>
            <input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="예: 올리브영"
              className="w-full h-12 bg-[#1C1C1E] border border-[#333] rounded-lg px-3 text-white text-[15px] focus:border-white/50 focus:outline-none transition-colors placeholder:text-zinc-600"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* 담당자 이름 */}
          <div>
            <label htmlFor="edit-contact-name" className="block text-sm font-semibold text-gray-400 mb-1">
              담당자 이름
            </label>
            <input
              id="edit-contact-name"
              value={formData.contact_name}
              onChange={(e) =>
                setFormData({ ...formData, contact_name: e.target.value })
              }
              placeholder="예: 홍길동"
              className="w-full h-12 bg-[#1C1C1E] border border-[#333] rounded-lg px-3 text-white text-[15px] focus:border-white/50 focus:outline-none transition-colors placeholder:text-zinc-600"
              disabled={isSubmitting}
            />
          </div>

          {/* 담당자 이메일 */}
          <div>
            <label htmlFor="edit-contact-email" className="block text-sm font-semibold text-gray-400 mb-1">
              담당자 이메일
            </label>
            <input
              id="edit-contact-email"
              type="email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
              placeholder="예: contact@example.com"
              className="w-full h-12 bg-[#1C1C1E] border border-[#333] rounded-lg px-3 text-white text-[15px] focus:border-white/50 focus:outline-none transition-colors placeholder:text-zinc-600"
              disabled={isSubmitting}
            />
          </div>

          {/* 담당자 연락처 */}
          <div>
            <label htmlFor="edit-contact-phone" className="block text-sm font-semibold text-gray-400 mb-1">
              담당자 연락처
            </label>
            <input
              id="edit-contact-phone"
              type="tel"
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
              placeholder="예: 010-1234-5678"
              className="w-full h-12 bg-[#1C1C1E] border border-[#333] rounded-lg px-3 text-white text-[15px] focus:border-white/50 focus:outline-none transition-colors placeholder:text-zinc-600"
              disabled={isSubmitting}
            />
          </div>

          {/* 타겟 URL */}
          <div>
            <label htmlFor="edit-url" className="block text-sm font-semibold text-gray-400 mb-1">
              타겟 URL
            </label>
            <input
              id="edit-url"
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="예: https://store.example.com"
              className="w-full h-12 bg-[#1C1C1E] border border-[#333] rounded-lg px-3 text-white text-[15px] focus:border-white/50 focus:outline-none transition-colors placeholder:text-zinc-600"
              disabled={isSubmitting}
            />
          </div>

          {/* 메모 */}
          <div>
            <label htmlFor="edit-memo" className="block text-sm font-semibold text-gray-400 mb-1">
              메모
            </label>
            <textarea
              id="edit-memo"
              value={formData.memo}
              onChange={(e) =>
                setFormData({ ...formData, memo: e.target.value })
              }
              placeholder="추가 정보를 입력하세요"
              rows={4}
              className="w-full h-auto min-h-[96px] bg-[#1C1C1E] border border-[#333] rounded-lg px-3 py-3 text-white text-[15px] focus:border-white/50 focus:outline-none transition-colors placeholder:text-zinc-600 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-5 h-11 text-gray-400 hover:text-white font-medium transition-colors"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-6 h-11 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


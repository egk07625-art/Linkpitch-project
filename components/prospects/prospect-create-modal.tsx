"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createProspect } from "@/app/actions/prospects";

const prospectSchema = z.object({
  name: z.string().min(1, "회사명을 입력해주세요"),
  contact_name: z.string().optional(),
  contact_email: z.string().email("올바른 이메일을 입력해주세요"),
  contact_phone: z.string().optional(),
  url: z.string().url("올바른 URL을 입력해주세요"),
  memo: z.string().optional(),
});

type ProspectFormData = z.infer<typeof prospectSchema>;

interface ProspectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProspectCreateModal({
  open,
  onOpenChange,
}: ProspectCreateModalProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProspectFormData>({
    resolver: zodResolver(prospectSchema),
    defaultValues: {
      name: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      url: "",
      memo: "",
    },
  });

  const onSubmit = async (data: ProspectFormData) => {
    try {
      console.log("[ProspectCreateModal] 폼 제출 시작:", data);

      const prospect = await createProspect({
        name: data.name,
        contact_name: data.contact_name || undefined,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || undefined,
        url: data.url,
        memo: data.memo || undefined,
      });

      console.log("[ProspectCreateModal] 고객사 등록 성공:", prospect.id);

      toast.success("고객사가 등록되었습니다.");
      reset();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("[ProspectCreateModal] 고객사 등록 실패:", {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      toast.error(
        error instanceof Error
          ? error.message
          : "고객사 등록에 실패했습니다."
      );
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#161618] border border-[#333] rounded-2xl shadow-2xl overflow-hidden p-0 max-w-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
        {/* 헤더 */}
        <DialogHeader className="px-6 py-5 border-b border-[#2C2C2E] bg-[#1C1C1E]">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                고객사 등록
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-1">
                새로운 잠재 고객 정보를 입력해주세요.
              </DialogDescription>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-zinc-500 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* 입력 폼 (Body) */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-5">
            {/* 회사명 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 ml-1">
                회사명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="예: 쿠팡, 올리브영"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#252528] border border-[#333] rounded-xl px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
              />
              {errors.name && (
                <p className="text-xs text-red-400 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* 담당자 & 연락처 (2열 배치) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 ml-1">
                  담당자 이름
                </label>
                <input
                  type="text"
                  {...register("contact_name")}
                  placeholder="예: 홍길동"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#252528] border border-[#333] rounded-xl px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 ml-1">
                  연락처
                </label>
                <input
                  type="text"
                  {...register("contact_phone")}
                  placeholder="010-0000-0000"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#252528] border border-[#333] rounded-xl px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 ml-1">
                담당자 이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("contact_email")}
                placeholder="contact@company.com"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#252528] border border-[#333] rounded-xl px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
              />
              {errors.contact_email && (
                <p className="text-xs text-red-400 ml-1">
                  {errors.contact_email.message}
                </p>
              )}
            </div>

            {/* 타겟 URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 ml-1">
                타겟 URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("url")}
                placeholder="https://..."
                disabled={isSubmitting}
                className="w-full h-11 bg-[#252528] border border-[#333] rounded-xl px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
              />
              {errors.url && (
                <p className="text-xs text-red-400 ml-1">
                  {errors.url.message}
                </p>
              )}
            </div>

            {/* 메모 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 ml-1">
                메모
              </label>
              <textarea
                rows={3}
                {...register("memo")}
                placeholder="특이사항을 입력하세요"
                disabled={isSubmitting}
                className="w-full bg-[#252528] border border-[#333] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* 푸터 (Buttons) */}
          <div className="px-6 py-4 bg-[#1C1C1E] border-t border-[#2C2C2E] flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-[#2C2C2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "등록 중..." : "등록하기"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


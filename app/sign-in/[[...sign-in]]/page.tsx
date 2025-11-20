/**
 * @file app/sign-in/[[...sign-in]]/page.tsx
 * @description Clerk 로그인 페이지
 *
 * Clerk의 SignIn 컴포넌트를 사용하여 로그인 페이지를 제공합니다.
 * [[...sign-in]] 동적 라우팅을 사용하여 Clerk의 모든 인증 경로를 처리합니다.
 */

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <SignIn
        appearance={{
          layout: {
            logoPlacement: "inside",
            socialButtonsPlacement: "bottom",
            socialButtonsVariant: "iconButton",
          },
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-lg",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-gray-600",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
          },
          variables: {
            colorPrimary: "#6366f1",
          },
        }}
      />
    </div>
  );
}




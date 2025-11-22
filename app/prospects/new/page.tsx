'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testN8nConnection } from '@/app/actions/analyze-url';

/**
 * @file app/prospects/new/page.tsx
 * @description n8n 연결 테스트 페이지 (임시)
 */

export default function TestN8nPage() {
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('[TestN8nPage] n8n 연결 테스트 시작');
      const response = await testN8nConnection({
        message: 'n8n 연결 테스트',
      });
      setResult(response);
      console.log('[TestN8nPage] n8n 연결 테스트 성공:', response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('[TestN8nPage] n8n 연결 테스트 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">n8n 연결 테스트</h1>
          <p className="text-muted-foreground">
            n8n 웹훅 연결을 테스트합니다.
          </p>
        </div>

        <div>
          <Button
            onClick={handleTest}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? '테스트 중...' : '[n8n 연결 테스트]'}
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <h2 className="text-lg font-semibold text-destructive mb-2">
              에러 발생
            </h2>
            <pre className="text-sm text-destructive whitespace-pre-wrap break-words">
              {error}
            </pre>
          </div>
        )}

        {result && (
          <div className="rounded-lg border bg-card p-4">
            <h2 className="text-lg font-semibold mb-2">응답 결과</h2>
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-[600px]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}


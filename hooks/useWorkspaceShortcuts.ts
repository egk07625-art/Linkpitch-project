import { useEffect } from 'react';

interface UseWorkspaceShortcutsProps {
  onStepChange: (step: number) => void;
  onTabToggle: () => void;
  onSave: () => void;
  stepsWithData?: number[];
}

export function useWorkspaceShortcuts({
  onStepChange,
  onTabToggle,
  onSave,
  stepsWithData = [1, 2, 3],
}: UseWorkspaceShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 단축키 비활성화
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Ctrl+S는 입력 필드에서도 동작
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          onSave();
        }
        return;
      }

      // Ctrl/Cmd + 숫자키로 Step 전환
      if ((e.ctrlKey || e.metaKey) && ['1', '2', '3'].includes(e.key)) {
        const stepNumber = parseInt(e.key);
        if (stepsWithData.includes(stepNumber)) {
          e.preventDefault();
          onStepChange(stepNumber);
        }
      }

      // Ctrl/Cmd + E로 이메일/리포트 토글
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        onTabToggle();
      }

      // Ctrl/Cmd + S로 저장
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStepChange, onTabToggle, onSave, stepsWithData]);
}

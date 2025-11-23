export const SCENARIO_STEPS = [
  {
    step: 1,
    title: "관심 끌기",
    subtitle: "Hook",
    mentor: {
      question: "왜 회사 소개서를 첨부하면 안 될까요?",
      trap: "보통은 한 통의 메일에 회사 자랑과 제안서를 꽉 채워 보냅니다. 고객은 이를 '스팸'이라 부릅니다.",
      strategy: "우리는 9번에 걸쳐 신뢰를 쌓습니다. 이번 단계의 목표는 오직 '답장'이 아니라 '클릭'입니다."
    }
  },
  {
    step: 2,
    title: "문제 인식",
    subtitle: "Problem",
    mentor: {
      question: "고객이 가진 가장 큰 고통은 무엇인가요?",
      trap: "내 솔루션이 얼마나 뛰어난지만 설명하려 합니다.",
      strategy: "고객의 상황을 내가 더 잘 알고 있다는 것을 보여주어 공감대를 형성하세요."
    }
  },
  {
    step: 3,
    title: "가치 제안",
    subtitle: "Value",
    mentor: {
      question: "고객이 정말 원하는 것은 무엇인가요?",
      trap: "기능 나열에만 집중하여 고객이 얻을 결과를 말하지 않습니다.",
      strategy: "고객이 우리 솔루션으로 달성할 구체적인 성과를 명확히 제시하세요."
    }
  },
  {
    step: 4,
    title: "증거 제시",
    subtitle: "Proof",
    mentor: {
      question: "왜 고객은 우리를 믿어야 할까요?",
      trap: "추상적인 약속만 하고 구체적인 증거를 제시하지 않습니다.",
      strategy: "데이터, 사례, 고객 후기 등 검증 가능한 증거로 신뢰를 구축하세요."
    }
  },
  {
    step: 5,
    title: "신뢰 구축",
    subtitle: "Trust",
    mentor: {
      question: "고객이 우리를 선택해야 하는 이유는?",
      trap: "경쟁사와의 차별점을 명확히 설명하지 못합니다.",
      strategy: "우리만의 독특한 강점과 고객 성공 스토리를 공유하세요."
    }
  },
  {
    step: 6,
    title: "반론 처리",
    subtitle: "Objection",
    mentor: {
      question: "고객이 거절할 이유는 무엇인가요?",
      trap: "고객의 우려사항을 무시하거나 회피합니다.",
      strategy: "예상되는 반론을 선제적으로 다루고 명확한 해결책을 제시하세요."
    }
  },
  {
    step: 7,
    title: "긴급성",
    subtitle: "Urgency",
    mentor: {
      question: "왜 지금 결정해야 할까요?",
      trap: "막연한 압박감만 주고 구체적인 이유를 제시하지 않습니다.",
      strategy: "시장 변화, 기회 비용 등 지금 행동해야 하는 명확한 이유를 제공하세요."
    }
  },
  {
    step: 8,
    title: "행동 유도",
    subtitle: "CTA",
    mentor: {
      question: "고객이 다음에 무엇을 해야 하나요?",
      trap: "여러 선택지를 주어 고객을 혼란스럽게 만듭니다.",
      strategy: "단 하나의 명확하고 간단한 다음 단계를 제시하세요."
    }
  },
  {
    step: 9,
    title: "마지막 기회",
    subtitle: "Last Call",
    mentor: {
      question: "고객이 놓치면 후회할 것은?",
      trap: "단순히 '연락 주세요'로 끝냅니다.",
      strategy: "고객이 행동하지 않았을 때의 기회비용을 상기시키고 마지막 동기부여를 제공하세요."
    }
  }
] as const;

export type ScenarioStep = typeof SCENARIO_STEPS[number];

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
  }
] as const;

export type ScenarioStep = typeof SCENARIO_STEPS[number];

graph TD
    Start([사용자 방문]) --> Landing[랜딩 페이지<br/>/]
    
    Landing --> CheckAuth{로그인<br/>상태?}
    CheckAuth -->|No| SignIn[로그인/회원가입<br/>Clerk Auth]
    CheckAuth -->|Yes| Dashboard
    SignIn --> Dashboard
    
    Dashboard[대시보드<br/>/app] --> DashActions{액션 선택}
    
    DashActions --> CreateFlow[새 메일 생성]
    DashActions --> ViewSeq[시퀀스 관리]
    DashActions --> ViewSent[보낸 메일]
    DashActions --> TodayMail[오늘 보낼 메일]
    
    %% 생성 플로우
    CreateFlow --> InputProspect[Prospect 정보 입력<br/>/app/create]
    InputProspect --> InputDetails[브랜드명, URL<br/>담당자, 시퀀스 타입]
    InputDetails --> CallAPI[API 호출<br/>/api/generate-step]
    CallAPI --> N8N[n8n Webhook]
    N8N --> OpenAI[OpenAI GPT]
    OpenAI --> GenerateResult[인사이트 + 이메일 생성]
    GenerateResult --> SaveDB[(Supabase 저장)]
    SaveDB --> SaveProspect[prospects 테이블]
    SaveDB --> SaveSeq[sequences 테이블]
    SaveDB --> SaveStep[steps 테이블]
    SaveDB --> SaveLog[generation_logs 테이블]
    SaveStep --> ShowResult[결과 화면]
    ShowResult --> CopyEmail[이메일 복사]
    CopyEmail --> SendManual[외부에서<br/>실제 발송]
    
    %% 시퀀스 관리
    ViewSeq --> SeqList[시퀀스 리스트<br/>/app/sequences]
    SeqList --> SelectSeq{시퀀스 선택}
    SelectSeq --> SeqDetail[타겟 상세<br/>/app/sequences/id]
    SeqDetail --> ViewSteps[Step 히스토리]
    ViewSteps --> UpdateStatus[상태 업데이트<br/>읽음/회신]
    UpdateStatus --> RecordSent[수동 발송 기록]
    RecordSent --> UpdateStep[(steps 업데이트)]
    
    %% 보낸 메일
    ViewSent --> SentList[보낸 메일 목록<br/>/app/sent]
    SentList --> ViewSentDetail[Step별 상세]
    ViewSentDetail --> CheckStatus[읽음/회신 확인]
    CheckStatus --> ViewReport{리포트<br/>링크 클릭?}
    
    %% 리포트 플로우
    SendManual --> RecipientView[수신자가 이메일 확인]
    RecipientView --> ClickReport{리포트<br/>링크 클릭?}
    ClickReport -->|Yes| ReportPage[리포트 페이지<br/>/r/reportId]
    ViewReport -->|Yes| ReportPage
    ReportPage --> TrackEvents[행동 추적]
    TrackEvents --> LogView[view 이벤트]
    TrackEvents --> LogDwell[dwell_time 기록]
    TrackEvents --> LogScroll[scroll_depth 기록]
    TrackEvents --> LogInteract[interaction 기록]
    LogView --> SaveEvents[(report_events 저장)]
    LogDwell --> SaveEvents
    LogScroll --> SaveEvents
    LogInteract --> SaveEvents
    SaveEvents --> CalcEngage[관여도 계산<br/>cold/warm/hot]
    CalcEngage --> UpdateEngage[(steps 업데이트<br/>engagement_level)]
    
    %% 오늘 보낼 메일
    TodayMail --> CheckRecommended[recommended_send_at<br/>확인]
    CheckRecommended --> TodayList[오늘 발송 예정<br/>Step 리스트]
    TodayList --> SelectStep[Step 선택]
    SelectStep --> RecordSent
    
    %% 대시보드로 복귀
    UpdateEngage --> Dashboard
    UpdateStep --> Dashboard
    ShowResult --> Dashboard
    CheckStatus --> Dashboard
    ClickReport -->|No| RecipientEnd([수신자 종료])
    
    style Start fill:#e1f5ff
    style Dashboard fill:#fff4e1
    style GenerateResult fill:#e7f5e1
    style ReportPage fill:#ffe1f5
    style SaveDB fill:#f0f0f0
    style SaveEvents fill:#f0f0f0
# LinkPitch MVP v3: Vision AI & Insight Mixer UI/UX Implementation Plan

## 1. Project Overview
This document outlines the UI/UX implementation strategy for **LinkPitch v3**, a SaaS tool for performance marketers.
The goal is to implement a **"Linear-style" Professional Dark Mode** interface within the existing Next.js + Supabase boilerplate.

**Key Tech Stack:**
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- UI Library: Shadcn/UI (Radix Primitives)
- Animation: Framer Motion
- Database: Supabase
- Icons: Lucide React

---

## 2. Design System (Global)

### 2.1 Color Palette & Theme
- **Base Theme:** Dark Mode (Zinc-950 background).
- **Primary Brand:** Indigo-500 (`#6366f1`) - Used for primary buttons and active states.
- **Action/Hot:** Rose-500 (`#f43f5e`) - Used for "Hot Leads" and critical alerts.
- **Surface:** Zinc-900 with Zinc-800 borders (Subtle contrast).
- **Glassmorphism:** Used for AI Analysis cards (Left panel of Insight Mixer).

### 2.2 Typography
- **Font:** `Pretendard` (Korean optimized) + `Inter` or `Geist Sans` (English).
- **Scale:** Compact and information-dense (SaaS style).

### 2.3 Installation Tasks
1.  Ensure `shadcn-ui` is initialized.
2.  Install `framer-motion` for the Vision AI loading sequences.
3.  Update `tailwind.config.ts` to include custom brand colors if necessary.

---

## 3. Component Architecture & Page Structure

Map the new features to the existing `app` directory structure.

### 3.1 Dashboard (`app/dashboard/page.tsx`)
**Objective:** High-density view of today's tasks and hot leads.
- **Layout:** List view (not Kanban).
- **Components:**
    - `LeadStatusBadge`: Dynamic badge changing color based on CRM status (Cold=Gray, Warm=Orange, Hot=Rose/Pulse).
    - `DailyTaskList`: List of steps ready to be sent.
    - `QuickAddInput`: Simple input to add a URL immediately.

### 3.2 Prospect Analysis (`app/prospects/new/page.tsx` or Modal)
**Objective:** Handle the Vision AI analysis delay (5-10s) with an engaging UX.
- **Component: `AnalysisTerminal`**
    - **Style:** Terminal/Code-block aesthetic.
    - **Animation:** Typewriter effect using Framer Motion.
    - **Logs sequence:**
        1.  `> Connecting to ScreenshotOne...`
        2.  `> Capturing full-page screenshot (3000px height)...`
        3.  `> Sending to Gemini 3.0 Pro...`
        4.  `> Extracting USP & Mood...`
        5.  `> Done.`

### 3.3 Insight Mixer (`app/prospects/[id]/mix/page.tsx`) **[CORE FEATURE]**
**Objective:** Split view for "AI Fact Checking" + "Marketer Strategy".
- **Layout:** Resizable Two-Column Layout (Left: 40%, Right: 60%).
- **Left Panel (The Eye): `VisionFactCard`**
    - Read-only, Glassmorphism style.
    - Displays extracted JSON data (Price, USP, Mood, Review Summary).
    - Includes the captured screenshot thumbnail.
- **Right Panel (The Brain): `StrategyEditor`**
    - **Editor:** Text area for composing the prompt/email.
    - **Tray:** Bottom sticky bar containing draggable `StrategyChip` components.
    - **Chips:** `Short-form Proposal`, `Price Comparison`, `UX Improvement`.
    - **Action:** "Generate Magic Mail" button (Gradient background).

### 3.4 Customer Report (`app/r/[id]/page.tsx`)
**Objective:** Mobile-first view for the end-client (Prospect).
- **Style:** Mobile card-news style. Clean, large text, clear CTA.
- **Tracking:** Invisible hook to trigger `view`, `scroll`, `dwell` events to Supabase.

---

## 4. Data Model Updates (`types/`)

Update existing type definitions to support Vision AI data.

### `types/prospect.ts`
Add a new interface for Vision Analysis results.
```typescript
export interface VisionAnalysis {
  visual_usp: string[];
  mood: string;
  price_offer: string;
  review_evidence: string;
  screenshot_url: string;
}

// Update Prospect interface
export interface Prospect {
  // ... existing fields
  vision_data?: VisionAnalysis; // JSONB in Supabase
  crm_status: 'cold' | 'warm' | 'hot';
}

## 5. Implementation Steps (Cursor Prompt Guide)

Use these prompts sequentially to build the UI.

### Phase 1: Setup & Dashboard
1.  "Setup the global dark theme using Zinc-950 bg and Zinc-900 cards. Configure Tailwind colors for Indigo (Brand) and Rose (Action)."
2.  "Create `LeadStatusBadge` component using Shadcn Badge. It should handle 'cold', 'warm', and 'hot' states. Add a pulse animation for 'hot'."
3.  "Refactor `app/dashboard/page.tsx` to show a high-density list of prospects using the new design system."

### Phase 2: Vision AI Loading (The Hook)
1.  "Create a component `AnalysisTerminal` using Framer Motion. It should take an array of log strings and display them with a typewriter effect one by one."
2.  "Implement the 'Add Prospect' flow. When a URL is submitted, show the `AnalysisTerminal` while waiting for the (mock) API response."

### Phase 3: Insight Mixer (The Core)
1.  "Create the layout for `app/prospects/[id]/mix/page.tsx`. Use a split-view: Left for AI Data, Right for User Input."
2.  "Build the `VisionFactCard` for the left panel. It should display JSON data clearly with icons (Lucide React)."
3.  "Build the `StrategyEditor` for the right panel. Include a bottom tray with clickable `StrategyChip` components. When a chip is clicked, append its text to the editor."

### Phase 4: Report Page
1.  "Create a mobile-first layout for `app/r/[id]/page.tsx`. It needs a sticky CTA button at the bottom."
2.  "Implement a custom hook `useReportTracking` in `hooks/use-report-tracking.ts`. It should detect 'page view' on mount and 'scroll depth' > 60%. Send these events to the Supabase `report_events` table via Server Actions."
3.  "Ensure the Report Page looks professional even on mobile. Use a clean typography scale (Tailwind `prose` plugin or standard text classes)."

### Phase 5: Mail Sending & Logging (The Action)
1.  "In the `StrategyEditor` (Right Panel), add a 'Copy & Log' button in the header."
2.  "When clicked, it should copy the generated email content to the clipboard and open a Shadcn Dialog."
3.  "The Dialog asks: 'Did you send this email via Gmail?'. If confirmed, update the `steps` table in Supabase marking it as 'sent' with the current timestamp."

---

## 6. Design Philosophy Summary
- **Keep it Dark:** Maintain the professional dark mode aesthetic (`Zinc-950`).
- **Keep it Fast:** Use `Skeleton` loaders for all data fetching states.
- **Keep it Engaging:** Use animations (`Framer Motion`) specifically for the Vision AI analysis parts to reduce perceived latency.
- **Mobile First for Reports:** The end-customer view (`/r/[id]`) must be perfect on mobile devices.
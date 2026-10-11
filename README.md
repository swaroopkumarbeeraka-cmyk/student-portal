# Autonomous Student Portal Prototype

A live, fully interactive college Student Portal prototype engineered with React, TypeScript, Vite, Tailwind CSS, React Router, Recharts, and Lucide icons.

## Technology Stack

- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS with custom design tokens (light/dark palette, 8px grid, 6px radius, deep teal focus rings)
- **Routing**: React Router DOM v6
- **Data Visualization**: Recharts (Monthly attendance threshold charts, examination progress)
- **Icons**: Lucide React
- **State & Persistence**: Typed Service & Context Layer (`PortalContext`, `localStorage` persistence, zero data loss on refresh)

---

## Design System Specifications

| Token | Light Theme | Dark Theme |
|---|---|---|
| Background | `#F6F4EF` | `#151918` |
| Surface | `#FFFFFF` | `#1C2120` |
| Text | `#1F2523` | `#E8E6E1` |
| Muted | `#6B716E` | `#9AA09C` |
| Border | `#E2DED5` | `#2C3331` |
| Primary Accent | `#0F5C5A` (Deep Teal) | `#4FB3AE` (Soft Teal) |
| Semantic | Green `#2E7D4F` • Amber `#B7791F` • Red `#B42318` | Same semantics |

---

## Demo Credentials & Initial State

- **Student**: Aarav Kumar
- **Roll Number**: `26A91A0501`
- **Student Code**: `STU-20260501`
- **Demo Security PIN**: `2026`
- **Program**: B.Tech Computer Science & Engineering (Artificial Intelligence), Year 1 Semester 2, Section A
- **Attendance**: 168 / 210 working days = 80.0% (Cutoff: 75%). Safe leave buffer = 14 days (computed via `floor(P / T - W)`).
- **Academics**: CGPA 8.2 / 10.0. Latest: Mid-1 (42/50 avg, Rank 4 in Section).
- **Fees**: Total ₹1,20,000, Paid ₹80,000, Outstanding ₹40,000 (Term 2 due 15 Nov 2026).

---

## Running the Application Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## Switching Between Mock Data and Real Backend API

The application includes an environment-driven service layer (`src/services/api.ts` and `src/services/dataService.ts`) designed to transition seamlessly between standalone mock mode and live backend APIs.

### Configuration via `.env`

Create or edit `.env` (a `.env.example` template is provided):

```env
VITE_API_URL=https://api.college.example
VITE_USE_MOCK=true
```

| Variable | Description | Default |
|---|---|---|
| `VITE_USE_MOCK` | Set to `true` to use client-side typed mock data. Set to `false` to route calls through `apiFetch` to the backend. | `true` |
| `VITE_API_URL` | Base URL of the backend API (e.g., `https://api.college.edu` or `http://localhost:8000`). | `""` (relative) |

- **Standalone Mock Mode (`VITE_USE_MOCK=true`)**:
  All service queries resolve using typed datasets (`src/data/mockData.ts`), seeded into client state and persisted across sessions in `localStorage`.
- **Production Backend Mode (`VITE_USE_MOCK=false`)**:
  All data requests route through `apiFetch<T>` to `${VITE_API_URL}/api/...`. The fetch wrapper automatically attaches `Authorization: Bearer <token>` from session storage, handles JSON responses, and normalizes network error codes.

---

## What is Simulated vs What Plugs into Real Backend

| Feature | Current Prototype (Client-Side Simulation) | Real Production Backend Replacement |
|---|---|---|
| **Authentication** | Student code + 4-digit PIN stored in session & `localStorage`, simulated OTP (`4921`) for PIN reset. | OAuth2 / SAML / Institutional SSO, JWT with HTTP-only cookies, SMS/Email OTP gateway (e.g. Twilio / AWS SNS). |
| **Payment Gateway** | Sandbox state machine with simulated ICICI Bank redirect, callback outcome buttons ("Simulate Success", "Failure", "Pending"), unique transaction & receipt generation. Balances change ONLY upon verified success. | ICICI / Razorpay / BillDesk server-side order creation (`POST /api/v1/payments/create-order`), webhook signature verification (`HMAC-SHA256`), database ledger reconciliation. |
| **Campus AI Assistant** | Grounded rule-based semantic matcher over logged-in student's records & official college circulars. Enforces privacy boundary (refuses queries for other students). | Fast-API / Node.js RAG backend with Gemini / Claude embeddings, vector database (Pinecone / PgVector), student identity scope filters in system prompt. |
| **Document Storage** | Sample files and downloadable mock PDFs. Shows clear note when physical copies are in Central Library. | Amazon S3 / Google Cloud Storage signed URLs with institutional IAM access controls. |
| **Institutional Pages** | Departments, Placement statistics, Facility timings use honest placeholders ("Information will appear here when published"). | CMS or ERP database tables managed by respective department HODs and administrative deans. |

---

## Comprehensive Page & Click-Path Verification Checklist

- [x] **Header & Navigation Shell**:
  - [x] Student chip shows Aarav Kumar, CSE (AI) - Section A, STU-20260501.
  - [x] Academic Year selector switches between `2026-27` (Current) and `2025-26` (Archive). In `2025-26`, read-only archive banner appears and payment actions are disabled.
  - [x] Working global search input navigates to `/search?q=...` with results across pages, notices, documents, and subjects.
  - [x] Notifications bell with unread dot, dropdown list, "Mark all as read", and navigation to target detail.
  - [x] Theme switcher cycles Light (`#F6F4EF`), Dark (`#151918`), and System.
  - [x] Account dropdown with profile link, settings link, and sign-out confirmation modal.
- [x] **Dashboard (`/`)**:
  - [x] Pending action banner for Self-Declaration (disappears immediately after submission).
  - [x] 3 summary cards (Attendance, Academics, Fees) linked to detail pages.
  - [x] Today's schedule with live status (`Done`, `Now`, `Next`, `Upcoming`).
  - [x] 6 quick actions (Attendance, Results, Timetable, Pay Fees, Notices, AI Assistant).
  - [x] Next exam countdown card with eligibility status.
  - [x] Compact Suggestions & Complaints widget with New / History tabs.
- [x] **Attendance (`/attendance`)**:
  - [x] Aggregate percentage (80%), present (168), working (210), absent (42).
  - [x] Max additional absences computed via `floor(P/T - W) = 14` with stated assumption.
  - [x] Interactive Recharts bar chart with dashed 75% threshold line. Clicking a month updates daily absence log.
- [x] **Academics (`/academics`)**:
  - [x] CGPA (8.2), latest exam, best exam.
  - [x] Interactive exam performance bar chart. Clicking an exam updates subject-wise marks table with performance bars and lowest subject highlight.
  - [x] CGPA vs Percentage vs Marks educational primer.
- [x] **Competitive Exams (`/competitive-exams`)**:
  - [x] Interactive toggle between empty state and populated state (TCS CodeVita, NPTEL).
- [x] **Fees & Payments (`/fees`)**:
  - [x] Summary: Total ₹1,20,000, Paid ₹80,000, Outstanding ₹40,000 (66% paid).
  - [x] Category breakdown table & Term schedule table.
  - [x] "Pay Now" triggers sandbox payment modal (Review -> Method selection -> Simulated ICICI page -> Verification -> Success).
  - [x] Balances update only upon verified success.
  - [x] Official printable receipt with `window.print` styles.
- [x] **Profile (`/profile`)**:
  - [x] Identity information, copy student code button with toast notification.
  - [x] Masked contact particulars (+91 98XXXXX210).
  - [x] Working Change PIN modal with validation.
- [x] **Settings (`/settings`)**:
  - [x] Appearance (Light / Dark / System).
  - [x] Accessibility (Text size Normal/Large/Extra-Large dynamically scales root font size, Reduced Motion toggle).
  - [x] Notification preference toggles (actually filter notifications).
  - [x] "Reset demo data" button (wipes local storage and restores pristine initial state).
  - [x] "Demo controls" panel (force low attendance <75%, toggle fee overdue/paid, toggle competitive exams).
- [x] **Self-Declaration Form (`/declaration`)**:
  - [x] 4 mandatory undertakings with checkboxes and emergency contact inputs.
  - [x] Submitting persists status, removes dashboard banner, creates notification.
- [x] **Suggestions & Complaints (`/student-corner/complaints`)**:
  - [x] New ticket form with real-time 500-char counter and validation.
  - [x] History tab with status audit trail modal (Submitted -> Under Review -> In Progress -> Resolved).
- [x] **Study Planner (`/planner`)**:
  - [x] Personal tasks CRUD (add, toggle, edit, delete with confirm modal, filter, sort, completion progress bar).
  - [x] Official assignments (read-only from faculty).
  - [x] Day & Week timetable view toggle.
  - [x] Academic calendar month view.
- [x] **Notices (`/notices` & `/notices/:id`)**:
  - [x] 8 detailed notices with search, category filtering, pagination.
  - [x] Notice detail view with sample download and "Ask AI about this notice" button.
- [x] **Departments (`/departments`)**:
  - [x] Mega-directory for Civil, CSE (AI, AIML, DS), AIML, ECE, EEE, IT, Mechanical, BS&H, MCA.
  - [x] Department detail pages with honest placeholders for faculty and timings.
- [x] **Examination Section (`/examination`)**:
  - [x] Cell profile, staff, notifications, timetables, question papers archive, malpractice guidelines.
  - [x] Application forms with working submit and status tracking.
- [x] **Placements (`/placements`)**:
  - [x] T&P cell profile, candidate verification form, upcoming contests with working Register button.
- [x] **Student Corner (`/student-corner`)**:
  - [x] Amenities directory and working Seminar Hall booking form with history.
- [x] **Syllabus & Documents (`/documents`)**:
  - [x] Search, category filter, document inspection modal, sample downloads.
- [x] **AI Assistant (`/ai-assistant` & Floating Launcher)**:
  - [x] Grounded rule-based engine answering attendance, exams, fees, timetable, assignments, condonation rules.
  - [x] Explicit privacy refusal when asking about other students.
  - [x] Source chips under answers.

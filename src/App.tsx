import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortalProvider } from './context/PortalContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignedOutPage } from './pages/auth/SignedOutPage';
import { SessionExpiredPage } from './pages/auth/SessionExpiredPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { TermsPage, PrivacyPage } from './pages/TermsPrivacyPages';
import { NotFoundPage } from './pages/NotFoundPage';

import { DashboardPage } from './pages/DashboardPage';
import { AttendancePage } from './pages/AttendancePage';
import { AcademicsPage } from './pages/AcademicsPage';
import { CompetitiveExamsPage } from './pages/CompetitiveExamsPage';
import { FeesPage } from './pages/FeesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { SelfDeclarationPage } from './pages/SelfDeclarationPage';
import { NoticesPage } from './pages/NoticesPage';
import { NoticeDetailPage } from './pages/NoticeDetailPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { HelpPage } from './pages/HelpPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { StudyPlannerPage } from './pages/planner/StudyPlannerPage';
import { DepartmentsPage } from './pages/departments/DepartmentsPage';
import { ExaminationSectionPage } from './pages/examination/ExaminationSectionPage';
import { PlacementsPage } from './pages/placements/PlacementsPage';
import { StudentCornerPage } from './pages/student-corner/StudentCornerPage';
import { ComplaintsPage } from './pages/ComplaintsPage';

export function App() {
  return (
    <PortalProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication & Policy Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signed-out" element={<SignedOutPage />} />
          <Route path="/session-expired" element={<SessionExpiredPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Protected Portal Shell Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/academics" element={<AcademicsPage />} />
            <Route path="/competitive-exams" element={<CompetitiveExamsPage />} />
            <Route path="/fees" element={<FeesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/declaration" element={<SelfDeclarationPage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/notices/:id" element={<NoticeDetailPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />

            {/* Study Planner sub-routes */}
            <Route path="/planner" element={<Navigate to="/planner/tasks" replace />} />
            <Route path="/planner/:tab" element={<StudyPlannerPage />} />

            {/* Departments */}
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/:deptId" element={<DepartmentsPage />} />

            {/* Examination Section */}
            <Route path="/examination" element={<ExaminationSectionPage />} />
            <Route path="/examination/:tab" element={<ExaminationSectionPage />} />

            {/* Placements */}
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/placements/:tab" element={<PlacementsPage />} />

            {/* Student Corner */}
            <Route path="/student-corner" element={<StudentCornerPage />} />
            <Route path="/student-corner/complaints" element={<ComplaintsPage />} />
            <Route path="/student-corner/:tab" element={<StudentCornerPage />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PortalProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { WifiOff, AlertTriangle, Clock } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FloatingAssistantChat } from '../chat/FloatingAssistantChat';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const Layout: React.FC = () => {
  const {
    isOnline,
    isReadOnlyYear,
    academicYear,
    isSessionTimeoutWarning,
    extendSession,
    expireSession,
    preferences,
    updatePreferences
  } = usePortal();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFirstThemeModal, setShowFirstThemeModal] = useState(
    !preferences.firstLoginThemeChosen
  );

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans selection:bg-app-accent selection:text-white">
      {/* 1. Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-app-danger text-white px-4 py-2 text-xs flex items-center justify-center gap-2 z-50">
          <WifiOff className="w-4 h-4" />
          <span>You are currently offline. Changes are saved locally and will sync when reconnected.</span>
        </div>
      )}

      {/* 2. Read-Only Academic Year Archive Banner */}
      {isReadOnlyYear && (
        <div className="bg-[#B7791F]/15 border-b border-[#B7791F]/30 text-[#B7791F] px-4 py-2 text-xs flex items-center justify-center gap-2 z-40 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Viewing {academicYear} archive records (read-only mode). Financial and enrollment actions are disabled.</span>
        </div>
      )}

      {/* 3. Main Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* 4. Body with Sidebar and Main Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 5. Floating AI Chat Launcher */}
      <FloatingAssistantChat />

      {/* 6. Session Timeout Warning Modal */}
      <Modal
        isOpen={isSessionTimeoutWarning}
        onClose={extendSession}
        title="Session Inactivity Warning"
        subtitle="Automatic security sign-out"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={expireSession}>
              Sign Out
            </Button>
            <Button variant="primary" size="sm" onClick={extendSession}>
              Stay Signed In
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-app-warning/10 text-app-warning shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs text-app-muted leading-relaxed">
            Your portal session has been inactive. For security on shared campus workstations, this session will expire in 60 seconds unless you choose to stay signed in.
          </p>
        </div>
      </Modal>

      {/* 7. Optional First-login "Choose your theme" modal */}
      <Modal
        isOpen={showFirstThemeModal}
        onClose={() => {
          updatePreferences({ firstLoginThemeChosen: true });
          setShowFirstThemeModal(false);
        }}
        title="Welcome to Student Portal"
        subtitle="Choose your preferred appearance"
        maxWidth="sm"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              updatePreferences({ firstLoginThemeChosen: true });
              setShowFirstThemeModal(false);
            }}
          >
            Continue to Dashboard
          </Button>
        }
      >
        <p className="text-xs text-app-muted mb-4">
          Select a theme to begin. You can change this anytime in Settings &gt; Appearance.
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'light', label: 'Light' },
            { id: 'dark', label: 'Dark' },
            { id: 'system', label: 'System' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => updatePreferences({ theme: item.id as any })}
              className={`p-3 rounded border text-xs text-center font-medium transition-colors ${
                preferences.theme === item.id
                  ? 'border-app-accent bg-app-accent/10 text-app-accent font-semibold'
                  : 'border-app-border bg-app-surface text-app-text hover:border-app-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

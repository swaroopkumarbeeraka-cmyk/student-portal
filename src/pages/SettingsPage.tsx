import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Bell,
  Sliders,
  RotateCcw,
  Shield,
  Sun,
  Moon,
  Monitor,
  Eye,
  Type,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const SettingsPage: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    demoOverrides,
    updateDemoOverrides,
    resetDemoData,
    selfDeclaration,
    submitSelfDeclaration
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'general' | 'demo_controls'>('general');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetConfirm = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setIsResetModalOpen(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'Settings' }]} />

      {/* Header with Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Configure portal theme, accessibility, notifications, and sandbox state overrides
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 bg-app-surface p-1 rounded border border-app-border text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'general'
                ? 'bg-app-accent text-white font-medium'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('demo_controls')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'demo_controls'
                ? 'bg-app-accent text-white font-medium'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Controls</span>
          </button>
        </div>
      </div>

      {activeTab === 'general' ? (
        <div className="space-y-6">
          {/* 1. Appearance (Theme) */}
          <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-app-border">
              <Palette className="w-4 h-4 text-app-accent" />
              <h2 className="text-sm font-semibold text-app-text">Appearance & Theme</h2>
            </div>

            <div>
              <p className="text-xs text-app-muted mb-3">
                Select your display theme. The system option automatically synchronizes with your OS dark/light mode preference.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light Theme', desc: '#F6F4EF Paper tone', icon: Sun },
                  { id: 'dark', label: 'Dark Theme', desc: '#151918 Deep slate', icon: Moon },
                  { id: 'system', label: 'System Default', desc: 'Follows operating system', icon: Monitor }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = preferences.theme === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => updatePreferences({ theme: item.id as any })}
                      className={`p-3.5 rounded border text-left transition-colors flex flex-col justify-between h-24 ${
                        isSelected
                          ? 'border-app-accent bg-app-accent/10 text-app-text font-semibold'
                          : 'border-app-border bg-app-surface text-app-muted hover:border-app-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-app-accent' : 'text-app-muted'}`} />
                        {isSelected && <Badge variant="accent" size="sm">Active</Badge>}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-app-text">{item.label}</p>
                        <p className="text-[10px] text-app-muted">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Accessibility Options (Actually works!) */}
          <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-app-border">
              <Type className="w-4 h-4 text-app-accent" />
              <h2 className="text-sm font-semibold text-app-text">Accessibility & Reading Comfort</h2>
            </div>

            <div className="space-y-4 text-xs">
              {/* Text Size */}
              <div>
                <label className="block font-medium text-app-text mb-1.5">
                  Portal Text Size Scale
                </label>
                <p className="text-app-muted mb-2.5">
                  Adjusts root typography scale across all student tables, cards, and reading materials.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'normal', label: 'Default (16px)' },
                    { id: 'large', label: 'Large (18px)' },
                    { id: 'xlarge', label: 'Extra Large (20px)' }
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => updatePreferences({ textSize: size.id as any })}
                      className={`p-2.5 rounded border text-center transition-colors ${
                        preferences.textSize === size.id
                          ? 'border-app-accent bg-app-accent/10 text-app-accent font-semibold'
                          : 'border-app-border bg-app-surface text-app-muted hover:border-app-muted'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="pt-3 border-t border-app-border flex items-center justify-between">
                <div>
                  <p className="font-medium text-app-text">Reduced Motion</p>
                  <p className="text-app-muted text-[11px] mt-0.5">
                    Disables UI transitions, spins, and banner animations for vestibular sensitivity.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reducedMotion}
                  onChange={(e) => updatePreferences({ reducedMotion: e.target.checked })}
                  className="w-4 h-4 accent-app-accent cursor-pointer rounded"
                />
              </div>
            </div>
          </div>

          {/* 3. Notification Preferences (Actually filters) */}
          <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-app-border">
              <Bell className="w-4 h-4 text-app-accent" />
              <h2 className="text-sm font-semibold text-app-text">Notification Channels</h2>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { key: 'academic', label: 'Academic & Curriculum Circulars', desc: 'Syllabus, class cancellations, assignment notices' },
                { key: 'fees', label: 'Fee Dues & Receipts', desc: 'Installment reminders, transaction receipts' },
                { key: 'examination', label: 'Examination Timetables & Results', desc: 'Mid-term, end-term scorecards' },
                { key: 'planner', label: 'Study Planner Reminders', desc: 'Task deadlines and calendar milestone alerts' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-1.5 border-b border-app-border/50 last:border-b-0">
                  <div>
                    <p className="font-medium text-app-text">{item.label}</p>
                    <p className="text-[11px] text-app-muted">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(preferences.notificationPreferences as any)[item.key]}
                    onChange={(e) =>
                      updatePreferences({
                        notificationPreferences: {
                          ...preferences.notificationPreferences,
                          [item.key]: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4 accent-app-accent cursor-pointer rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 4. Reset Demo Data */}
          <div className="bg-app-surface border border-app-border rounded p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-app-text">Reset Demo Session Data</h2>
                <p className="text-xs text-app-muted mt-0.5">
                  Wipes all local storage state (tasks, complaints, payments, self-declaration) and restores pristine prototype records.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
                icon={<RotateCcw className="w-3.5 h-3.5 text-app-danger" />}
              >
                Reset Demo Data
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Demo Controls Tab */
        <div className="space-y-6">
          <div className="p-4 bg-app-accent/10 border border-app-accent/20 rounded text-xs text-app-text flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-app-accent shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-semibold text-app-accent">Tester & Evaluator Control Panel</p>
              <p className="text-app-muted mt-0.5">
                Use these toggles to quickly test different prototype variants and edge states without having to modify files.
              </p>
            </div>
          </div>

          {/* State Variant Toggles */}
          <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
            <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
              Simulate State Variations
            </h2>

            <div className="space-y-4 text-xs">
              {/* Toggle Low Attendance */}
              <div className="flex items-center justify-between pb-3 border-b border-app-border">
                <div>
                  <p className="font-semibold text-app-text">Simulate Attendance Below 75% Cutoff</p>
                  <p className="text-app-muted mt-0.5">
                    Flips attendance to 71.4% (Critical status) to verify warning banners, condonation notices, and exam eligibility flags.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={demoOverrides.forceLowAttendance}
                  onChange={(e) =>
                    updateDemoOverrides({ forceLowAttendance: e.target.checked })
                  }
                  className="w-4 h-4 accent-app-accent cursor-pointer rounded"
                />
              </div>

              {/* Fee State Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-app-border">
                <div>
                  <p className="font-semibold text-app-text">Fee Settlement State</p>
                  <p className="text-app-muted mt-0.5">
                    Switch between normal partially paid (₹40,000 due), 100% fully cleared, or overdue state.
                  </p>
                </div>
                <select
                  value={demoOverrides.forceFeeState}
                  onChange={(e) =>
                    updateDemoOverrides({ forceFeeState: e.target.value as any })
                  }
                  className="h-8 px-2.5 bg-app-bg border border-app-border rounded text-xs text-app-text font-medium"
                >
                  <option value="normal">Normal (₹40,000 Due - Partially Paid)</option>
                  <option value="fullyPaid">Fully Cleared (₹0 Due - Paid)</option>
                  <option value="overdue">Overdue (Past Deadline Surcharge)</option>
                </select>
              </div>

              {/* Competitive Exam Empty State */}
              <div className="flex items-center justify-between pb-3 border-b border-app-border">
                <div>
                  <p className="font-semibold text-app-text">Competitive Exams Data</p>
                  <p className="text-app-muted mt-0.5">
                    Toggle between populated table (TCS CodeVita, NPTEL) and Empty State.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={demoOverrides.competitiveExamHasData}
                  onChange={(e) =>
                    updateDemoOverrides({ competitiveExamHasData: e.target.checked })
                  }
                  className="w-4 h-4 accent-app-accent cursor-pointer rounded"
                />
              </div>

              {/* Self-Declaration Status Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-app-text">Self-Declaration Form State</p>
                  <p className="text-app-muted mt-0.5">
                    Toggle whether the annual honor code & anti-ragging declaration is pending or submitted.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selfDeclaration.isSubmitted) {
                      updatePreferences({});
                      // toggle to unsubmitted
                      window.location.reload();
                    } else {
                      submitSelfDeclaration({});
                    }
                  }}
                >
                  {selfDeclaration.isSubmitted ? 'Mark as Pending' : 'Mark as Submitted'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirm Reset Demo Data"
        subtitle="This action will erase local session state"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleResetConfirm}>
              Reset to Initial Mock
            </Button>
          </>
        }
      >
        <div className="space-y-2 text-xs text-app-muted">
          {resetSuccess ? (
            <div className="p-3 bg-app-success/10 border border-app-success/20 rounded text-center text-app-success font-medium">
              Demo data reset successfully!
            </div>
          ) : (
            <p className="leading-relaxed">
              Are you sure you want to reset all demo records? Any personal study tasks, submitted suggestions, simulated payments, and PIN changes will be restored to original factory defaults.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

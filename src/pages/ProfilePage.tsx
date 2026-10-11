import React, { useState } from 'react';
import {
  User,
  Copy,
  Check,
  ShieldCheck,
  KeyRound,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  Info,
  Lock
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const ProfilePage: React.FC = () => {
  const { student, preferences, updatePreferences } = usePortal();

  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Change PIN modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(student.studentCode);
    setCopiedCode(true);
    setToastMessage(`Student code ${student.studentCode} copied to clipboard`);
    setTimeout(() => {
      setCopiedCode(false);
      setToastMessage(null);
    }, 2500);
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    if (currentPin !== preferences.securityPin) {
      setPinError('Current security PIN is incorrect.');
      return;
    }
    if (!/^\d{4,6}$/.test(newPin)) {
      setPinError('New PIN must be 4 to 6 numeric digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('New PIN and confirmation PIN do not match.');
      return;
    }
    if (newPin === currentPin) {
      setPinError('New PIN cannot be identical to the current PIN.');
      return;
    }

    updatePreferences({ securityPin: newPin });
    setPinSuccess(true);
    setTimeout(() => {
      setPinSuccess(false);
      setIsPinModalOpen(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setToastMessage('Security PIN successfully updated');
      setTimeout(() => setToastMessage(null), 2500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'Student Profile' }]} />

      {/* Copy Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-app-text text-app-surface px-4 py-2 rounded text-xs shadow-lg flex items-center gap-2 border border-app-border">
          <Check className="w-4 h-4 text-app-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-app-surface border border-app-border rounded p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded bg-app-accent text-white flex items-center justify-center font-bold text-xl shrink-0">
            AK
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-app-text">{student.name}</h1>
              <Badge variant="accent" size="sm">
                Enrolled Student
              </Badge>
            </div>
            <p className="text-xs text-app-muted">
              {student.course} in {student.branch} ({student.specialization})
            </p>
            <p className="text-xs text-app-muted font-mono">
              Roll No: <span className="text-app-text font-medium">{student.rollNo}</span>
            </p>
          </div>
        </div>

        {/* Student Code Copy Chip */}
        <div className="flex items-center gap-2 bg-app-bg border border-app-border rounded px-3 py-2 text-xs">
          <div>
            <span className="text-[10px] text-app-muted uppercase block leading-none">
              Student Code
            </span>
            <span className="font-mono font-bold text-app-text text-sm">
              {student.studentCode}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            aria-label="Copy student code"
            className="p-1.5 rounded hover:bg-app-surface text-app-muted hover:text-app-text transition-colors"
          >
            {copiedCode ? (
              <Check className="w-4 h-4 text-app-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Official Academic Information */}
      <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-app-border">
          <GraduationCap className="w-4 h-4 text-app-accent" />
          <h2 className="text-sm font-semibold text-app-text">Academic & Institutional Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-app-muted block">Department</span>
            <span className="font-medium text-app-text mt-0.5 block">{student.branch}</span>
          </div>

          <div>
            <span className="text-app-muted block">Program & Specialization</span>
            <span className="font-medium text-app-text mt-0.5 block">
              {student.course} - {student.specialization}
            </span>
          </div>

          <div>
            <span className="text-app-muted block">Current Standing</span>
            <span className="font-medium text-app-text mt-0.5 block">
              Year {student.year}, Semester {student.semester} ({student.section})
            </span>
          </div>

          <div>
            <span className="text-app-muted block">Institution</span>
            <span className="font-medium text-app-text mt-0.5 block">{student.institutionName}</span>
          </div>

          <div>
            <span className="text-app-muted block">Affiliation Code</span>
            <span className="font-medium font-mono text-app-text mt-0.5 block">AITS-ENG-2026-AUT</span>
          </div>

          <div>
            <span className="text-app-muted block">Academic Regulation</span>
            <span className="font-medium text-app-text mt-0.5 block">R23 Autonomous Curriculum</span>
          </div>
        </div>
      </div>

      {/* 3. Contact & Communication Information (Masked) */}
      <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-app-border">
          <Mail className="w-4 h-4 text-app-accent" />
          <h2 className="text-sm font-semibold text-app-text">Registered Contact Particulars</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
            <span className="text-app-muted block">Official Institutional Email</span>
            <span className="font-mono font-medium text-app-text">{student.email}</span>
            <p className="text-[11px] text-app-muted">Single Sign-On (SSO) primary address</p>
          </div>

          <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
            <span className="text-app-muted block">Mobile Number (Masked for Security)</span>
            <span className="font-mono font-medium text-app-text">{student.phoneMasked}</span>
            <p className="text-[11px] text-app-muted">Registered for SMS circulars & OTPs</p>
          </div>
        </div>

        {/* Note on updating official records */}
        <div className="p-3 bg-app-bg border border-app-border rounded text-xs text-app-muted flex items-start gap-2.5">
          <Info className="w-4 h-4 text-app-accent shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <p className="font-medium text-app-text">How to update official contact or personal records:</p>
            <p>
              Due to university examination protocol, personal details (name spelling, father's name, permanent address, phone number) cannot be altered directly via the web portal. To request a modification, submit a written application along with supporting government identity documents (Aadhaar / Passport) to the Student Affairs Section (Admin Block Room 102).
            </p>
          </div>
        </div>
      </div>

      {/* 4. Security & Credentials Section */}
      <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-app-border">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-app-accent" />
            <h2 className="text-sm font-semibold text-app-text">Portal Access Credentials</h2>
          </div>
          <Badge variant="accent" size="sm">
            Protected
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-medium text-app-text">Portal Security PIN</p>
            <p className="text-app-muted mt-0.5">
              4-digit PIN utilized for authenticating on campus terminals and sensitive fee declarations.
            </p>
            <p className="text-[11px] font-mono text-app-muted mt-1">
              Current PIN: <span className="tracking-widest">••••</span> (Stored securely in local session)
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPinError(null);
              setIsPinModalOpen(true);
            }}
            icon={<Lock className="w-3.5 h-3.5" />}
          >
            Change Security PIN
          </Button>
        </div>
      </div>

      {/* Change PIN Modal */}
      <Modal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        title="Update Portal Security PIN"
        subtitle="Verification required"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          {pinSuccess ? (
            <div className="p-4 bg-app-success/10 border border-app-success/20 rounded text-center space-y-2">
              <Check className="w-8 h-8 text-app-success mx-auto" />
              <p className="font-semibold text-app-text">PIN Changed Successfully</p>
              <p className="text-app-muted">Your new credentials have been persisted.</p>
            </div>
          ) : (
            <form onSubmit={handleChangePinSubmit} className="space-y-3">
              {pinError && (
                <div className="p-2.5 rounded bg-app-danger/10 border border-app-danger/20 text-app-danger">
                  {pinError}
                </div>
              )}

              <div>
                <label className="block font-medium text-app-text mb-1">Current PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="••••"
                  className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-app-text mb-1">New PIN (4-6 digits)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-app-text mb-1">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••"
                  className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPinModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save New PIN
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

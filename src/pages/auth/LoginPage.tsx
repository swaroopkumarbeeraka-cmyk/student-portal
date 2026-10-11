import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const LoginPage: React.FC = () => {
  const { login, preferences, updatePreferences } = usePortal();
  const navigate = useNavigate();
  const location = useLocation();

  const [studentCode, setStudentCode] = useState('STU-20260501');
  const [pin, setPin] = useState('2026');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot PIN simulated modal
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'otp' | 'newPin' | 'success'>('request');
  const [forgotCode, setForgotCode] = useState('STU-20260501');
  const [otpInput, setOtpInput] = useState('4921');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentCode.trim()) {
      setError('Please enter your student code.');
      return;
    }
    if (!pin.trim()) {
      setError('Please enter your security PIN.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(studentCode, pin);
      setIsLoading(false);
      if (res.success) {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Authentication failed.');
      }
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (forgotStep === 'request') {
      if (forgotCode.trim().toUpperCase() !== 'STU-20260501') {
        setForgotError('Student code not recognized. Use STU-20260501.');
        return;
      }
      setForgotStep('otp');
    } else if (forgotStep === 'otp') {
      if (otpInput.trim() !== '4921') {
        setForgotError('Incorrect OTP. Demo OTP is 4921.');
        return;
      }
      setForgotStep('newPin');
    } else if (forgotStep === 'newPin') {
      if (!/^\d{4,6}$/.test(newPinInput)) {
        setForgotError('PIN must be 4 to 6 numeric digits.');
        return;
      }
      if (newPinInput !== confirmPinInput) {
        setForgotError('PIN confirmation does not match.');
        return;
      }
      updatePreferences({ securityPin: newPinInput });
      setPin(newPinInput);
      setForgotStep('success');
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col justify-between p-4 sm:p-6">
      {/* Top Banner */}
      <div className="max-w-md w-full mx-auto text-center pt-8 sm:pt-12">
        <div className="w-12 h-12 rounded bg-app-accent text-white flex items-center justify-center font-bold text-base mx-auto mb-3">
          AITS
        </div>
        <h1 className="text-lg sm:text-xl font-semibold text-app-text tracking-tight">
          Apex Institute of Technology & Science
        </h1>
        <p className="text-xs text-app-muted mt-1">Autonomous • Unified Student Portal</p>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto my-6 bg-app-surface border border-app-border rounded p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-app-text">Student Sign In</h2>
          <p className="text-xs text-app-muted mt-0.5">
            Access attendance, marks, fees, and campus services.
          </p>
        </div>

        {/* Prototype Honesty Notice */}
        <div className="mb-5 p-3 rounded bg-app-bg border border-app-border text-xs flex items-start gap-2.5 text-app-muted">
          <ShieldAlert className="w-4 h-4 text-app-accent shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-medium text-app-text">Prototype Demonstration</p>
            <p className="text-[11px] mt-0.5">
              Prototype auth, not production security. Demo credentials below:
            </p>
            <p className="text-[11px] font-mono mt-1 text-app-accent">
              Code: <span className="font-bold">STU-20260501</span> | PIN: <span className="font-bold">{preferences.securityPin}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-app-danger/10 border border-app-danger/20 text-xs text-app-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-app-text mb-1" htmlFor="student-code">
              Student Code / Roll Number
            </label>
            <input
              id="student-code"
              type="text"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              placeholder="e.g. STU-20260501"
              className="w-full h-10 px-3 text-xs bg-app-bg border border-app-border rounded text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-app-text" htmlFor="pin">
                Security PIN (4 digits)
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotStep('request');
                  setForgotError(null);
                  setIsForgotOpen(true);
                }}
                className="text-[11px] text-app-accent hover:underline"
              >
                Forgot PIN?
              </button>
            </div>
            <div className="relative">
              <input
                id="pin"
                type={showPin ? 'text' : 'password'}
                value={pin}
                maxLength={6}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full h-10 pl-3 pr-10 text-xs bg-app-bg border border-app-border rounded text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent font-mono tracking-widest"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Portal
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center pb-6 text-xs text-app-muted space-y-2">
        <div className="flex items-center justify-center gap-4 text-[11px]">
          <Link to="/terms" className="hover:text-app-text hover:underline">
            Terms of Use
          </Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-app-text hover:underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/help" className="hover:text-app-text hover:underline">
            Portal Support
          </Link>
        </div>
        <p className="text-[10px]">
          © 2026 Apex Institute of Technology & Science. All rights reserved.
        </p>
      </div>

      {/* Simulated Forgot PIN Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        title="Reset Security PIN (Simulated Flow)"
        subtitle="Verification via registered contact"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-app-muted">
            This simulates the self-service PIN recovery procedure without requiring live SMS gateways.
          </p>

          {forgotError && (
            <div className="p-2.5 rounded bg-app-danger/10 border border-app-danger/20 text-xs text-app-danger">
              {forgotError}
            </div>
          )}

          {forgotStep === 'request' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-app-text mb-1">
                  Student Code
                </label>
                <input
                  type="text"
                  value={forgotCode}
                  onChange={(e) => setForgotCode(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-app-bg border border-app-border rounded text-app-text"
                  required
                />
              </div>
              <p className="text-[11px] text-app-muted">
                A verification code will be simulated for masked mobile number (+91 98XXXXX210).
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsForgotOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send OTP Code
                </Button>
              </div>
            </form>
          )}

          {forgotStep === 'otp' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div className="p-2.5 bg-app-bg border border-app-border rounded text-xs text-app-muted">
                Demo Simulation: An OTP has been simulated. Enter test code <span className="font-mono font-bold text-app-accent">4921</span>.
              </div>
              <div>
                <label className="block text-xs font-medium text-app-text mb-1">
                  4-Digit Verification OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-app-bg border border-app-border rounded text-app-text font-mono tracking-widest"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setForgotStep('request')}>
                  Back
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Verify OTP
                </Button>
              </div>
            </form>
          )}

          {forgotStep === 'newPin' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-app-text mb-1">
                  New 4-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full h-9 px-3 text-xs bg-app-bg border border-app-border rounded text-app-text font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-app-text mb-1">
                  Confirm New PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full h-9 px-3 text-xs bg-app-bg border border-app-border rounded text-app-text font-mono"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="submit" variant="primary" size="sm">
                  Set New PIN
                </Button>
              </div>
            </form>
          )}

          {forgotStep === 'success' && (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-app-success mx-auto" />
              <p className="text-sm font-semibold text-app-text">PIN Reset Successfully</p>
              <p className="text-xs text-app-muted">
                Your security PIN has been updated in local storage. You can now log in with your new PIN.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsForgotOpen(false)}
                className="mt-2"
              >
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

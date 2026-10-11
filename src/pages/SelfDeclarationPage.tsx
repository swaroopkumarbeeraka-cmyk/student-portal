import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSignature,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Printer,
  User,
  Phone
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const SelfDeclarationPage: React.FC = () => {
  const { student, selfDeclaration, submitSelfDeclaration } = usePortal();
  const navigate = useNavigate();

  const [honorChecked, setHonorChecked] = useState(selfDeclaration.academicHonorAccepted);
  const [medicalChecked, setMedicalChecked] = useState(selfDeclaration.medicalFitnessAccepted);
  const [raggingChecked, setRaggingChecked] = useState(selfDeclaration.antiRaggingAccepted);
  const [contactChecked, setContactChecked] = useState(selfDeclaration.contactConfirmed);
  const [emergencyName, setEmergencyName] = useState(selfDeclaration.emergencyContactName);
  const [emergencyPhone, setEmergencyPhone] = useState(selfDeclaration.emergencyContactPhone);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!honorChecked || !medicalChecked || !raggingChecked || !contactChecked) {
      setError('Please review and agree to all 4 mandatory undertakings before submission.');
      return;
    }
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      setError('Emergency contact name and phone number are required.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitSelfDeclaration({
        academicHonorAccepted: honorChecked,
        medicalFitnessAccepted: medicalChecked,
        antiRaggingAccepted: raggingChecked,
        contactConfirmed: contactChecked,
        emergencyContactName: emergencyName,
        emergencyContactPhone: emergencyPhone
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: 'Self-Declaration Form' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Mandatory Student Self-Declaration Form
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Academic Session 2026-27 • Statutory Compliance & Undertakings
          </p>
        </div>

        <Badge
          variant={selfDeclaration.isSubmitted ? 'success' : 'warning'}
          size="md"
        >
          {selfDeclaration.isSubmitted ? 'Submitted & Attested' : 'Due by 20 Oct 2026'}
        </Badge>
      </div>

      {selfDeclaration.isSubmitted ? (
        /* Submitted Review View */
        <div className="bg-app-surface border border-app-border rounded p-6 sm:p-8 space-y-6">
          <div className="p-4 bg-app-success/10 border border-app-success/20 rounded flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-app-success shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-app-text">
                Self-Declaration Submitted on {selfDeclaration.submissionDate || '08 Oct 2026'}
              </h2>
              <p className="text-xs text-app-muted mt-0.5">
                Your annual honor code, medical declaration and statutory undertakings are formally registered with the Dean of Student Affairs.
              </p>
            </div>
          </div>

          {/* Attestation summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border border-app-border rounded p-4 bg-app-bg">
            <div>
              <span className="text-app-muted">Student Name</span>
              <p className="font-semibold text-app-text mt-0.5">{student.name}</p>
            </div>
            <div>
              <span className="text-app-muted">Roll Number & Code</span>
              <p className="font-mono font-medium text-app-text mt-0.5">
                {student.rollNo} / {student.studentCode}
              </p>
            </div>
            <div>
              <span className="text-app-muted">Course & Section</span>
              <p className="text-app-text mt-0.5">{student.course} {student.specialization} - {student.section}</p>
            </div>
            <div>
              <span className="text-app-muted">Emergency Contact On Record</span>
              <p className="text-app-text mt-0.5">{selfDeclaration.emergencyContactName} ({selfDeclaration.emergencyContactPhone})</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-app-muted leading-relaxed">
            <p className="flex items-center gap-2 text-app-text font-medium">
              <CheckCircle2 className="w-4 h-4 text-app-success" />
              Academic Honor Code & Plagiarism Undertaking: Attested
            </p>
            <p className="flex items-center gap-2 text-app-text font-medium">
              <CheckCircle2 className="w-4 h-4 text-app-success" />
              Physical Fitness & Medical Records Disclosure: Attested
            </p>
            <p className="flex items-center gap-2 text-app-text font-medium">
              <CheckCircle2 className="w-4 h-4 text-app-success" />
              Statutory Anti-Ragging Undertaking (UGC Regulations): Attested
            </p>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              icon={<Printer className="w-3.5 h-3.5" />}
            >
              Print Declaration Copy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        /* Fill Form View */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-app-surface border border-app-border rounded space-y-4">
            <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
              Part I: Student Verification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-app-muted">Student Name</span>
                <p className="font-semibold text-app-text mt-0.5">{student.name}</p>
              </div>
              <div>
                <span className="text-app-muted">Student Code</span>
                <p className="font-mono text-app-text mt-0.5">{student.studentCode}</p>
              </div>
              <div>
                <span className="text-app-muted">Program & Branch</span>
                <p className="text-app-text mt-0.5">{student.course} {student.specialization}</p>
              </div>
            </div>
          </div>

          {/* Part II: Undertakings */}
          <div className="p-4 bg-app-surface border border-app-border rounded space-y-4">
            <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
              Part II: Mandatory Undertakings & Declarations
            </h2>

            {error && (
              <div className="p-3 rounded bg-app-danger/10 border border-app-danger/20 text-xs text-app-danger">
                {error}
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Honor Code */}
              <label className="flex items-start gap-3 p-3 rounded bg-app-bg border border-app-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={honorChecked}
                  onChange={(e) => setHonorChecked(e.target.checked)}
                  className="mt-0.5 accent-app-accent rounded w-4 h-4 shrink-0"
                />
                <div>
                  <p className="font-semibold text-app-text">
                    1. Academic Honor Code & Ethics Undertaking
                  </p>
                  <p className="text-app-muted mt-0.5 leading-relaxed">
                    I pledge to uphold complete integrity in all continuous assessments, lab practicals, and university semester examinations under Regulation R23. I will not engage in plagiarism, illicit code collaboration, or exam malpractice.
                  </p>
                </div>
              </label>

              {/* Medical Declaration */}
              <label className="flex items-start gap-3 p-3 rounded bg-app-bg border border-app-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={medicalChecked}
                  onChange={(e) => setMedicalChecked(e.target.checked)}
                  className="mt-0.5 accent-app-accent rounded w-4 h-4 shrink-0"
                />
                <div>
                  <p className="font-semibold text-app-text">
                    2. Physical Fitness & Medical Disclosure
                  </p>
                  <p className="text-app-muted mt-0.5 leading-relaxed">
                    I declare that I am medically fit to participate in regular classroom instruction, engineering workshop activities, and laboratory coursework. In case of illness, I agree to produce authenticated medical certificates within 3 working days to the Institute Dispensary.
                  </p>
                </div>
              </label>

              {/* Anti-Ragging Undertaking */}
              <label className="flex items-start gap-3 p-3 rounded bg-app-bg border border-app-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={raggingChecked}
                  onChange={(e) => setRaggingChecked(e.target.checked)}
                  className="mt-0.5 accent-app-accent rounded w-4 h-4 shrink-0"
                />
                <div>
                  <p className="font-semibold text-app-text">
                    3. Statutory Anti-Ragging Undertaking (UGC / AICTE Norms)
                  </p>
                  <p className="text-app-muted mt-0.5 leading-relaxed">
                    I understand that ragging in any form (physical, verbal, or digital) is strictly prohibited on campus and in student hostels. Any violation will result in immediate suspension, expulsion, and statutory police reporting as per Supreme Court directives.
                  </p>
                </div>
              </label>

              {/* Contact Confirmation */}
              <label className="flex items-start gap-3 p-3 rounded bg-app-bg border border-app-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={contactChecked}
                  onChange={(e) => setContactChecked(e.target.checked)}
                  className="mt-0.5 accent-app-accent rounded w-4 h-4 shrink-0"
                />
                <div>
                  <p className="font-semibold text-app-text">
                    4. Contact Details & Notification Consent
                  </p>
                  <p className="text-app-muted mt-0.5 leading-relaxed">
                    I confirm that the mobile number (+91 98XXXXX210) and institutional email (aarav.kumar@college.example) on record are active and authorized to receive official examination notices and fee reminders.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Part III: Emergency Contact */}
          <div className="p-4 bg-app-surface border border-app-border rounded space-y-4">
            <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
              Part III: Emergency Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-app-text mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-app-text mb-1">
                  Emergency Contact Number
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Sign & Submit Declaration
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Users,
  Bell,
  Calendar,
  FileQuestion,
  FileSignature,
  ShieldAlert,
  Phone,
  Mail,
  Download,
  Send,
  CheckCircle2,
  Check,
  AlertTriangle
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { ExamApplicationForm } from '../../types';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const ExaminationSectionPage: React.FC = () => {
  const { examForms, submitExamForm, notices, documents } = usePortal();
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    if (location.pathname.includes('/notifications')) return 'notifications';
    if (location.pathname.includes('/timetables')) return 'timetables';
    if (location.pathname.includes('/question-papers')) return 'question_papers';
    if (location.pathname.includes('/forms')) return 'forms';
    if (location.pathname.includes('/malpractice')) return 'malpractice';
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<
    'profile' | 'notifications' | 'timetables' | 'question_papers' | 'forms' | 'malpractice'
  >(getInitialTab());

  // Form submit state
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [formType, setFormType] = useState<ExamApplicationForm['formType']>('Revaluation / Recounting');
  const [formSemester, setFormSemester] = useState('Semester 1');
  const [formDetails, setFormDetails] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleApplyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDetails.trim()) return;

    submitExamForm(formType, formSemester, formDetails.trim());
    setFormDetails('');
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsSubmitFormOpen(false);
    }, 1200);
  };

  const examNotices = notices.filter((n) => n.category === 'Examination');
  const questionPapers = documents.filter((d) => d.category === 'Question Paper');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: 'Examination Section' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Office of the Controller of Examinations
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Autonomous Examination Cell • Timetables, Question Archives, Grievances & Certifications
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-app-surface p-1 rounded border border-app-border text-xs overflow-x-auto">
          {[
            { id: 'profile', label: 'Cell Profile & Staff' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'timetables', label: 'Timetables' },
            { id: 'question_papers', label: 'Question Papers' },
            { id: 'forms', label: 'Application Forms' },
            { id: 'malpractice', label: 'Malpractice Rules' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                navigate(tab.id === 'profile' ? '/examination' : `/examination/${tab.id.replace('_', '-')}`);
              }}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'bg-app-accent text-white font-semibold'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Profile & Staff */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-app-surface border border-app-border rounded p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
              Autonomous Examination Cell Charter
            </h2>
            <p className="text-xs text-app-muted leading-relaxed">
              The Examination Section is the statutory authority entrusted with conducting continuous assessments, end-semester university examinations, secure evaluation, tabulation of credits, generation of grade sheets, and issuing official transcripts under Academic Regulations R23.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
                <span className="text-app-muted block">Controller of Examinations</span>
                <p className="font-semibold text-app-text">Dr. K. S. Parthasarathy, Ph.D.</p>
                <p className="text-[11px] text-app-muted font-mono">coe@college.example • Ext. 2101</p>
              </div>

              <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
                <span className="text-app-muted block">Additional Controller (Confidential Section)</span>
                <p className="font-semibold text-app-text">Prof. N. Meenakshi, M.Tech.</p>
                <p className="text-[11px] text-app-muted font-mono">addl.coe@college.example • Ext. 2102</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Exam Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-3">
          {examNotices.map((n) => (
            <div key={n.id} className="p-4 bg-app-surface border border-app-border rounded space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <Badge variant="accent" size="sm">Examination Circular</Badge>
                <span className="font-mono text-app-muted">{n.date}</span>
              </div>
              <h3 className="font-semibold text-app-text text-sm">{n.title}</h3>
              <p className="text-app-muted leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Timetables */}
      {activeTab === 'timetables' && (
        <div className="bg-app-surface border border-app-border rounded p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-app-border">
            <h2 className="text-sm font-semibold text-app-text">Examination Schedules (Published)</h2>
            <Badge variant="accent" size="sm">Session 2026-27</Badge>
          </div>

          <div className="divide-y divide-app-border">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-app-text">Mid-Semester Examination 2 (Mid-2) Tentative Schedule</p>
                <p className="text-[11px] text-app-muted">Commencing 18 November 2026 • First Year B.Tech</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => alert('[Sandbox Preview] Downloading Mid-2 Schedule PDF')}>
                Download Schedule
              </Button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-app-text">Semester 1 End Examinations Final Schedule (Archive)</p>
                <p className="text-[11px] text-app-muted">Conducted January 2026 • Regular & Supplementary</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => alert('[Sandbox Preview] Downloading Sem-1 Archive Schedule PDF')}>
                Download Archive
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Question Papers */}
      {activeTab === 'question_papers' && (
        <div className="bg-app-surface border border-app-border rounded p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-app-border">
            <h2 className="text-sm font-semibold text-app-text">University Question Paper Archive</h2>
            <span className="text-app-muted font-mono">{questionPapers.length} archival sets</span>
          </div>

          <div className="divide-y divide-app-border">
            {questionPapers.map((qp) => (
              <div key={qp.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-app-text">{qp.title}</p>
                  <p className="text-[11px] text-app-muted">
                    {qp.department} • {qp.fileSize} • Published {qp.publishedDate}
                  </p>
                </div>
                {qp.hasSampleDownload ? (
                  <Button variant="outline" size="sm" onClick={() => alert(`[Sandbox Preview] Downloading ${qp.title}`)}>
                    Download PDF
                  </Button>
                ) : (
                  <span className="text-[11px] text-app-muted italic">Library Reserve Copy</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Application Forms with working submit & status */}
      {activeTab === 'forms' && (
        <div className="space-y-5">
          <div className="bg-app-surface border border-app-border rounded p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-app-text">Student Examination Service Requests</h2>
              <p className="text-xs text-app-muted mt-0.5">
                Submit requests for paper recounting, duplicate certificates, or migration affidavits.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSubmitFormOpen(true)}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Apply New Request
            </Button>
          </div>

          {/* Form Submissions History Table */}
          <div className="bg-app-surface border border-app-border rounded p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
              Submitted Service Requests ({examForms.length})
            </h3>

            <div className="divide-y divide-app-border text-xs">
              {examForms.map((form) => (
                <div key={form.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-app-text">{form.formType}</span>
                      <span className="text-app-muted font-mono">• {form.appliedDate}</span>
                      <span className="text-app-muted">• {form.semester}</span>
                    </div>
                    <p className="text-app-muted">{form.details}</p>
                  </div>
                  <Badge
                    variant={
                      form.status === 'Approved'
                        ? 'success'
                        : form.status === 'Submitted'
                        ? 'accent'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {form.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Malpractice Rules */}
      {activeTab === 'malpractice' && (
        <div className="bg-app-surface border border-app-border rounded p-5 sm:p-6 space-y-4 text-xs leading-relaxed text-app-muted">
          <div className="flex items-center gap-2 pb-2 border-b border-app-border text-app-danger font-semibold">
            <ShieldAlert className="w-5 h-5 text-app-danger" />
            <h2 className="text-sm">Statutory Examination Malpractice Consequences</h2>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
              <p className="font-semibold text-app-text">Clause 1: Possession of Unauthorized Materials</p>
              <p>Possession of paper chits, books, programmable calculators or unauthorized electronic gear in the examination hall entails immediate cancellation of performance in that subject.</p>
            </div>

            <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
              <p className="font-semibold text-app-text">Clause 2: Mobile Phones & Smart Watches</p>
              <p>Carrying smart watches or mobile devices inside examination halls is strictly prohibited. Confiscation for the remaining semester duration applies along with a disciplinary inquiry.</p>
            </div>

            <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
              <p className="font-semibold text-app-text">Clause 3: Impersonation & Forgery</p>
              <p>Impersonation will result in permanent expulsion from the institution and legal referral under national public examination integrity acts.</p>
            </div>
          </div>
        </div>
      )}

      {/* Apply Form Modal */}
      <Modal
        isOpen={isSubmitFormOpen}
        onClose={() => setIsSubmitFormOpen(false)}
        title="Apply for Examination Service"
        subtitle="Submitted to Controller of Examinations"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          {formSuccess ? (
            <div className="p-4 bg-app-success/10 border border-app-success/20 rounded text-center text-app-success space-y-1">
              <Check className="w-6 h-6 mx-auto" />
              <p className="font-semibold">Application Submitted Successfully</p>
              <p className="text-[11px] text-app-muted">Your service ticket has been filed with the cell.</p>
            </div>
          ) : (
            <form onSubmit={handleApplyForm} className="space-y-3">
              <div>
                <label className="block font-medium text-app-text mb-1">Service Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full h-9 px-2 bg-app-bg border border-app-border rounded text-app-text"
                >
                  <option value="Revaluation / Recounting">Revaluation / Recounting</option>
                  <option value="Duplicate Hall Ticket">Duplicate Hall Ticket</option>
                  <option value="Migration Certificate">Migration Certificate</option>
                  <option value="Name Correction">Name Correction</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-app-text mb-1">Target Semester</label>
                <select
                  value={formSemester}
                  onChange={(e) => setFormSemester(e.target.value)}
                  className="w-full h-9 px-2 bg-app-bg border border-app-border rounded text-app-text"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-app-text mb-1">Subject Code & Specific Grounds</label>
                <textarea
                  rows={3}
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  placeholder="e.g. Seeking script photo-copy verification for Thermal Engineering (23ME102)..."
                  className="w-full p-2.5 bg-app-bg border border-app-border rounded text-app-text"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsSubmitFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

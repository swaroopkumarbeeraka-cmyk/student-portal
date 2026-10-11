import React, { useState } from 'react';
import {
  MessageSquarePlus,
  History,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  Inbox
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { SuggestionComplaint } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const ComplaintsPage: React.FC = () => {
  const { complaints, addComplaint } = usePortal();

  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [recipient, setRecipient] = useState<SuggestionComplaint['recipient']>('IT Helpdesk');
  const [category, setCategory] = useState<SuggestionComplaint['category']>('Infrastructure');
  const [remarks, setRemarks] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SuggestionComplaint | null>(null);
  const [successTicket, setSuccessTicket] = useState<SuggestionComplaint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (remarks.trim().length < 15) {
      setError('Please provide at least 15 characters describing the issue or suggestion clearly.');
      return;
    }

    const created = addComplaint(recipient, category, remarks);
    setRemarks('');
    setSuccessTicket(created);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Student Corner', path: '/student-corner' },
          { label: 'Suggestions & Complaints' }
        ]}
      />

      {/* Header with tab switch */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Suggestions & Grievances Desk
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Submit institutional feedback, facility maintenance requests, or academic grievances
          </p>
        </div>

        <div className="flex items-center gap-1 bg-app-surface p-1 rounded border border-app-border text-xs">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'new'
                ? 'bg-app-accent text-white font-medium'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>New Grievance</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-app-accent text-white font-medium'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Track History ({complaints.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'new' ? (
        /* New Grievance Form */
        <div className="bg-app-surface border border-app-border rounded p-5 sm:p-6 space-y-5">
          {successTicket ? (
            <div className="py-6 text-center space-y-4 max-w-md mx-auto">
              <CheckCircle2 className="w-12 h-12 text-app-success mx-auto" />
              <div>
                <h2 className="text-base font-semibold text-app-text">
                  Grievance Ticket Registered
                </h2>
                <p className="text-xs font-mono text-app-accent font-bold mt-1">
                  Ticket No: {successTicket.ticketNumber}
                </p>
                <p className="text-xs text-app-muted mt-2 leading-relaxed">
                  Your ticket has been dispatched to {successTicket.recipient}. You can track action timelines in the History tab.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSuccessTicket(null)}
                >
                  Submit Another
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSuccessTicket(null);
                    setActiveTab('history');
                  }}
                >
                  View Status Timeline
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-app-border">
                <MessageSquarePlus className="w-4 h-4 text-app-accent" />
                <h2 className="text-sm font-semibold text-app-text">File a Grievance or Suggestion</h2>
              </div>

              {error && (
                <div className="p-3 rounded bg-app-danger/10 border border-app-danger/20 text-xs text-app-danger">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-app-text mb-1">
                    Designated Section / Authority
                  </label>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value as any)}
                    className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text focus:outline-none focus:border-app-accent"
                  >
                    <option value="IT Helpdesk">IT Helpdesk (Wi-Fi, Systems, Portal)</option>
                    <option value="Dean Academics">Dean Academics (Faculty, Electives)</option>
                    <option value="Examination Cell">Examination Cell (Hall Tickets, Marks)</option>
                    <option value="Transport Section">Transport Section (Buses, Routes)</option>
                    <option value="Hostel Warden">Hostel Warden (Rooms, Maintenance)</option>
                    <option value="Library">Library (Books, Digital Terminals)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-app-text mb-1">
                    Grievance Classification
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text focus:outline-none focus:border-app-accent"
                  >
                    <option value="Infrastructure">Infrastructure & Hardware</option>
                    <option value="Academic">Academic Curriculum</option>
                    <option value="Cleanliness">Cleanliness & Sanitation</option>
                    <option value="Transport">Transport & Commute</option>
                    <option value="Library">Library & Reading Space</option>
                    <option value="Hostel">Hostel Facilities</option>
                    <option value="Other">Other / General Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-app-text">
                    Detailed Remarks & Specifics
                  </label>
                  <span className="text-[11px] text-app-muted font-mono">
                    {remarks.length} / 500 characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Provide precise location, room number, or incident details to assist maintenance engineers..."
                  className="w-full p-3 text-xs bg-app-bg border border-app-border rounded text-app-text focus:outline-none focus:border-app-accent"
                  required
                />
              </div>

              <div className="p-3 bg-app-bg border border-app-border rounded text-xs text-app-muted flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-app-accent shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Confidentiality guarantee: Grievances are reviewed by the appointed student welfare committee and institutional ombudsman.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setRemarks('')}
                >
                  Clear Fields
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Send className="w-4 h-4" />}
                >
                  Register Ticket
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* History & Timeline Table */
        <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-app-border">
            <h2 className="text-sm font-semibold text-app-text">Grievance Audit History</h2>
            <span className="text-xs text-app-muted font-mono">{complaints.length} tickets filed</span>
          </div>

          {complaints.length === 0 ? (
            <div className="p-8 text-center text-xs text-app-muted">
              No grievance tickets filed yet.
            </div>
          ) : (
            <div className="divide-y divide-app-border">
              {complaints.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedTicket(item)}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-app-bg/50 p-2 rounded cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-app-accent">
                        {item.ticketNumber}
                      </span>
                      <Badge variant="neutral" size="sm">
                        {item.category}
                      </Badge>
                      <span className="text-app-muted">• {item.recipient}</span>
                      <span className="text-app-muted">• {item.submittedDate}</span>
                    </div>
                    <p className="text-app-text line-clamp-1">{item.remarks}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant={
                        item.status === 'Resolved'
                          ? 'success'
                          : item.status === 'In Progress'
                          ? 'accent'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-app-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ticket Status Timeline Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket ${selectedTicket.ticketNumber}`}
          subtitle={`${selectedTicket.category} • Assigned to ${selectedTicket.recipient}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            {/* Ticket details */}
            <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
              <span className="text-app-muted block">Student Remarks:</span>
              <p className="text-app-text leading-relaxed">{selectedTicket.remarks}</p>
            </div>

            {/* Audit Timeline */}
            <div>
              <p className="font-semibold text-app-text mb-3 uppercase tracking-wider text-[11px]">
                Status Audit Trail
              </p>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-app-border">
                {selectedTicket.timeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-app-accent text-white flex items-center justify-center text-[10px] ring-4 ring-app-surface">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-app-text">{step.status}</span>
                        <span className="text-[10px] font-mono text-app-muted">{step.timestamp}</span>
                      </div>
                      <p className="text-app-muted mt-0.5">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedTicket(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

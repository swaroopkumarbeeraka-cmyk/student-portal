import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  GraduationCap,
  CreditCard,
  CalendarDays,
  FileText,
  Bot,
  AlertCircle,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  Send,
  MessageSquarePlus,
  History,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const {
    student,
    attendance,
    academics,
    fees,
    timetable,
    notices,
    selfDeclaration,
    complaints,
    addComplaint,
    isReadOnlyYear
  } = usePortal();

  const navigate = useNavigate();

  // Complaints widget tab state
  const [complaintTab, setComplaintTab] = useState<'new' | 'history'>('new');
  const [complaintRecipient, setComplaintRecipient] = useState<'IT Helpdesk' | 'Dean Academics' | 'Hostel Warden' | 'Transport Section' | 'Library'>('IT Helpdesk');
  const [complaintCategory, setComplaintCategory] = useState<'Infrastructure' | 'Academic' | 'Cleanliness' | 'Transport' | 'Library'>('Infrastructure');
  const [complaintRemarks, setComplaintRemarks] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Compute live period status for today
  // Assume today is Monday for demo timetable preview or current day
  const todaySchedule = timetable[0]; // Monday CSE AI
  // Add live status based on simulated period index
  const periodsWithStatus = todaySchedule.periods.map((p, idx) => {
    // Period 1 done, Period 2 now, Period 3 next, rest upcoming
    if (idx === 0) return { ...p, status: 'done' as const };
    if (idx === 1) return { ...p, status: 'now' as const };
    if (idx === 2) return { ...p, status: 'next' as const };
    return { ...p, status: 'upcoming' as const };
  });

  const latestExam = academics.exams.find((e) => e.isLatest) || academics.exams[0];
  const lowestSubject = latestExam?.subjects.find((s) => s.isLowest);

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintRemarks.trim()) return;

    addComplaint(complaintRecipient, complaintCategory, complaintRemarks);
    setComplaintRemarks('');
    setComplaintSuccess(true);
    setTimeout(() => {
      setComplaintSuccess(false);
      setComplaintTab('history');
    }, 1200);
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Greeting & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Welcome back, {student.name}
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            {student.course} {student.specialization} • Year {student.year} Semester {student.semester} • Section {student.section}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-app-muted">
          <Calendar className="w-3.5 h-3.5 text-app-accent" />
          <span>{currentDateFormatted}</span>
        </div>
      </div>

      {/* 2. Pending Action Banner (Only visible if Self-Declaration is not yet submitted) */}
      {!selfDeclaration.isSubmitted && (
        <div className="p-4 rounded border border-[#B7791F]/30 bg-[#B7791F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-app-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-app-text">
                Pending Action: Student Self-Declaration Form 2026-27 Due
              </p>
              <p className="text-xs text-app-muted mt-0.5 leading-relaxed">
                Mandatory submission required by 20 October 2026 covering academic honor code and statutory anti-ragging undertakings.
              </p>
            </div>
          </div>
          <Link to="/declaration" className="shrink-0">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Complete Form Now
            </Button>
          </Link>
        </div>
      )}

      {/* 3. Three Primary Metrics Summaries (Attendance, Academics, Fees) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Attendance Summary */}
        <Link
          to="/attendance"
          className="p-4 bg-app-surface border border-app-border rounded hover:border-app-accent transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                Attendance Status
              </span>
              <div className="p-1.5 rounded bg-app-accent/10 text-app-accent group-hover:bg-app-accent group-hover:text-white transition-colors">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold font-mono text-app-text tabular-nums">
                {attendance.overallPercentage}%
              </span>
              <Badge
                variant={
                  attendance.overallPercentage >= 75
                    ? 'success'
                    : attendance.overallPercentage >= 65
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
              >
                {attendance.overallPercentage >= 75 ? 'Safe' : 'Warning'}
              </Badge>
            </div>

            {/* Slim progress bar */}
            <div className="w-full bg-app-border h-1.5 rounded-full overflow-hidden mb-2.5">
              <div
                className={`h-full ${
                  attendance.overallPercentage >= 75 ? 'bg-app-success' : 'bg-app-danger'
                }`}
                style={{ width: `${Math.min(100, attendance.overallPercentage)}%` }}
              />
            </div>

            <p className="text-xs text-app-muted">
              <span className="font-mono font-medium text-app-text">{attendance.overallPresent}</span> present of{' '}
              <span className="font-mono font-medium text-app-text">{attendance.overallWorkingDays}</span> working days.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-app-border flex items-center justify-between text-xs text-app-accent font-medium">
            <span>View monthly breakdown</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        {/* Academics Summary */}
        <Link
          to="/academics"
          className="p-4 bg-app-surface border border-app-border rounded hover:border-app-accent transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                Academic Progress
              </span>
              <div className="p-1.5 rounded bg-app-accent/10 text-app-accent group-hover:bg-app-accent group-hover:text-white transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold font-mono text-app-text tabular-nums">
                {academics.cgpa}
              </span>
              <span className="text-xs text-app-muted">CGPA / 10.0</span>
            </div>

            <p className="text-xs text-app-text font-medium mt-1">
              Latest: {latestExam?.name}
            </p>
            <p className="text-xs text-app-muted mt-0.5">
              Scored <span className="font-mono font-medium text-app-text">{latestExam?.scoredTotal}/{latestExam?.maxTotal}</span> ({latestExam?.percentage}% avg)
            </p>
            {lowestSubject && (
              <p className="text-[11px] text-app-muted mt-1 truncate">
                Focus subject: <span className="text-app-warning font-medium">{lowestSubject.name}</span> ({lowestSubject.percentage}%)
              </p>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-app-border flex items-center justify-between text-xs text-app-accent font-medium">
            <span>View scorecards & ranks</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        {/* Fees Summary */}
        <Link
          to="/fees"
          className="p-4 bg-app-surface border border-app-border rounded hover:border-app-accent transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                Fee Dues & Ledger
              </span>
              <div className="p-1.5 rounded bg-app-accent/10 text-app-accent group-hover:bg-app-accent group-hover:text-white transition-colors">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold font-mono text-app-text tabular-nums">
                ₹{fees.outstandingAmount.toLocaleString('en-IN')}
              </span>
              <Badge
                variant={fees.outstandingAmount === 0 ? 'success' : 'warning'}
                size="sm"
              >
                {fees.overallStatus}
              </Badge>
            </div>

            <p className="text-xs text-app-muted mt-1">
              Total: ₹{fees.totalAmount.toLocaleString('en-IN')} | Paid: ₹{fees.paidAmount.toLocaleString('en-IN')} ({fees.percentPaid}%)
            </p>
            <p className="text-[11px] text-app-muted mt-1">
              Term 2 Due: <span className="text-app-text font-medium">15 Nov 2026</span> (₹40,000 remaining)
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-app-border flex items-center justify-between text-xs text-app-accent font-medium">
            <span>{fees.outstandingAmount > 0 && !isReadOnlyYear ? 'Pay online or download receipt' : 'View payment history'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* 4. Quick Actions Grid (6 Actions) */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
            { label: 'Exam Results', path: '/academics', icon: GraduationCap },
            { label: 'Timetable', path: '/planner/timetable', icon: CalendarDays },
            { label: 'Pay Fees', path: '/fees', icon: CreditCard },
            { label: 'Notices', path: '/notices', icon: FileText },
            { label: 'AI Assistant', path: '/ai-assistant', icon: Bot }
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                to={action.path}
                className="p-3 bg-app-surface border border-app-border rounded hover:border-app-accent text-center group transition-colors flex flex-col items-center justify-center gap-1.5"
              >
                <div className="p-2 rounded bg-app-bg text-app-accent group-hover:bg-app-accent group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-app-text group-hover:text-app-accent transition-colors">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. Middle Split: Today's Timetable + Upcoming Events & Next Exam */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-app-surface border border-app-border rounded p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-app-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-app-accent" />
                <h2 className="text-sm font-semibold text-app-text">
                  Today's Schedule ({todaySchedule.day})
                </h2>
              </div>
              <Link
                to="/planner/timetable"
                className="text-xs text-app-accent hover:underline flex items-center gap-1 font-medium"
              >
                Full weekly timetable
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-app-border">
              {periodsWithStatus.map((period) => (
                <div
                  key={period.periodNumber}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-[11px] font-mono text-app-muted">
                      P{period.periodNumber}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-app-text truncate">{period.subjectName}</p>
                      <p className="text-[11px] text-app-muted">
                        {period.room} • {period.facultyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-app-muted">{period.timeRange}</span>
                    {period.status === 'done' && (
                      <Badge variant="neutral" size="sm">
                        Done
                      </Badge>
                    )}
                    {period.status === 'now' && (
                      <Badge variant="accent" size="sm">
                        Now
                      </Badge>
                    )}
                    {period.status === 'next' && (
                      <Badge variant="warning" size="sm">
                        Next
                      </Badge>
                    )}
                    {period.status === 'upcoming' && (
                      <span className="text-[11px] text-app-muted">Upcoming</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-app-border bg-app-bg/40 -mx-4 -mb-4 p-3 rounded-b flex items-center justify-between text-xs text-app-muted">
            <span>Next session: BCME (Mechanical) in LH-104</span>
            <span className="font-mono">Starts 01:30 PM</span>
          </div>
        </div>

        {/* Next Exam Card + Quick Highlights */}
        <div className="space-y-4">
          {/* Next Exam Card */}
          <div className="p-4 bg-app-surface border border-app-border rounded space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
                Next Assessment
              </span>
              <Badge variant="accent" size="sm">
                Upcoming
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-app-text">
                Mid-Semester Examination 2 (Mid-2)
              </h3>
              <p className="text-xs text-app-muted mt-0.5">Commences 18 Nov 2026</p>
            </div>

            <div className="p-2.5 bg-app-bg border border-app-border rounded text-xs space-y-1">
              <p className="text-app-text font-medium">Eligibility Checklist:</p>
              <div className="flex items-center justify-between text-app-muted text-[11px]">
                <span>Attendance Cutoff (75%):</span>
                <span className="text-app-success font-medium">80.0% (Eligible)</span>
              </div>
              <div className="flex items-center justify-between text-app-muted text-[11px]">
                <span>Self-Declaration:</span>
                <span className={selfDeclaration.isSubmitted ? 'text-app-success' : 'text-app-warning font-medium'}>
                  {selfDeclaration.isSubmitted ? 'Submitted' : 'Pending'}
                </span>
              </div>
            </div>

            <Link to="/examination/timetables" className="block">
              <Button variant="outline" size="sm" className="w-full">
                View Examination Schedule
              </Button>
            </Link>
          </div>

          {/* Quick Notice Teaser */}
          <div className="p-4 bg-app-surface border border-app-border rounded space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
                Official Notices
              </span>
              <Link to="/notices" className="text-xs text-app-accent hover:underline">
                All (8)
              </Link>
            </div>

            <div className="space-y-2">
              {notices.slice(0, 3).map((notice) => (
                <Link
                  key={notice.id}
                  to={`/notices/${notice.id}`}
                  className="block p-2 rounded hover:bg-app-bg transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <Badge variant={notice.isUrgent ? 'danger' : 'neutral'} size="sm">
                      {notice.category}
                    </Badge>
                    <span className="text-[10px] text-app-muted">{notice.date}</span>
                  </div>
                  <p className="text-xs font-medium text-app-text group-hover:text-app-accent line-clamp-1">
                    {notice.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Section: Compact Suggestions & Complaints Widget */}
      <div className="bg-app-surface border border-app-border rounded p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-app-border">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-app-accent" />
            <h2 className="text-sm font-semibold text-app-text">
              Suggestions & Grievances Desk
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-app-bg p-0.5 rounded border border-app-border text-xs">
            <button
              onClick={() => setComplaintTab('new')}
              className={`px-3 py-1 rounded transition-colors ${
                complaintTab === 'new'
                  ? 'bg-app-surface text-app-text font-medium shadow-none'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              New Ticket
            </button>
            <button
              onClick={() => setComplaintTab('history')}
              className={`px-3 py-1 rounded transition-colors ${
                complaintTab === 'history'
                  ? 'bg-app-surface text-app-text font-medium shadow-none'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              Recent History ({complaints.length})
            </button>
          </div>
        </div>

        {complaintTab === 'new' ? (
          <div>
            {complaintSuccess ? (
              <div className="p-4 bg-app-success/10 border border-app-success/20 rounded text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-app-success mx-auto" />
                <p className="text-xs font-semibold text-app-text">Grievance Ticket Registered</p>
                <p className="text-[11px] text-app-muted">Your complaint has been assigned to {complaintRecipient}.</p>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-app-text mb-1">
                      Recipient Authority
                    </label>
                    <select
                      value={complaintRecipient}
                      onChange={(e) => setComplaintRecipient(e.target.value as any)}
                      className="w-full h-9 px-2.5 text-xs bg-app-bg border border-app-border rounded text-app-text focus:outline-none focus:border-app-accent"
                    >
                      <option value="IT Helpdesk">IT Helpdesk</option>
                      <option value="Dean Academics">Dean Academics</option>
                      <option value="Hostel Warden">Hostel Warden</option>
                      <option value="Transport Section">Transport Section</option>
                      <option value="Library">Library</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-app-text mb-1">
                      Category
                    </label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value as any)}
                      className="w-full h-9 px-2.5 text-xs bg-app-bg border border-app-border rounded text-app-text focus:outline-none focus:border-app-accent"
                    >
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Academic">Academic</option>
                      <option value="Cleanliness">Cleanliness</option>
                      <option value="Transport">Transport</option>
                      <option value="Library">Library</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-app-text">
                      Grievance / Feedback Remarks
                    </label>
                    <span className="text-[11px] text-app-muted">{complaintRemarks.length} / 500</span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={500}
                    value={complaintRemarks}
                    onChange={(e) => setComplaintRemarks(e.target.value)}
                    placeholder="Describe the issue with specific location details..."
                    className="w-full p-2.5 text-xs bg-app-bg border border-app-border rounded text-app-text focus:outline-none focus:border-app-accent"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    to="/student-corner/complaints"
                    className="text-xs text-app-accent hover:underline flex items-center gap-1"
                  >
                    Open full grievances desk
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                    Submit Grievance
                  </Button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="divide-y divide-app-border">
              {complaints.slice(0, 3).map((item) => (
                <div key={item.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-app-text">{item.ticketNumber}</span>
                      <span className="text-app-muted">• {item.recipient}</span>
                      <span className="text-app-muted">• {item.submittedDate}</span>
                    </div>
                    <p className="text-app-muted line-clamp-1">{item.remarks}</p>
                  </div>
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
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <Link
                to="/student-corner/complaints"
                className="text-xs text-app-accent hover:underline font-medium inline-flex items-center gap-1"
              >
                View complete complaints audit history
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

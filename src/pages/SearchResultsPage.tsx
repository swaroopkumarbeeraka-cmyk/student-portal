import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  FileText,
  BookOpen,
  CalendarCheck,
  CreditCard,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);

  const { notices, documents, timetable } = usePortal();

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const q = searchTerm.trim().toLowerCase();

  // 1. Search Portal Pages
  const allPages = [
    { title: 'Dashboard', desc: 'Main portal overview and student summaries', path: '/' },
    { title: 'Attendance Record', desc: 'Overall percentage, daily logs and monthly chart', path: '/attendance' },
    { title: 'Academics & Examination Results', desc: 'CGPA, Mid-1, Sem-1 marks, ranks and grading scale', path: '/academics' },
    { title: 'Competitive & National Exams', desc: 'GATE, TCS CodeVita, NPTEL scores', path: '/competitive-exams' },
    { title: 'Fees & Payments', desc: 'Term installments, payment gateway sandbox, receipt downloads', path: '/fees' },
    { title: 'Study Planner Tasks', desc: 'Personal study task manager and goals', path: '/planner/tasks' },
    { title: 'Coursework Assignments', desc: 'Official LMS homework and lab submissions', path: '/planner/assignments' },
    { title: 'Weekly Timetable', desc: 'Day and week period schedules', path: '/planner/timetable' },
    { title: 'Academic Calendar', desc: 'Autonomous examination milestones and holidays', path: '/planner/calendar' },
    { title: 'Campus Notices', desc: 'Administrative circulars and announcements', path: '/notices' },
    { title: 'Syllabus & Documents', desc: 'Regulations R23, course outlines, question papers', path: '/documents' },
    { title: 'Campus AI Assistant', desc: 'Interactive rule-grounded chatbot', path: '/ai-assistant' },
    { title: 'Suggestions & Grievances Desk', desc: 'File and track maintenance and academic tickets', path: '/student-corner/complaints' },
    { title: 'Auditorium & Halls Booking', desc: 'Reserve seminar halls for student chapter events', path: '/student-corner/seminar-halls' },
    { title: 'Student Profile', desc: 'Roll number, student code, change security PIN', path: '/profile' },
    { title: 'Settings', desc: 'Themes, accessibility text size, demo controls', path: '/settings' },
    { title: 'Help & FAQs', desc: 'Attendance rules, fee policies, student support', path: '/help' }
  ];

  const matchedPages = q
    ? allPages.filter(
        (p) => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      )
    : [];

  // 2. Search Notices
  const matchedNotices = q
    ? notices.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      )
    : [];

  // 3. Search Documents
  const matchedDocuments = q
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q)
      )
    : [];

  // 4. Search Subjects in Timetable
  const matchedSubjects = q
    ? timetable
        .flatMap((day) => day.periods)
        .filter((p) => p.subjectName.toLowerCase().includes(q) || p.subjectCode.toLowerCase().includes(q))
        .filter((v, i, a) => a.findIndex((t) => t.subjectCode === v.subjectCode) === i)
    : [];

  const totalResults =
    matchedPages.length + matchedNotices.length + matchedDocuments.length + matchedSubjects.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'Search Results' }]} />

      {/* Search Header */}
      <div className="pb-2 border-b border-app-border space-y-3">
        <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
          Portal Global Search
        </h1>

        <div className="relative">
          <Search className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search portal pages, notices, documents, subjects..."
            className="w-full h-10 pl-9 pr-4 text-xs bg-app-surface border border-app-border rounded text-app-text focus:outline-none focus:border-app-accent"
          />
        </div>

        {q && (
          <p className="text-xs text-app-muted">
            Found <span className="font-semibold text-app-text">{totalResults}</span> results for query{' '}
            <span className="font-semibold text-app-text">"{searchTerm}"</span>
          </p>
        )}
      </div>

      {totalResults === 0 && q ? (
        <div className="p-10 bg-app-surface border border-app-border rounded text-center text-xs text-app-muted space-y-2">
          <Search className="w-8 h-8 text-app-muted mx-auto" />
          <h2 className="text-sm font-semibold text-app-text">No Results Found</h2>
          <p>Try searching for "attendance", "fee", "chemistry", "thermal", or "exam".</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Matched Pages */}
          {matchedPages.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                Portal Sections & Pages ({matchedPages.length})
              </h2>
              <div className="bg-app-surface border border-app-border rounded divide-y divide-app-border">
                {matchedPages.map((page, i) => (
                  <Link
                    key={i}
                    to={page.path}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-app-bg transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-app-text group-hover:text-app-accent">
                        {page.title}
                      </p>
                      <p className="text-app-muted mt-0.5">{page.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-app-muted group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matched Notices */}
          {matchedNotices.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                Notices & Circulars ({matchedNotices.length})
              </h2>
              <div className="bg-app-surface border border-app-border rounded divide-y divide-app-border">
                {matchedNotices.map((notice) => (
                  <Link
                    key={notice.id}
                    to={`/notices/${notice.id}`}
                    className="p-3.5 flex items-start justify-between gap-3 text-xs hover:bg-app-bg transition-colors group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={notice.isUrgent ? 'danger' : 'neutral'} size="sm">
                          {notice.category}
                        </Badge>
                        <span className="font-mono text-[10px] text-app-muted">{notice.date}</span>
                      </div>
                      <p className="font-semibold text-app-text group-hover:text-app-accent">
                        {notice.title}
                      </p>
                      <p className="text-app-muted line-clamp-1">{notice.content}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-app-muted shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matched Documents */}
          {matchedDocuments.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                Documents & Regulations ({matchedDocuments.length})
              </h2>
              <div className="bg-app-surface border border-app-border rounded divide-y divide-app-border">
                {matchedDocuments.map((doc) => (
                  <Link
                    key={doc.id}
                    to="/documents"
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-app-bg transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="neutral" size="sm">{doc.category}</Badge>
                        <span className="text-[10px] text-app-muted">{doc.department}</span>
                      </div>
                      <p className="font-semibold text-app-text group-hover:text-app-accent">
                        {doc.title}
                      </p>
                      <p className="text-app-muted line-clamp-1 mt-0.5">{doc.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-app-muted shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matched Subjects */}
          {matchedSubjects.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                Subjects & Courses ({matchedSubjects.length})
              </h2>
              <div className="bg-app-surface border border-app-border rounded divide-y divide-app-border">
                {matchedSubjects.map((sub, i) => (
                  <Link
                    key={i}
                    to="/planner/timetable"
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-app-bg transition-colors group"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-app-muted block">{sub.subjectCode}</span>
                      <p className="font-semibold text-app-text group-hover:text-app-accent">
                        {sub.subjectName}
                      </p>
                      <p className="text-app-muted text-[11px] mt-0.5">
                        Room: {sub.room} • Instructor: {sub.facultyName}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-app-muted shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

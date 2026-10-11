import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  Award,
  CreditCard,
  Building2,
  FileCheck2,
  Briefcase,
  Users2,
  CalendarDays,
  FileText,
  Bot,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  X,
  FileSignature
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { selfDeclaration } = usePortal();

  // Collapsible groups state
  const [departmentsOpen, setDepartmentsOpen] = useState(
    () => location.pathname.startsWith('/departments')
  );
  const [plannerOpen, setPlannerOpen] = useState(
    () => location.pathname.startsWith('/planner')
  );
  const [examOpen, setExamOpen] = useState(
    () => location.pathname.startsWith('/examination')
  );
  const [studentCornerOpen, setStudentCornerOpen] = useState(
    () => location.pathname.startsWith('/student-corner')
  );
  const [placementsOpen, setPlacementsOpen] = useState(
    () => location.pathname.startsWith('/placements')
  );

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded transition-colors select-none ${
      isActive
        ? 'bg-app-accent/10 text-app-accent font-semibold border-l-2 border-app-accent rounded-l-none'
        : 'text-app-text hover:bg-app-bg hover:text-app-accent'
    }`;

  const subNavItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-1.5 text-[11px] font-medium rounded transition-colors select-none pl-8 ${
      isActive
        ? 'text-app-accent font-semibold bg-app-accent/5'
        : 'text-app-muted hover:text-app-text hover:bg-app-bg'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-14 h-full lg:h-[calc(100vh-3.5rem)] w-64 bg-app-surface border-r border-app-border z-50 lg:z-30 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in drawer */}
        <div className="flex items-center justify-between p-4 border-b border-app-border lg:hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-app-muted">
            Navigation Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1 rounded text-app-muted hover:text-app-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Main Core Section */}
          <div className="space-y-0.5">
            <NavLink to="/" end className={navItemClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/attendance" className={navItemClass} onClick={onClose}>
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <span>Attendance</span>
            </NavLink>

            <NavLink to="/academics" className={navItemClass} onClick={onClose}>
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Academics & Results</span>
            </NavLink>

            <NavLink to="/competitive-exams" className={navItemClass} onClick={onClose}>
              <Award className="w-4 h-4 shrink-0" />
              <span>Competitive Exams</span>
            </NavLink>

            <NavLink to="/fees" className={navItemClass} onClick={onClose}>
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Fees & Payments</span>
            </NavLink>

            {!selfDeclaration.isSubmitted && (
              <NavLink to="/declaration" className={navItemClass} onClick={onClose}>
                <FileSignature className="w-4 h-4 shrink-0 text-app-warning" />
                <span className="flex-1">Self-Declaration</span>
                <span className="w-2 h-2 rounded-full bg-app-warning" />
              </NavLink>
            )}
          </div>

          <div className="pt-3 pb-1">
            <p className="px-3 text-[10px] font-semibold text-app-muted uppercase tracking-wider">
              Academics & Campus
            </p>
          </div>

          {/* Study Planner Group */}
          <div>
            <button
              onClick={() => setPlannerOpen(!plannerOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-app-text hover:bg-app-bg rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 shrink-0 text-app-muted" />
                <span>Study Planner</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-app-muted transition-transform duration-150 ${
                  plannerOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {plannerOpen && (
              <div className="space-y-0.5 my-1">
                <NavLink to="/planner/tasks" className={subNavItemClass} onClick={onClose}>
                  Personal Tasks
                </NavLink>
                <NavLink to="/planner/assignments" className={subNavItemClass} onClick={onClose}>
                  Assignments
                </NavLink>
                <NavLink to="/planner/timetable" className={subNavItemClass} onClick={onClose}>
                  Timetable
                </NavLink>
                <NavLink to="/planner/calendar" className={subNavItemClass} onClick={onClose}>
                  Academic Calendar
                </NavLink>
              </div>
            )}
          </div>

          {/* Departments Group */}
          <div>
            <button
              onClick={() => setDepartmentsOpen(!departmentsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-app-text hover:bg-app-bg rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 shrink-0 text-app-muted" />
                <span>Departments</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-app-muted transition-transform duration-150 ${
                  departmentsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {departmentsOpen && (
              <div className="space-y-0.5 my-1">
                <NavLink to="/departments" end className={subNavItemClass} onClick={onClose}>
                  All Departments Overview
                </NavLink>
                <NavLink to="/departments/cse" className={subNavItemClass} onClick={onClose}>
                  CSE (AI, AIML, DS)
                </NavLink>
                <NavLink to="/departments/aiml" className={subNavItemClass} onClick={onClose}>
                  AI & ML
                </NavLink>
                <NavLink to="/departments/ece" className={subNavItemClass} onClick={onClose}>
                  ECE
                </NavLink>
                <NavLink to="/departments/eee" className={subNavItemClass} onClick={onClose}>
                  EEE
                </NavLink>
                <NavLink to="/departments/it" className={subNavItemClass} onClick={onClose}>
                  Information Technology
                </NavLink>
                <NavLink to="/departments/mechanical" className={subNavItemClass} onClick={onClose}>
                  Mechanical Engineering
                </NavLink>
                <NavLink to="/departments/civil" className={subNavItemClass} onClick={onClose}>
                  Civil Engineering
                </NavLink>
                <NavLink to="/departments/bsh" className={subNavItemClass} onClick={onClose}>
                  Basic Sciences & Humanities
                </NavLink>
                <NavLink to="/departments/mca" className={subNavItemClass} onClick={onClose}>
                  MCA
                </NavLink>
              </div>
            )}
          </div>

          {/* Examination Section Group */}
          <div>
            <button
              onClick={() => setExamOpen(!examOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-app-text hover:bg-app-bg rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 shrink-0 text-app-muted" />
                <span>Examination Section</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-app-muted transition-transform duration-150 ${
                  examOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {examOpen && (
              <div className="space-y-0.5 my-1">
                <NavLink to="/examination" end className={subNavItemClass} onClick={onClose}>
                  Cell Profile & Staff
                </NavLink>
                <NavLink to="/examination/notifications" className={subNavItemClass} onClick={onClose}>
                  Exam Notifications
                </NavLink>
                <NavLink to="/examination/timetables" className={subNavItemClass} onClick={onClose}>
                  Exam Timetables
                </NavLink>
                <NavLink to="/examination/question-papers" className={subNavItemClass} onClick={onClose}>
                  Question Papers Archive
                </NavLink>
                <NavLink to="/examination/forms" className={subNavItemClass} onClick={onClose}>
                  Application Forms
                </NavLink>
                <NavLink to="/examination/malpractice" className={subNavItemClass} onClick={onClose}>
                  Malpractice Rules
                </NavLink>
              </div>
            )}
          </div>

          {/* Placements Group */}
          <div>
            <button
              onClick={() => setPlacementsOpen(!placementsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-app-text hover:bg-app-bg rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 shrink-0 text-app-muted" />
                <span>Placements (T&P)</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-app-muted transition-transform duration-150 ${
                  placementsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {placementsOpen && (
              <div className="space-y-0.5 my-1">
                <NavLink to="/placements" end className={subNavItemClass} onClick={onClose}>
                  T&P Cell Profile
                </NavLink>
                <NavLink to="/placements/verification" className={subNavItemClass} onClick={onClose}>
                  Student Verification
                </NavLink>
                <NavLink to="/placements/tests" className={subNavItemClass} onClick={onClose}>
                  Contests & Mock Tests
                </NavLink>
                <NavLink to="/placements/coes-mous" className={subNavItemClass} onClick={onClose}>
                  CoEs & Industry MoUs
                </NavLink>
              </div>
            )}
          </div>

          {/* Student Corner Group */}
          <div>
            <button
              onClick={() => setStudentCornerOpen(!studentCornerOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-app-text hover:bg-app-bg rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users2 className="w-4 h-4 shrink-0 text-app-muted" />
                <span>Student Corner</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-app-muted transition-transform duration-150 ${
                  studentCornerOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {studentCornerOpen && (
              <div className="space-y-0.5 my-1">
                <NavLink to="/student-corner" end className={subNavItemClass} onClick={onClose}>
                  All Facilities Directory
                </NavLink>
                <NavLink to="/student-corner/seminar-halls" className={subNavItemClass} onClick={onClose}>
                  Halls & Auditorium Booking
                </NavLink>
                <NavLink to="/student-corner/complaints" className={subNavItemClass} onClick={onClose}>
                  Suggestions & Complaints
                </NavLink>
              </div>
            )}
          </div>

          {/* Documents & AI */}
          <div className="pt-2 space-y-0.5">
            <NavLink to="/documents" className={navItemClass} onClick={onClose}>
              <FileText className="w-4 h-4 shrink-0" />
              <span>Syllabus & Documents</span>
            </NavLink>

            <NavLink to="/notices" className={navItemClass} onClick={onClose}>
              <FileText className="w-4 h-4 shrink-0" />
              <span>Campus Notices</span>
            </NavLink>

            <NavLink to="/ai-assistant" className={navItemClass} onClick={onClose}>
              <Bot className="w-4 h-4 shrink-0 text-app-accent" />
              <span className="font-medium text-app-accent">Campus AI Assistant</span>
            </NavLink>
          </div>

          <div className="pt-3 pb-1">
            <p className="px-3 text-[10px] font-semibold text-app-muted uppercase tracking-wider">
              Account
            </p>
          </div>

          <div className="space-y-0.5">
            <NavLink to="/profile" className={navItemClass} onClick={onClose}>
              <User className="w-4 h-4 shrink-0" />
              <span>Profile</span>
            </NavLink>

            <NavLink to="/settings" className={navItemClass} onClick={onClose}>
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </NavLink>

            <NavLink to="/help" className={navItemClass} onClick={onClose}>
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Help & FAQs</span>
            </NavLink>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-app-border bg-app-bg/50 text-[11px] text-app-muted">
          <div className="flex items-center justify-between">
            <span>Prototype v1.0</span>
            <span className="text-[10px] bg-app-accent/10 text-app-accent px-1.5 py-0.5 rounded">
              Demo Mode
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

import {
  Student,
  AcademicYear,
  AttendanceData,
  AcademicData,
  FeesData,
  DayTimetable,
  Notice,
  PersonalTask,
  OfficialAssignment,
  CalendarEvent,
  DocumentItem,
  NotificationItem,
  CompetitiveExamResult,
  SuggestionComplaint,
  SelfDeclarationState,
  UserPreferences,
  SeminarHallBooking,
  ExamApplicationForm,
  PlacementRegistration,
  DepartmentData,
  FacilityData,
  FAQData,
  PlacementContest
} from '../types';
import {
  INITIAL_STUDENT,
  INITIAL_STUDENT_PREV,
  ATTENDANCE_2026_27,
  ATTENDANCE_2025_26,
  ACADEMICS_2026_27,
  ACADEMICS_2025_26,
  FEES_2026_27,
  FEES_2025_26,
  WEEKLY_TIMETABLE,
  MOCK_NOTICES,
  INITIAL_TASKS,
  OFFICIAL_ASSIGNMENTS,
  CALENDAR_EVENTS,
  MOCK_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  MOCK_COMPETITIVE_RESULTS,
  INITIAL_COMPLAINTS,
  INITIAL_SELF_DECLARATION,
  INITIAL_PREFERENCES,
  INITIAL_HALL_BOOKINGS,
  INITIAL_EXAM_FORMS,
  INITIAL_PLACEMENT_REG,
  MOCK_DEPARTMENTS,
  MOCK_FACILITIES,
  MOCK_FAQS,
  MOCK_CONTESTS
} from '../data/mockData';
import { isMockEnabled, apiFetch } from './api';

export class DataService {
  /**
   * Student Profile
   */
  async getStudent(year: AcademicYear = '2026-27'): Promise<Student> {
    if (isMockEnabled()) {
      return year === '2026-27' ? INITIAL_STUDENT : INITIAL_STUDENT_PREV;
    }
    return apiFetch<Student>(`/api/student?academicYear=${year}`);
  }

  /**
   * Attendance Data
   */
  async getAttendance(year: AcademicYear = '2026-27'): Promise<AttendanceData> {
    if (isMockEnabled()) {
      return year === '2026-27' ? ATTENDANCE_2026_27 : ATTENDANCE_2025_26;
    }
    return apiFetch<AttendanceData>(`/api/attendance?academicYear=${year}`);
  }

  /**
   * Academic Record
   */
  async getAcademics(year: AcademicYear = '2026-27'): Promise<AcademicData> {
    if (isMockEnabled()) {
      return year === '2026-27' ? ACADEMICS_2026_27 : ACADEMICS_2025_26;
    }
    return apiFetch<AcademicData>(`/api/academics?academicYear=${year}`);
  }

  /**
   * Fees & Ledger
   */
  async getFees(year: AcademicYear = '2026-27'): Promise<FeesData> {
    if (isMockEnabled()) {
      return year === '2026-27' ? FEES_2026_27 : FEES_2025_26;
    }
    return apiFetch<FeesData>(`/api/fees?academicYear=${year}`);
  }

  /**
   * Timetable
   */
  async getTimetable(): Promise<DayTimetable[]> {
    if (isMockEnabled()) {
      return WEEKLY_TIMETABLE;
    }
    return apiFetch<DayTimetable[]>('/api/timetable');
  }

  /**
   * Institutional Notices
   */
  async getNotices(): Promise<Notice[]> {
    if (isMockEnabled()) {
      return MOCK_NOTICES;
    }
    return apiFetch<Notice[]>('/api/notices');
  }

  async getNoticeById(id: string): Promise<Notice | undefined> {
    if (isMockEnabled()) {
      return MOCK_NOTICES.find((n) => n.id === id);
    }
    return apiFetch<Notice>(`/api/notices/${id}`);
  }

  /**
   * Official Coursework Assignments
   */
  async getAssignments(): Promise<OfficialAssignment[]> {
    if (isMockEnabled()) {
      return OFFICIAL_ASSIGNMENTS;
    }
    return apiFetch<OfficialAssignment[]>('/api/assignments');
  }

  /**
   * Academic Calendar Events
   */
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    if (isMockEnabled()) {
      return CALENDAR_EVENTS;
    }
    return apiFetch<CalendarEvent[]>('/api/calendar');
  }

  /**
   * Official Documents Repository
   */
  async getDocuments(): Promise<DocumentItem[]> {
    if (isMockEnabled()) {
      return MOCK_DOCUMENTS;
    }
    return apiFetch<DocumentItem[]>('/api/documents');
  }

  /**
   * Competitive Exam Scorecards
   */
  async getCompetitiveExams(): Promise<CompetitiveExamResult[]> {
    if (isMockEnabled()) {
      return MOCK_COMPETITIVE_RESULTS;
    }
    return apiFetch<CompetitiveExamResult[]>('/api/competitive-exams');
  }

  /**
   * Academic Departments
   */
  async getDepartments(): Promise<DepartmentData[]> {
    if (isMockEnabled()) {
      return MOCK_DEPARTMENTS;
    }
    return apiFetch<DepartmentData[]>('/api/departments');
  }

  async getDepartmentById(id: string): Promise<DepartmentData | undefined> {
    if (isMockEnabled()) {
      return MOCK_DEPARTMENTS.find((d) => d.id === id);
    }
    return apiFetch<DepartmentData>(`/api/departments/${id}`);
  }

  /**
   * Facilities Directory
   */
  async getFacilities(): Promise<FacilityData[]> {
    if (isMockEnabled()) {
      return MOCK_FACILITIES;
    }
    return apiFetch<FacilityData[]>('/api/facilities');
  }

  /**
   * Help FAQs
   */
  async getFAQs(): Promise<FAQData[]> {
    if (isMockEnabled()) {
      return MOCK_FAQS;
    }
    return apiFetch<FAQData[]>('/api/faqs');
  }

  /**
   * Placement Contests
   */
  async getPlacementContests(): Promise<PlacementContest[]> {
    if (isMockEnabled()) {
      return MOCK_CONTESTS;
    }
    return apiFetch<PlacementContest[]>('/api/placements/contests');
  }

  /**
   * Default Initial Seed States for Storage
   */
  getInitialSeedData() {
    return {
      student: INITIAL_STUDENT,
      studentPrev: INITIAL_STUDENT_PREV,
      attendance: ATTENDANCE_2026_27,
      attendancePrev: ATTENDANCE_2025_26,
      academics: ACADEMICS_2026_27,
      academicsPrev: ACADEMICS_2025_26,
      fees2026: FEES_2026_27,
      fees2025: FEES_2025_26,
      timetable: WEEKLY_TIMETABLE,
      notices: MOCK_NOTICES,
      assignments: OFFICIAL_ASSIGNMENTS,
      calendarEvents: CALENDAR_EVENTS,
      documents: MOCK_DOCUMENTS,
      competitiveResults: MOCK_COMPETITIVE_RESULTS,
      initialTasks: INITIAL_TASKS,
      initialComplaints: INITIAL_COMPLAINTS,
      initialNotifications: INITIAL_NOTIFICATIONS,
      initialSelfDeclaration: INITIAL_SELF_DECLARATION,
      initialPreferences: INITIAL_PREFERENCES,
      initialHallBookings: INITIAL_HALL_BOOKINGS,
      initialExamForms: INITIAL_EXAM_FORMS,
      initialPlacementReg: INITIAL_PLACEMENT_REG,
      departments: MOCK_DEPARTMENTS,
      facilities: MOCK_FACILITIES,
      faqs: MOCK_FAQS,
      contests: MOCK_CONTESTS
    };
  }
}

export const dataService = new DataService();

export type AcademicYear = '2026-27' | '2025-26';

export interface Student {
  name: string;
  rollNo: string;
  studentCode: string;
  course: string;
  branch: string;
  specialization: string;
  section: string;
  year: number;
  semester: number;
  email: string;
  phoneMasked: string;
  institutionName: string;
  institutionShortName: string;
  institutionLogoText: string;
  academicYear: AcademicYear;
}

export type DayAttendanceStatus = 'Present' | 'AbsentFull' | 'AbsentHalf' | 'Holiday' | 'Sunday';

export interface DailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  dayName: string;
  status: DayAttendanceStatus;
  remarks?: string;
}

export interface MonthlyAttendanceRecord {
  month: string; // "Jan", "Feb", etc.
  monthFullName: string;
  year: number;
  workingDays: number;
  presentDays: number;
  absentDays: number; // can be fractional like 1.5 if half-day
  percentage: number;
  dailyRecords: DailyAttendanceRecord[];
}

export interface AttendanceData {
  academicYear: AcademicYear;
  overallPresent: number;
  overallWorkingDays: number;
  overallAbsent: number;
  overallPercentage: number;
  requiredPercentage: number; // 75%
  maxPermissibleAbsences: number; // computed floor(P/T - W)
  records: MonthlyAttendanceRecord[];
}

export interface SubjectMark {
  code: string;
  name: string;
  maxMarks: number;
  scoredMarks: number;
  percentage: number;
  grade: string;
  isLowest?: boolean;
}

export interface ExamRecord {
  id: string;
  name: string;
  examType: 'Unit Test 1' | 'Unit Test 2' | 'Sem 1 Final' | 'Mid-1';
  date: string;
  isLatest?: boolean;
  isBest?: boolean;
  maxTotal: number;
  scoredTotal: number;
  percentage: number;
  averageMarks: number;
  subjects: SubjectMark[];
  rank?: number; // only if data has it
}

export interface AcademicData {
  academicYear: AcademicYear;
  cgpa: number;
  averageScorePercentage: number;
  examsCount: number;
  latestExamId: string;
  bestExamId: string;
  exams: ExamRecord[];
}

export interface CompetitiveExamResult {
  id: string;
  examName: string; // GATE 2026, CAT 2026, GRE, etc.
  registrationNo: string;
  attemptDate: string;
  score: string;
  rankOrPercentile: string;
  status: 'Qualified' | 'Appeared' | 'Awaited';
  validUntil: string;
  scorecardAvailable: boolean;
}

export type PaymentMethod = 'UPI' | 'Net Banking';
export type PaymentStatus = 'Success' | 'Pending' | 'Failed' | 'Cancelled';
export type FeeTermStatus = 'Paid' | 'Partially paid' | 'Due' | 'Overdue';

export interface FeeCategoryBreakdown {
  id: string;
  name: string;
  total: number;
  paid: number;
  outstanding: number;
}

export interface FeeTerm {
  id: string;
  name: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: FeeTermStatus;
}

export interface PaymentTransaction {
  id: string;
  txnId: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  termId: string;
  termName: string;
  referenceNo: string;
  receiptNumber: string;
  notes?: string;
}

export interface FeesData {
  academicYear: AcademicYear;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  percentPaid: number;
  overallStatus: 'Paid' | 'Partially paid' | 'Due' | 'Overdue';
  breakdown: FeeCategoryBreakdown[];
  terms: FeeTerm[];
  transactions: PaymentTransaction[];
}

export interface TimetablePeriod {
  periodNumber: number;
  timeRange: string;
  startTime: string; // "09:00"
  endTime: string;   // "09:50"
  subjectCode: string;
  subjectName: string;
  room: string;
  facultyName: string; // placeholder format
  status?: 'done' | 'now' | 'next' | 'upcoming';
}

export interface DayTimetable {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: TimetablePeriod[];
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'Academic' | 'Examination' | 'Placements' | 'Administrative' | 'Events' | 'Circular';
  publisher: string;
  isUrgent?: boolean;
  content: string;
  attachments?: { name: string; size: string; type: string }[];
}

export interface PersonalTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  category: 'Exam Prep' | 'Assignment' | 'Lab Work' | 'Reading' | 'Other';
  notes?: string;
  createdAt: string;
}

export interface OfficialAssignment {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  status: 'Pending Submission' | 'Submitted' | 'Graded';
  obtainedMarks?: number;
  instructions: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: 'Holiday' | 'Exam' | 'Deadline' | 'Event' | 'Academic Milestone';
  description?: string;
}

export interface SuggestionComplaint {
  id: string;
  ticketNumber: string;
  recipient: 'Dean Academics' | 'Hostel Warden' | 'Transport Section' | 'IT Helpdesk' | 'Examination Cell' | 'Library';
  category: 'Academic' | 'Infrastructure' | 'Hostel' | 'Transport' | 'Cleanliness' | 'Library' | 'Other';
  remarks: string;
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';
  submittedDate: string;
  timeline: {
    status: string;
    timestamp: string;
    note: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'Academic' | 'Fees' | 'Examination' | 'System' | 'Planner';
  isRead: boolean;
  targetPath: string; // route to navigate to
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Syllabus' | 'Academic Regulations' | 'Circular' | 'Question Paper' | 'Form';
  department: string;
  semester: string;
  publishedDate: string;
  fileType: 'PDF' | 'DOCX';
  fileSize: string;
  hasSampleDownload: boolean;
  downloadFilename?: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  sources?: string[]; // cited document titles
  isError?: boolean;
}

export interface SelfDeclarationState {
  isSubmitted: boolean;
  submissionDate?: string;
  academicHonorAccepted: boolean;
  medicalFitnessAccepted: boolean;
  antiRaggingAccepted: boolean;
  contactConfirmed: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  textSize: 'normal' | 'large' | 'xlarge';
  reducedMotion: boolean;
  notificationPreferences: {
    academic: boolean;
    fees: boolean;
    examination: boolean;
    planner: boolean;
    system: boolean;
  };
  securityPin: string; // default "2026"
  firstLoginThemeChosen: boolean;
}

export interface SeminarHallBooking {
  id: string;
  facilityName: string;
  eventTitle: string;
  organizingBody: string;
  date: string;
  timeSlot: string;
  expectedAttendees: number;
  status: 'Pending Review' | 'Confirmed' | 'Rejected';
  submittedDate: string;
}

export interface ExamApplicationForm {
  id: string;
  formType: 'Revaluation / Recounting' | 'Duplicate Hall Ticket' | 'Migration Certificate' | 'Name Correction';
  semester: string;
  status: 'Submitted' | 'Pending' | 'Approved';
  appliedDate: string;
  details: string;
}

export interface PlacementRegistration {
  isRegistered: boolean;
  preferredDomain: string;
  skills: string[];
  resumeUploaded: boolean;
  registeredContests: string[];
}

export interface DepartmentData {
  id: string;
  name: string;
  code: string;
  hodName: string;
  established: string;
  description: string;
  subBranches?: string[];
  contactEmail: string;
  contactPhone: string;
}

export interface FacilityData {
  id: string;
  name: string;
  iconName: string;
  desc: string;
}

export interface FAQData {
  category: string;
  question: string;
  answer: string;
}

export interface PlacementContest {
  id: string;
  title: string;
  date: string;
  eligibility: string;
  status: string;
}

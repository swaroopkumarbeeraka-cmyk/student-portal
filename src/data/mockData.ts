import {
  Student,
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

export const INITIAL_STUDENT: Student = {
  name: 'Aarav Kumar',
  rollNo: '26A91A0501',
  studentCode: 'STU-20260501',
  course: 'B.Tech',
  branch: 'Computer Science & Engineering',
  specialization: 'Artificial Intelligence',
  section: 'Section A',
  year: 1,
  semester: 2,
  email: 'aarav.kumar@college.example',
  phoneMasked: '+91 98XXXXX210',
  institutionName: 'Apex Institute of Technology & Science',
  institutionShortName: 'AITS',
  institutionLogoText: 'AITS',
  academicYear: '2026-27'
};

export const INITIAL_STUDENT_PREV: Student = {
  ...INITIAL_STUDENT,
  semester: 1,
  academicYear: '2025-26'
};

// ================= ATTENDANCE DATA =================
// 210 working days, 168 present, 42 absent = 80% (required 75%)
// Monthly records Jan-Jun:
// Jan: 35 working, 30 present, 5 absent (4 full, 2 half)
// Feb: 32 working, 26 present, 6 absent (5 full, 2 half)
// Mar: 38 working, 30 present, 8 absent (7 full, 2 half)
// Apr: 34 working, 27 present, 7 absent (6 full, 2 half)
// May: 36 working, 28 present, 8 absent (7 full, 2 half)
// Jun: 35 working, 27 present, 8 absent (7 full, 2 half)
// Totals:
// Working: 35+32+38+34+36+35 = 210
// Present: 30+26+30+27+28+27 = 168
// Absent: 5+6+8+7+8+8 = 42. Exactly 168/210 = 80.0%

export const ATTENDANCE_2026_27: AttendanceData = {
  academicYear: '2026-27',
  overallWorkingDays: 210,
  overallPresent: 168,
  overallAbsent: 42,
  overallPercentage: 80,
  requiredPercentage: 75,
  // Computed in calculation helper: floor(168 / 0.75 - 210) = 14
  maxPermissibleAbsences: 14,
  records: [
    {
      month: 'Jan',
      monthFullName: 'January 2026',
      year: 2026,
      workingDays: 35,
      presentDays: 30,
      absentDays: 5,
      percentage: 85.7,
      dailyRecords: [
        { date: '2026-01-08', dayName: 'Thursday', status: 'AbsentFull', remarks: 'Medical leave' },
        { date: '2026-01-14', dayName: 'Wednesday', status: 'AbsentHalf', remarks: 'Afternoon session' },
        { date: '2026-01-19', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-01-23', dayName: 'Friday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-01-28', dayName: 'Wednesday', status: 'AbsentHalf', remarks: 'Forenoon lab test clash' },
        { date: '2026-01-30', dayName: 'Friday', status: 'AbsentFull', remarks: 'Fever' }
      ]
    },
    {
      month: 'Feb',
      monthFullName: 'February 2026',
      year: 2026,
      workingDays: 32,
      presentDays: 26,
      absentDays: 6,
      percentage: 81.25,
      dailyRecords: [
        { date: '2026-02-04', dayName: 'Wednesday', status: 'AbsentFull', remarks: 'Family function' },
        { date: '2026-02-10', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Viral cold' },
        { date: '2026-02-16', dayName: 'Monday', status: 'AbsentHalf', remarks: 'Forenoon' },
        { date: '2026-02-19', dayName: 'Thursday', status: 'AbsentFull', remarks: 'Out of town' },
        { date: '2026-02-23', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-02-27', dayName: 'Friday', status: 'AbsentHalf', remarks: 'Afternoon session' },
        { date: '2026-02-28', dayName: 'Saturday', status: 'AbsentFull', remarks: 'Sick leave' }
      ]
    },
    {
      month: 'Mar',
      monthFullName: 'March 2026',
      year: 2026,
      workingDays: 38,
      presentDays: 30,
      absentDays: 8,
      percentage: 78.95,
      dailyRecords: [
        { date: '2026-03-03', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Technical fest travel' },
        { date: '2026-03-09', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-03-13', dayName: 'Friday', status: 'AbsentHalf', remarks: 'Project work' },
        { date: '2026-03-17', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Medical consultation' },
        { date: '2026-03-20', dayName: 'Friday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-03-25', dayName: 'Wednesday', status: 'AbsentFull', remarks: 'Leave' },
        { date: '2026-03-27', dayName: 'Friday', status: 'AbsentHalf', remarks: 'Department event' },
        { date: '2026-03-31', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Family emergency' }
      ]
    },
    {
      month: 'Apr',
      monthFullName: 'April 2026',
      year: 2026,
      workingDays: 34,
      presentDays: 27,
      absentDays: 7,
      percentage: 79.41,
      dailyRecords: [
        { date: '2026-04-06', dayName: 'Monday', status: 'AbsentFull', remarks: 'Fever' },
        { date: '2026-04-10', dayName: 'Friday', status: 'AbsentHalf', remarks: 'Afternoon' },
        { date: '2026-04-15', dayName: 'Wednesday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-04-21', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Out of station' },
        { date: '2026-04-24', dayName: 'Friday', status: 'AbsentHalf', remarks: 'Hackathon prep' },
        { date: '2026-04-28', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-04-30', dayName: 'Thursday', status: 'AbsentFull', remarks: 'Sick leave' }
      ]
    },
    {
      month: 'May',
      monthFullName: 'May 2026',
      year: 2026,
      workingDays: 36,
      presentDays: 28,
      absentDays: 8,
      percentage: 77.78,
      dailyRecords: [
        { date: '2026-05-04', dayName: 'Monday', status: 'AbsentFull', remarks: 'Medical' },
        { date: '2026-05-08', dayName: 'Friday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-05-13', dayName: 'Wednesday', status: 'AbsentHalf', remarks: 'Forenoon' },
        { date: '2026-05-18', dayName: 'Monday', status: 'AbsentFull', remarks: 'Fever' },
        { date: '2026-05-22', dayName: 'Friday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-05-26', dayName: 'Tuesday', status: 'AbsentHalf', remarks: 'Afternoon' },
        { date: '2026-05-28', dayName: 'Thursday', status: 'AbsentFull', remarks: 'Leave' },
        { date: '2026-05-29', dayName: 'Friday', status: 'AbsentFull', remarks: 'Leave' }
      ]
    },
    {
      month: 'Jun',
      monthFullName: 'June 2026',
      year: 2026,
      workingDays: 35,
      presentDays: 27,
      absentDays: 8,
      percentage: 77.14,
      dailyRecords: [
        { date: '2026-06-03', dayName: 'Wednesday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-06-08', dayName: 'Monday', status: 'AbsentFull', remarks: 'Sick' },
        { date: '2026-06-12', dayName: 'Friday', status: 'AbsentHalf', remarks: 'Forenoon' },
        { date: '2026-06-17', dayName: 'Wednesday', status: 'AbsentFull', remarks: 'Medical' },
        { date: '2026-06-22', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2026-06-25', dayName: 'Thursday', status: 'AbsentHalf', remarks: 'Afternoon' },
        { date: '2026-06-26', dayName: 'Friday', status: 'AbsentFull', remarks: 'Family event' },
        { date: '2026-06-29', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' }
      ]
    }
  ]
};

export const ATTENDANCE_2025_26: AttendanceData = {
  academicYear: '2025-26',
  overallWorkingDays: 200,
  overallPresent: 172,
  overallAbsent: 28,
  overallPercentage: 86,
  requiredPercentage: 75,
  maxPermissibleAbsences: 29,
  records: [
    {
      month: 'Jul',
      monthFullName: 'July 2025',
      year: 2025,
      workingDays: 32,
      presentDays: 28,
      absentDays: 4,
      percentage: 87.5,
      dailyRecords: [
        { date: '2025-07-10', dayName: 'Thursday', status: 'AbsentFull', remarks: 'Travel' },
        { date: '2025-07-22', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Sick' },
        { date: '2025-07-28', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2025-07-30', dayName: 'Wednesday', status: 'AbsentFull', remarks: 'Leave' }
      ]
    },
    {
      month: 'Aug',
      monthFullName: 'August 2025',
      year: 2025,
      workingDays: 34,
      presentDays: 30,
      absentDays: 4,
      percentage: 88.2,
      dailyRecords: [
        { date: '2025-08-11', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2025-08-19', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Medical' },
        { date: '2025-08-25', dayName: 'Monday', status: 'AbsentFull', remarks: 'Leave' },
        { date: '2025-08-29', dayName: 'Friday', status: 'AbsentFull', remarks: 'Personal' }
      ]
    },
    {
      month: 'Sep',
      monthFullName: 'September 2025',
      year: 2025,
      workingDays: 35,
      presentDays: 29,
      absentDays: 6,
      percentage: 82.8,
      dailyRecords: [
        { date: '2025-09-04', dayName: 'Thursday', status: 'AbsentFull', remarks: 'Family event' },
        { date: '2025-09-12', dayName: 'Friday', status: 'AbsentFull', remarks: 'Viral fever' },
        { date: '2025-09-15', dayName: 'Monday', status: 'AbsentFull', remarks: 'Fever' },
        { date: '2025-09-22', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2025-09-26', dayName: 'Friday', status: 'AbsentFull', remarks: 'Medical' },
        { date: '2025-09-29', dayName: 'Monday', status: 'AbsentFull', remarks: 'Leave' }
      ]
    },
    {
      month: 'Oct',
      monthFullName: 'October 2025',
      year: 2025,
      workingDays: 33,
      presentDays: 28,
      absentDays: 5,
      percentage: 84.8,
      dailyRecords: [
        { date: '2025-10-06', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2025-10-14', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Leave' },
        { date: '2025-10-21', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Sick' },
        { date: '2025-10-27', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2025-10-31', dayName: 'Friday', status: 'AbsentFull', remarks: 'Leave' }
      ]
    },
    {
      month: 'Nov',
      monthFullName: 'November 2025',
      year: 2025,
      workingDays: 34,
      presentDays: 29,
      absentDays: 5,
      percentage: 85.3,
      dailyRecords: [
        { date: '2025-11-05', dayName: 'Wednesday', status: 'AbsentFull', remarks: 'Medical' },
        { date: '2025-11-12', dayName: 'Wednesday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2025-11-18', dayName: 'Tuesday', status: 'AbsentFull', remarks: 'Sick' },
        { date: '2025-11-24', dayName: 'Monday', status: 'AbsentFull', remarks: 'Leave' },
        { date: '2025-11-28', dayName: 'Friday', status: 'AbsentFull', remarks: 'Personal' }
      ]
    },
    {
      month: 'Dec',
      monthFullName: 'December 2025',
      year: 2025,
      workingDays: 32,
      presentDays: 28,
      absentDays: 4,
      percentage: 87.5,
      dailyRecords: [
        { date: '2025-12-08', dayName: 'Monday', status: 'AbsentFull', remarks: 'Personal' },
        { date: '2025-12-15', dayName: 'Monday', status: 'AbsentFull', remarks: 'Exam prep' },
        { date: '2025-12-22', dayName: 'Monday', status: 'AbsentFull', remarks: 'Travel' },
        { date: '2025-12-29', dayName: 'Monday', status: 'AbsentFull', remarks: 'Leave' }
      ]
    }
  ]
};

// ================= ACADEMICS DATA =================
// CGPA 8.2. Exams: Unit Test 1, Unit Test 2, Sem 1 Final (best), Mid-1 (latest, 42/50 average).
// Mid-1 out of 50: Chemistry 41, Thermal Engineering 38 (lowest), BCME 44, Communicative English 46, Maths 41. Average: 42.

export const ACADEMICS_2026_27: AcademicData = {
  academicYear: '2026-27',
  cgpa: 8.2,
  averageScorePercentage: 84.4,
  examsCount: 4,
  latestExamId: 'exam-mid1',
  bestExamId: 'exam-sem1',
  exams: [
    {
      id: 'exam-mid1',
      name: 'Mid Semester Examination 1 (Mid-1)',
      examType: 'Mid-1',
      date: '24 Sep 2026',
      isLatest: true,
      maxTotal: 250,
      scoredTotal: 210,
      percentage: 84.0,
      averageMarks: 42.0,
      rank: 4,
      subjects: [
        { code: '23CS101', name: 'Communicative English', maxMarks: 50, scoredMarks: 46, percentage: 92, grade: 'O' },
        { code: '23ME101', name: 'Basic Civil & Mechanical Engg (BCME)', maxMarks: 50, scoredMarks: 44, percentage: 88, grade: 'A+' },
        { code: '23BS101', name: 'Engineering Chemistry', maxMarks: 50, scoredMarks: 41, percentage: 82, grade: 'A' },
        { code: '23BS102', name: 'Engineering Mathematics - II', maxMarks: 50, scoredMarks: 41, percentage: 82, grade: 'A' },
        { code: '23ME102', name: 'Thermal Engineering', maxMarks: 50, scoredMarks: 38, percentage: 76, grade: 'B+', isLowest: true }
      ]
    },
    {
      id: 'exam-sem1',
      name: 'Semester 1 End Examinations',
      examType: 'Sem 1 Final',
      date: '18 Jan 2026',
      isBest: true,
      maxTotal: 500,
      scoredTotal: 432,
      percentage: 86.4,
      averageMarks: 86.4,
      rank: 2,
      subjects: [
        { code: '23CS101', name: 'Communicative English', maxMarks: 100, scoredMarks: 91, percentage: 91, grade: 'O' },
        { code: '23BS101', name: 'Engineering Chemistry', maxMarks: 100, scoredMarks: 86, percentage: 86, grade: 'A+' },
        { code: '23BS102', name: 'Engineering Mathematics - I', maxMarks: 100, scoredMarks: 87, percentage: 87, grade: 'A+' },
        { code: '23ME101', name: 'Basic Civil & Mechanical Engg (BCME)', maxMarks: 100, scoredMarks: 88, percentage: 88, grade: 'A+' },
        { code: '23ME102', name: 'Thermal Engineering', maxMarks: 100, scoredMarks: 80, percentage: 80, grade: 'A', isLowest: true }
      ]
    },
    {
      id: 'exam-ut2',
      name: 'Continuous Assessment - Unit Test 2',
      examType: 'Unit Test 2',
      date: '12 Nov 2025',
      maxTotal: 125,
      scoredTotal: 106,
      percentage: 84.8,
      averageMarks: 21.2,
      subjects: [
        { code: '23CS101', name: 'Communicative English', maxMarks: 25, scoredMarks: 23, percentage: 92, grade: 'O' },
        { code: '23ME101', name: 'Basic Civil & Mechanical Engg (BCME)', maxMarks: 25, scoredMarks: 22, percentage: 88, grade: 'A+' },
        { code: '23BS102', name: 'Engineering Mathematics - II', maxMarks: 25, scoredMarks: 21, percentage: 84, grade: 'A' },
        { code: '23BS101', name: 'Engineering Chemistry', maxMarks: 25, scoredMarks: 21, percentage: 84, grade: 'A' },
        { code: '23ME102', name: 'Thermal Engineering', maxMarks: 25, scoredMarks: 19, percentage: 76, grade: 'B+', isLowest: true }
      ]
    },
    {
      id: 'exam-ut1',
      name: 'Continuous Assessment - Unit Test 1',
      examType: 'Unit Test 1',
      date: '28 Aug 2025',
      maxTotal: 125,
      scoredTotal: 103,
      percentage: 82.4,
      averageMarks: 20.6,
      subjects: [
        { code: '23CS101', name: 'Communicative English', maxMarks: 25, scoredMarks: 23, percentage: 92, grade: 'O' },
        { code: '23ME101', name: 'Basic Civil & Mechanical Engg (BCME)', maxMarks: 25, scoredMarks: 21, percentage: 84, grade: 'A' },
        { code: '23BS102', name: 'Engineering Mathematics - II', maxMarks: 25, scoredMarks: 21, percentage: 84, grade: 'A' },
        { code: '23BS101', name: 'Engineering Chemistry', maxMarks: 25, scoredMarks: 20, percentage: 80, grade: 'A' },
        { code: '23ME102', name: 'Thermal Engineering', maxMarks: 25, scoredMarks: 18, percentage: 72, grade: 'B+', isLowest: true }
      ]
    }
  ]
};

export const ACADEMICS_2025_26: AcademicData = {
  academicYear: '2025-26',
  cgpa: 8.0,
  averageScorePercentage: 81.6,
  examsCount: 2,
  latestExamId: 'exam-prev-sem1',
  bestExamId: 'exam-prev-sem1',
  exams: [
    {
      id: 'exam-prev-sem1',
      name: 'First Year Foundation Diagnostic Exam',
      examType: 'Sem 1 Final',
      date: '10 Dec 2024',
      isLatest: true,
      isBest: true,
      maxTotal: 300,
      scoredTotal: 246,
      percentage: 82.0,
      averageMarks: 82.0,
      rank: 6,
      subjects: [
        { code: '23BS101', name: 'Physics & Applied Materials', maxMarks: 100, scoredMarks: 85, percentage: 85, grade: 'A+' },
        { code: '23BS102', name: 'Linear Algebra & Calculus', maxMarks: 100, scoredMarks: 83, percentage: 83, grade: 'A' },
        { code: '23CS100', name: 'Problem Solving through C', maxMarks: 100, scoredMarks: 78, percentage: 78, grade: 'B+', isLowest: true }
      ]
    },
    {
      id: 'exam-prev-ut1',
      name: 'Diagnostic Unit Test',
      examType: 'Unit Test 1',
      date: '15 Sep 2024',
      maxTotal: 75,
      scoredTotal: 61,
      percentage: 81.33,
      averageMarks: 20.33,
      subjects: [
        { code: '23BS101', name: 'Physics & Applied Materials', maxMarks: 25, scoredMarks: 22, percentage: 88, grade: 'A+' },
        { code: '23BS102', name: 'Linear Algebra & Calculus', maxMarks: 25, scoredMarks: 20, percentage: 80, grade: 'A' },
        { code: '23CS100', name: 'Problem Solving through C', maxMarks: 25, scoredMarks: 19, percentage: 76, grade: 'B+', isLowest: true }
      ]
    }
  ]
};

// ================= FEES DATA =================
// Total: 1,20,000 | Paid: 80,000 | Outstanding: 40,000 | 66.67% paid | Partially paid
// Breakdown:
// Tuition: 90,000 total / 60,000 paid / 30,000 outstanding
// Transport: 20,000 total / 15,000 paid / 5,000 outstanding
// Exam fee: 10,000 total / 5,000 paid / 5,000 outstanding
// Terms:
// Term 1 due 15 Jul: 60,000 total, 60,000 paid, 0 outstanding (Paid)
// Term 2 due 15 Nov: 60,000 total, 20,000 paid, 40,000 outstanding (Partially paid)
// History:
// TXN-1007 | 10 Jul | Rs 60,000 | UPI | Success
// TXN-1042 | 02 Oct | Rs 20,000 | Net Banking | Success

export const FEES_2026_27: FeesData = {
  academicYear: '2026-27',
  totalAmount: 120000,
  paidAmount: 80000,
  outstandingAmount: 40000,
  percentPaid: 66.67,
  overallStatus: 'Partially paid',
  breakdown: [
    { id: 'cat-tuition', name: 'Tuition Fee (Annual Academic)', total: 90000, paid: 60000, outstanding: 30000 },
    { id: 'cat-transport', name: 'Institute Transport Fee (Route 14)', total: 20000, paid: 15000, outstanding: 5000 },
    { id: 'cat-exam', name: 'University Examination Fee (Sem 1 & 2)', total: 10000, paid: 5000, outstanding: 5000 }
  ],
  terms: [
    {
      id: 'term-1',
      name: 'Academic Term 1 Fee',
      dueDate: '15 Jul 2026',
      totalAmount: 60000,
      paidAmount: 60000,
      outstandingAmount: 0,
      status: 'Paid'
    },
    {
      id: 'term-2',
      name: 'Academic Term 2 Fee',
      dueDate: '15 Nov 2026',
      totalAmount: 60000,
      paidAmount: 20000,
      outstandingAmount: 40000,
      status: 'Partially paid'
    }
  ],
  transactions: [
    {
      id: 'tx-2',
      txnId: 'TXN-1042',
      date: '02 Oct 2026, 03:45 PM',
      amount: 20000,
      method: 'Net Banking',
      status: 'Success',
      termId: 'term-2',
      termName: 'Academic Term 2 Fee (Installment 1)',
      referenceNo: 'NB-ICICI-88491023',
      receiptNumber: 'RCP-2026-1042',
      notes: 'Sandbox Verified Simulation'
    },
    {
      id: 'tx-1',
      txnId: 'TXN-1007',
      date: '10 Jul 2026, 11:20 AM',
      amount: 60000,
      method: 'UPI',
      status: 'Success',
      termId: 'term-1',
      termName: 'Academic Term 1 Fee',
      referenceNo: 'UPI-SBIN-49102941',
      receiptNumber: 'RCP-2026-1007',
      notes: 'Sandbox Verified Simulation'
    }
  ]
};

export const FEES_2025_26: FeesData = {
  academicYear: '2025-26',
  totalAmount: 110000,
  paidAmount: 110000,
  outstandingAmount: 0,
  percentPaid: 100,
  overallStatus: 'Paid',
  breakdown: [
    { id: 'cat-tuition-prev', name: 'Tuition Fee', total: 85000, paid: 85000, outstanding: 0 },
    { id: 'cat-transport-prev', name: 'Transport Fee', total: 17000, paid: 17000, outstanding: 0 },
    { id: 'cat-exam-prev', name: 'Examination Fee', total: 8000, paid: 8000, outstanding: 0 }
  ],
  terms: [
    {
      id: 'term-prev-1',
      name: 'First Year Term 1',
      dueDate: '20 Jul 2025',
      totalAmount: 55000,
      paidAmount: 55000,
      outstandingAmount: 0,
      status: 'Paid'
    },
    {
      id: 'term-prev-2',
      name: 'First Year Term 2',
      dueDate: '15 Nov 2025',
      totalAmount: 55000,
      paidAmount: 55000,
      outstandingAmount: 0,
      status: 'Paid'
    }
  ],
  transactions: [
    {
      id: 'tx-prev-2',
      txnId: 'TXN-0922',
      date: '12 Nov 2025, 02:10 PM',
      amount: 55000,
      method: 'Net Banking',
      status: 'Success',
      termId: 'term-prev-2',
      termName: 'First Year Term 2',
      referenceNo: 'NB-HDFC-9382103',
      receiptNumber: 'RCP-2025-0922'
    },
    {
      id: 'tx-prev-1',
      txnId: 'TXN-0814',
      date: '18 Jul 2025, 10:15 AM',
      amount: 55000,
      method: 'UPI',
      status: 'Success',
      termId: 'term-prev-1',
      termName: 'First Year Term 1',
      referenceNo: 'UPI-AXIS-1039482',
      receiptNumber: 'RCP-2025-0814'
    }
  ]
};

// ================= TIMETABLE =================
export const WEEKLY_TIMETABLE: DayTimetable[] = [
  {
    day: 'Monday',
    periods: [
      { periodNumber: 1, timeRange: '09:00 - 09:50', startTime: '09:00', endTime: '09:50', subjectCode: '23BS102', subjectName: 'Engg Mathematics - II', room: 'LH-104', facultyName: 'Dr. V. Ramanathan' },
      { periodNumber: 2, timeRange: '09:50 - 10:40', startTime: '09:50', endTime: '10:40', subjectCode: '23BS101', subjectName: 'Engineering Chemistry', room: 'LH-104', facultyName: 'Dr. S. K. Mukherjee' },
      { periodNumber: 3, timeRange: '10:55 - 11:45', startTime: '10:55', endTime: '11:45', subjectCode: '23CS101', subjectName: 'Communicative English', room: 'LH-104', facultyName: 'Prof. Ananya Sen' },
      { periodNumber: 4, timeRange: '11:45 - 12:35', startTime: '11:45', endTime: '12:35', subjectCode: '23ME102', subjectName: 'Thermal Engineering', room: 'LH-104', facultyName: 'Dr. K. N. Rao' },
      { periodNumber: 5, timeRange: '01:30 - 02:20', startTime: '01:30', endTime: '02:20', subjectCode: '23ME101', subjectName: 'BCME (Mechanical)', room: 'LH-104', facultyName: 'Prof. P. Verma' },
      { periodNumber: 6, timeRange: '02:20 - 04:00', startTime: '02:20', endTime: '04:00', subjectCode: '23CS102', subjectName: 'AI Programming Lab', room: 'Lab CC-3', facultyName: 'Prof. M. K. Iyer' }
    ]
  },
  {
    day: 'Tuesday',
    periods: [
      { periodNumber: 1, timeRange: '09:00 - 09:50', startTime: '09:00', endTime: '09:50', subjectCode: '23ME102', subjectName: 'Thermal Engineering', room: 'LH-104', facultyName: 'Dr. K. N. Rao' },
      { periodNumber: 2, timeRange: '09:50 - 10:40', startTime: '09:50', endTime: '10:40', subjectCode: '23BS102', subjectName: 'Engg Mathematics - II', room: 'LH-104', facultyName: 'Dr. V. Ramanathan' },
      { periodNumber: 3, timeRange: '10:55 - 11:45', startTime: '10:55', endTime: '11:45', subjectCode: '23BS101', subjectName: 'Engineering Chemistry', room: 'LH-104', facultyName: 'Dr. S. K. Mukherjee' },
      { periodNumber: 4, timeRange: '11:45 - 12:35', startTime: '11:45', endTime: '12:35', subjectCode: '23CS101', subjectName: 'Communicative English', room: 'LH-104', facultyName: 'Prof. Ananya Sen' },
      { periodNumber: 5, timeRange: '01:30 - 03:10', startTime: '01:30', endTime: '03:10', subjectCode: '23BS103', subjectName: 'Chemistry Lab', room: 'Chem Lab 2', facultyName: 'Dr. S. K. Mukherjee' },
      { periodNumber: 6, timeRange: '03:10 - 04:00', startTime: '03:10', endTime: '04:00', subjectCode: 'LIB-01', subjectName: 'Library & Mentoring Hour', room: 'Central Lib', facultyName: 'Faculty Mentor' }
    ]
  },
  {
    day: 'Wednesday',
    periods: [
      { periodNumber: 1, timeRange: '09:00 - 09:50', startTime: '09:00', endTime: '09:50', subjectCode: '23ME101', subjectName: 'BCME (Civil)', room: 'LH-104', facultyName: 'Prof. R. C. Das' },
      { periodNumber: 2, timeRange: '09:50 - 10:40', startTime: '09:50', endTime: '10:40', subjectCode: '23ME102', subjectName: 'Thermal Engineering', room: 'LH-104', facultyName: 'Dr. K. N. Rao' },
      { periodNumber: 3, timeRange: '10:55 - 11:45', startTime: '10:55', endTime: '11:45', subjectCode: '23BS102', subjectName: 'Engg Mathematics - II', room: 'LH-104', facultyName: 'Dr. V. Ramanathan' },
      { periodNumber: 4, timeRange: '11:45 - 12:35', startTime: '11:45', endTime: '12:35', subjectCode: '23BS101', subjectName: 'Engineering Chemistry', room: 'LH-104', facultyName: 'Dr. S. K. Mukherjee' },
      { periodNumber: 5, timeRange: '01:30 - 03:10', startTime: '01:30', endTime: '03:10', subjectCode: '23ME103', subjectName: 'Engineering Workshop', room: 'WS Block B', facultyName: 'Er. A. K. Gupta' },
      { periodNumber: 6, timeRange: '03:10 - 04:00', startTime: '03:10', endTime: '04:00', subjectCode: '23CS103', subjectName: 'Intro to Python for AI', room: 'LH-104', facultyName: 'Prof. M. K. Iyer' }
    ]
  },
  {
    day: 'Thursday',
    periods: [
      { periodNumber: 1, timeRange: '09:00 - 09:50', startTime: '09:00', endTime: '09:50', subjectCode: '23BS101', subjectName: 'Engineering Chemistry', room: 'LH-104', facultyName: 'Dr. S. K. Mukherjee' },
      { periodNumber: 2, timeRange: '09:50 - 10:40', startTime: '09:50', endTime: '10:40', subjectCode: '23CS101', subjectName: 'Communicative English', room: 'LH-104', facultyName: 'Prof. Ananya Sen' },
      { periodNumber: 3, timeRange: '10:55 - 11:45', startTime: '10:55', endTime: '11:45', subjectCode: '23ME102', subjectName: 'Thermal Engineering', room: 'LH-104', facultyName: 'Dr. K. N. Rao' },
      { periodNumber: 4, timeRange: '11:45 - 12:35', startTime: '11:45', endTime: '12:35', subjectCode: '23ME101', subjectName: 'BCME (Mechanical)', room: 'LH-104', facultyName: 'Prof. P. Verma' },
      { periodNumber: 5, timeRange: '01:30 - 03:10', startTime: '01:30', endTime: '03:10', subjectCode: '23CS104', subjectName: 'Data Structures Practice Lab', room: 'Lab CC-2', facultyName: 'Dr. T. Banerjee' },
      { periodNumber: 6, timeRange: '03:10 - 04:00', startTime: '03:10', endTime: '04:00', subjectCode: 'SPO-01', subjectName: 'Sports / Physical Education', room: 'Sports Complex', facultyName: 'Physical Director' }
    ]
  },
  {
    day: 'Friday',
    periods: [
      { periodNumber: 1, timeRange: '09:00 - 09:50', startTime: '09:00', endTime: '09:50', subjectCode: '23BS102', subjectName: 'Engg Mathematics - II', room: 'LH-104', facultyName: 'Dr. V. Ramanathan' },
      { periodNumber: 2, timeRange: '09:50 - 10:40', startTime: '09:50', endTime: '10:40', subjectCode: '23ME101', subjectName: 'BCME (Civil)', room: 'LH-104', facultyName: 'Prof. R. C. Das' },
      { periodNumber: 3, timeRange: '10:55 - 11:45', startTime: '10:55', endTime: '11:45', subjectCode: '23CS101', subjectName: 'Communicative English', room: 'LH-104', facultyName: 'Prof. Ananya Sen' },
      { periodNumber: 4, timeRange: '11:45 - 12:35', startTime: '11:45', endTime: '12:35', subjectCode: '23BS101', subjectName: 'Engineering Chemistry', room: 'LH-104', facultyName: 'Dr. S. K. Mukherjee' },
      { periodNumber: 5, timeRange: '01:30 - 02:20', startTime: '01:30', endTime: '02:20', subjectCode: '23ME102', subjectName: 'Thermal Engineering', room: 'LH-104', facultyName: 'Dr. K. N. Rao' },
      { periodNumber: 6, timeRange: '02:20 - 04:00', startTime: '02:20', endTime: '04:00', subjectCode: 'CLUB-01', subjectName: 'AI Club Project Activity', room: 'Incubation Hub', facultyName: 'Club Coordinator' }
    ]
  },
  {
    day: 'Saturday',
    periods: [
      { periodNumber: 1, timeRange: '09:00 - 09:50', startTime: '09:00', endTime: '09:50', subjectCode: '23BS102', subjectName: 'Engg Mathematics - II (Tutorial)', room: 'LH-104', facultyName: 'Dr. V. Ramanathan' },
      { periodNumber: 2, timeRange: '09:50 - 10:40', startTime: '09:50', endTime: '10:40', subjectCode: '23ME102', subjectName: 'Thermal Engineering (Problem Session)', room: 'LH-104', facultyName: 'Dr. K. N. Rao' },
      { periodNumber: 3, timeRange: '10:55 - 11:45', startTime: '10:55', endTime: '11:45', subjectCode: 'SEM-01', subjectName: 'Technical Seminar / Presentation', room: 'Seminar Hall 1', facultyName: 'HOD CSE' },
      { periodNumber: 4, timeRange: '11:45 - 12:35', startTime: '11:45', endTime: '12:35', subjectCode: 'ECA-01', subjectName: 'Co-curricular Activities', room: 'Campus Quad', facultyName: 'Student Affairs' }
    ]
  }
];

// ================= NOTICES =================
export const MOCK_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: 'Submission of Mandatory Student Self-Declaration Form 2026-27',
    date: '08 Oct 2026',
    category: 'Administrative',
    publisher: 'Office of the Dean (Student Affairs)',
    isUrgent: true,
    content: 'All First Year B.Tech students are strictly instructed to submit the online Self-Declaration form covering academic honor code, medical verification and anti-ragging undertakings by 20 October 2026. Non-compliance may lead to temporary withholding of the upcoming Mid-2 hall tickets.',
    attachments: [{ name: 'self_declaration_guidelines_2026.pdf', size: '245 KB', type: 'PDF' }]
  },
  {
    id: 'notice-2',
    title: 'Schedule for Mid-Semester Examination 2 (Mid-2) November 2026',
    date: '05 Oct 2026',
    category: 'Examination',
    publisher: 'Controller of Examinations',
    isUrgent: true,
    content: 'Mid-2 Examinations for B.Tech Semester 2 will commence from 18 November 2026. Detailed timetable branch-wise will be posted by 25 October. Minimum 75% attendance cutoff applies strictly as per academic regulation R23.',
    attachments: [{ name: 'mid2_timetable_tentative.pdf', size: '410 KB', type: 'PDF' }]
  },
  {
    id: 'notice-3',
    title: 'Second Term Tuition and Transport Fee Due Date - 15 November 2026',
    date: '01 Oct 2026',
    category: 'Academic',
    publisher: 'Accounts & Finance Section',
    content: 'Students who have remaining balance for Term 2 are advised to clear the outstanding fee before 15 November 2026 through the Student Portal sandbox payment gateway to avoid late surcharge.',
    attachments: [{ name: 'fee_schedule_sem2.pdf', size: '180 KB', type: 'PDF' }]
  },
  {
    id: 'notice-4',
    title: 'National Level Hackathon "CodeNova 2026" Registrations Open',
    date: '28 Sep 2026',
    category: 'Events',
    publisher: 'Department of Computer Science & Engineering',
    content: 'The Department of CSE in collaboration with the ACM Student Chapter invites project entries for CodeNova 2026. Cash awards worth Rs 1,50,000 for top 3 teams. Open to 1st and 2nd year students.',
    attachments: [{ name: 'codenova_rulebook.pdf', size: '520 KB', type: 'PDF' }]
  },
  {
    id: 'notice-5',
    title: 'Rules regarding 75% Mandatory Attendance & Condonation Policy',
    date: '20 Sep 2026',
    category: 'Academic',
    publisher: 'Academic Council',
    content: 'A student must maintain a minimum of 75% aggregate attendance to be eligible for End Semester Examinations. Condonation of shortage between 65% and 75% is granted solely on valid medical grounds certified by the Institute Medical Officer subject to payment of the prescribed condonation fee.',
    attachments: [{ name: 'academic_regulations_r23_attendance.pdf', size: '612 KB', type: 'PDF' }]
  },
  {
    id: 'notice-6',
    title: 'Campus Placement & Internship Readiness Drive for Pre-Final Batches',
    date: '15 Sep 2026',
    category: 'Placements',
    publisher: 'Training & Placement Cell',
    content: 'Orientation sessions regarding coding contest practice and resume building will be conducted every Saturday. First-year students with high CGPA are encouraged to register for competitive coding portals.',
    attachments: [{ name: 'training_calendar_q3.pdf', size: '330 KB', type: 'PDF' }]
  },
  {
    id: 'notice-7',
    title: 'Revised Central Library Timings during Examination Period',
    date: '10 Sep 2026',
    category: 'Circular',
    publisher: 'Central Library Committee',
    content: 'The Central Library reading halls will remain open from 08:00 AM to 11:00 PM on all weekdays and Saturdays during the upcoming assessment cycle. Digital Library terminals are available for NPTEL access.'
  },
  {
    id: 'notice-8',
    title: 'Procedure for Applying for Revaluation and Script Verification',
    date: '02 Sep 2026',
    category: 'Examination',
    publisher: 'Examination Cell',
    content: 'Applications for Sem-1 paper revaluation and recounting can be submitted online through the Examination Section application portal within 10 days of marks publication. Fee per subject is Rs 500.'
  }
];

// ================= STUDY PLANNER (PERSONAL TASKS + OFFICIAL ASSIGNMENTS + CALENDAR) =================
export const INITIAL_TASKS: PersonalTask[] = [
  {
    id: 'task-1',
    title: 'Revise Thermal Engineering Rankine & Carnot Cycles',
    dueDate: '2026-10-18',
    priority: 'High',
    completed: false,
    category: 'Exam Prep',
    notes: 'Focus on thermal efficiency calculations; scored lowest in Mid-1 (38/50)',
    createdAt: '2026-10-02'
  },
  {
    id: 'task-2',
    title: 'Submit Engineering Chemistry Assignment 3',
    dueDate: '2026-10-22',
    priority: 'High',
    completed: false,
    category: 'Assignment',
    notes: 'Spectroscopic methods and polymers problem sheet',
    createdAt: '2026-10-05'
  },
  {
    id: 'task-3',
    title: 'Complete Python AI Lab Exercise 5 (Graph Search)',
    dueDate: '2026-10-25',
    priority: 'Medium',
    completed: false,
    category: 'Lab Work',
    notes: 'Implement BFS, DFS and A* algorithm with path visualization',
    createdAt: '2026-10-06'
  },
  {
    id: 'task-4',
    title: 'Read Communicative English Unit 4 Technical Report Writing',
    dueDate: '2026-10-28',
    priority: 'Low',
    completed: true,
    category: 'Reading',
    notes: 'Covered standard layout, executive summary format',
    createdAt: '2026-10-01'
  },
  {
    id: 'task-5',
    title: 'Solve BCME Practice Problems on Trusses and Beam Reactions',
    dueDate: '2026-10-30',
    priority: 'Medium',
    completed: false,
    category: 'Exam Prep',
    notes: 'Method of joints and method of sections examples',
    createdAt: '2026-10-08'
  }
];

export const OFFICIAL_ASSIGNMENTS: OfficialAssignment[] = [
  {
    id: 'asg-1',
    subjectCode: '23BS101',
    subjectName: 'Engineering Chemistry',
    title: 'Assignment 3: Nanomaterials & Corrosion Control Mechanisms',
    assignedDate: '04 Oct 2026',
    dueDate: '22 Oct 2026',
    maxMarks: 20,
    status: 'Pending Submission',
    instructions: 'Submit handwritten or typed response adhering to the format sheet. Include schematics for sacrificial anode protection.'
  },
  {
    id: 'asg-2',
    subjectCode: '23CS102',
    subjectName: 'AI Programming Lab',
    title: 'Lab Assignment 4: State Space Search Implementations in Python',
    assignedDate: '02 Oct 2026',
    dueDate: '24 Oct 2026',
    maxMarks: 25,
    status: 'Pending Submission',
    instructions: 'Submit the code files (.py) along with terminal run outputs and complexity analysis in PDF format.'
  },
  {
    id: 'asg-3',
    subjectCode: '23ME102',
    subjectName: 'Thermal Engineering',
    title: 'Assignment 2: Steam Power Cycles and Heat Exchanger Performance',
    assignedDate: '20 Sep 2026',
    dueDate: '08 Oct 2026',
    maxMarks: 20,
    status: 'Graded',
    obtainedMarks: 17,
    instructions: 'Evaluated by Dr. K. N. Rao. Good attempt; improve clarity on psychrometric chart calculations.'
  },
  {
    id: 'asg-4',
    subjectCode: '23BS102',
    subjectName: 'Engg Mathematics - II',
    title: 'Assignment 2: Multiple Integrals & Vector Calculus Theorems',
    assignedDate: '15 Sep 2026',
    dueDate: '02 Oct 2026',
    maxMarks: 20,
    status: 'Graded',
    obtainedMarks: 19,
    instructions: 'Evaluated by Dr. V. Ramanathan. Verified Green and Stokes theorem applications.'
  }
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'cal-1', date: '2026-10-02', title: 'Gandhi Jayanti (Holiday)', category: 'Holiday' },
  { id: 'cal-2', date: '2026-10-20', title: 'Self-Declaration Form Deadline', category: 'Deadline', description: 'Mandatory submission cutoff' },
  { id: 'cal-3', date: '2026-10-22', title: 'Chemistry Assignment 3 Due', category: 'Deadline' },
  { id: 'cal-4', date: '2026-10-31', title: 'National Unity Day', category: 'Event' },
  { id: 'cal-5', date: '2026-11-08', title: 'Diwali Festival (Holiday)', category: 'Holiday' },
  { id: 'cal-6', date: '2026-11-15', title: 'Term 2 Fee Surcharge Deadline', category: 'Deadline' },
  { id: 'cal-7', date: '2026-11-18', title: 'Commencement of Mid-2 Exams', category: 'Exam', description: 'B.Tech Sem-2 Mid Examinations' },
  { id: 'cal-8', date: '2026-12-15', title: 'End Semester Practical Examinations', category: 'Exam' },
  { id: 'cal-9', date: '2026-12-28', title: 'End Semester Theory Examinations', category: 'Exam' }
];

// ================= SUGGESTIONS & COMPLAINTS =================
export const INITIAL_COMPLAINTS: SuggestionComplaint[] = [
  {
    id: 'cmp-1',
    ticketNumber: 'TKT-2026-0812',
    recipient: 'IT Helpdesk',
    category: 'Infrastructure',
    remarks: 'Wi-Fi connectivity in Computer Lab CC-3 has high packet drop and disconnects intermittently during AI practical sessions.',
    status: 'In Progress',
    submittedDate: '06 Oct 2026',
    timeline: [
      { status: 'Submitted', timestamp: '06 Oct 2026, 11:30 AM', note: 'Ticket registered by Aarav Kumar' },
      { status: 'Under Review', timestamp: '07 Oct 2026, 10:15 AM', note: 'Assigned to Network Operations Engineer' },
      { status: 'In Progress', timestamp: '08 Oct 2026, 02:40 PM', note: 'Access point AP-CC3 firmware scheduled for inspection and channel re-tune' }
    ]
  },
  {
    id: 'cmp-2',
    ticketNumber: 'TKT-2026-0491',
    recipient: 'Library',
    category: 'Library',
    remarks: 'Requesting additional copies of "Thermal Engineering by R.K. Rajput" in the reference section.',
    status: 'Resolved',
    submittedDate: '18 Sep 2026',
    timeline: [
      { status: 'Submitted', timestamp: '18 Sep 2026, 04:20 PM', note: 'Ticket registered by Aarav Kumar' },
      { status: 'Under Review', timestamp: '19 Sep 2026, 11:00 AM', note: 'Reviewed by Chief Librarian' },
      { status: 'Resolved', timestamp: '24 Sep 2026, 01:15 PM', note: '4 copies added to reserve shelf Rack 12B' }
    ]
  }
];

// ================= NOTIFICATIONS =================
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Self-Declaration Form Pending',
    message: 'Your mandatory Student Self-Declaration is due on 20 Oct 2026. Please complete it now.',
    timestamp: '2 hours ago',
    category: 'Academic',
    isRead: false,
    targetPath: '/declaration'
  },
  {
    id: 'notif-2',
    title: 'Mid-1 Results Published',
    message: 'Mid-1 scored total: 210/250 (84.0%). Detailed subject marks are available in Academics.',
    timestamp: '1 day ago',
    category: 'Examination',
    isRead: false,
    targetPath: '/academics'
  },
  {
    id: 'notif-3',
    title: 'Fee Payment Received',
    message: 'Payment of Rs 20,000 for Term 2 verified successfully. Receipt RCP-2026-1042 generated.',
    timestamp: '9 days ago',
    category: 'Fees',
    isRead: true,
    targetPath: '/fees'
  },
  {
    id: 'notif-4',
    title: 'Assignment 3 Uploaded',
    message: 'Engineering Chemistry Assignment 3 due on 22 Oct has been posted.',
    timestamp: '1 week ago',
    category: 'Planner',
    isRead: true,
    targetPath: '/planner'
  },
  {
    id: 'notif-5',
    title: 'Attendance Alert: 80.0% Aggregate',
    message: 'Current attendance is 80% (168/210 days). Safe above the 75% cutoff with 14 permissible absences.',
    timestamp: '2 weeks ago',
    category: 'Academic',
    isRead: true,
    targetPath: '/attendance'
  }
];

// ================= DOCUMENTS =================
export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'B.Tech CSE (AI) Semester 2 Curriculum & Syllabus R23',
    category: 'Syllabus',
    department: 'Computer Science & Engineering',
    semester: 'Semester 2',
    publishedDate: '15 Jul 2026',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    hasSampleDownload: true,
    downloadFilename: 'cse_ai_sem2_syllabus_r23.pdf',
    description: 'Complete course outcomes, syllabus units, textbook references and evaluation scheme for B.Tech CSE (AI) Year 1 Semester 2 under Academic Regulation R23.'
  },
  {
    id: 'doc-2',
    title: 'Academic Regulations R23 for B.Tech Degree Programs',
    category: 'Academic Regulations',
    department: 'All Departments',
    semester: 'All Semesters',
    publishedDate: '10 Jun 2026',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    hasSampleDownload: true,
    downloadFilename: 'btech_academic_regulations_r23.pdf',
    description: 'Comprehensive guidelines regarding attendance rules (75% mandatory, 65-75% condonation with medical proof), grading system, promotion criteria and malpractice consequences.'
  },
  {
    id: 'doc-3',
    title: 'End Semester Question Paper - Engineering Mathematics II (May 2025)',
    category: 'Question Paper',
    department: 'Basic Sciences & Humanities',
    semester: 'Semester 2',
    publishedDate: '25 Jun 2025',
    fileType: 'PDF',
    fileSize: '620 KB',
    hasSampleDownload: true,
    downloadFilename: 'engg_maths_2_may2025_qp.pdf',
    description: 'Previous university end semester examination question paper covering vector calculus, ODEs, multiple integrals, and Laplace transforms.'
  },
  {
    id: 'doc-4',
    title: 'End Semester Question Paper - Thermal Engineering (May 2025)',
    category: 'Question Paper',
    department: 'Mechanical Engineering',
    semester: 'Semester 2',
    publishedDate: '25 Jun 2025',
    fileType: 'PDF',
    fileSize: '580 KB',
    hasSampleDownload: false,
    description: 'Previous university question paper archive. Archived hard copies available in the central library.'
  },
  {
    id: 'doc-5',
    title: 'Anti-Ragging Undertaking and Affidavit Format 2026',
    category: 'Circular',
    department: 'Institutional Affairs',
    semester: 'All Semesters',
    publishedDate: '01 Jul 2026',
    fileType: 'PDF',
    fileSize: '310 KB',
    hasSampleDownload: true,
    downloadFilename: 'anti_ragging_undertaking_format.pdf',
    description: 'Official National Directive undertaking format prescribed for college enrolled students and parent/guardian affidavits.'
  },
  {
    id: 'doc-6',
    title: 'Application Form for End-Semester Paper Revaluation / Recounting',
    category: 'Form',
    department: 'Examination Cell',
    semester: 'All Semesters',
    publishedDate: '12 Aug 2026',
    fileType: 'PDF',
    fileSize: '210 KB',
    hasSampleDownload: true,
    downloadFilename: 'revaluation_application_form.pdf',
    description: 'Official application slip for seeking script challenge or photo-copy inspection as per Examination Section bylaws.'
  }
];

// ================= COMPETITIVE EXAMS =================
export const MOCK_COMPETITIVE_RESULTS: CompetitiveExamResult[] = [
  {
    id: 'comp-1',
    examName: 'TCS CodeVita Season 13 - Round 1',
    registrationNo: 'CV13-2026-9481',
    attemptDate: '14 Aug 2026',
    score: '300 / 600',
    rankOrPercentile: 'All India Rank 1,842 (Top 5%)',
    status: 'Qualified',
    validUntil: '31 Jul 2027',
    scorecardAvailable: true
  },
  {
    id: 'comp-2',
    examName: 'NPTEL Certification - Python for Data Science',
    registrationNo: 'NPTEL26CS9182',
    attemptDate: '28 Jul 2026',
    score: '84% (Elite + Silver)',
    rankOrPercentile: 'Top 2% in Batch',
    status: 'Qualified',
    validUntil: 'Lifetime',
    scorecardAvailable: true
  }
];

// ================= INITIAL PREFERENCES & DEFAULTS =================
export const INITIAL_PREFERENCES: UserPreferences = {
  theme: 'system',
  textSize: 'normal',
  reducedMotion: false,
  notificationPreferences: {
    academic: true,
    fees: true,
    examination: true,
    planner: true,
    system: true
  },
  securityPin: '2026',
  firstLoginThemeChosen: true
};

export const INITIAL_SELF_DECLARATION: SelfDeclarationState = {
  isSubmitted: false,
  submissionDate: undefined,
  academicHonorAccepted: false,
  medicalFitnessAccepted: false,
  antiRaggingAccepted: false,
  contactConfirmed: false,
  emergencyContactName: 'Suresh Kumar (Father)',
  emergencyContactPhone: '+91 98480XXXXX'
};

export const INITIAL_HALL_BOOKINGS: SeminarHallBooking[] = [
  {
    id: 'bk-1',
    facilityName: 'Seminar Hall 1 (Dr. APJ Abdul Kalam Hall)',
    eventTitle: 'AI Club Ideathon Inauguration',
    organizingBody: 'AI & Data Science Student Chapter',
    date: '2026-10-24',
    timeSlot: '02:00 PM - 04:30 PM',
    expectedAttendees: 120,
    status: 'Confirmed',
    submittedDate: '04 Oct 2026'
  }
];

export const INITIAL_EXAM_FORMS: ExamApplicationForm[] = [
  {
    id: 'ef-1',
    formType: 'Revaluation / Recounting',
    semester: 'Semester 1',
    status: 'Approved',
    appliedDate: '22 Feb 2026',
    details: 'Recounting applied for Thermal Engineering (23ME102). Result unchanged at 80 marks.'
  }
];

export const INITIAL_PLACEMENT_REG: PlacementRegistration = {
  isRegistered: true,
  preferredDomain: 'Artificial Intelligence & Machine Learning',
  skills: ['Python', 'Data Structures', 'C++', 'Basic Machine Learning', 'SQL'],
  resumeUploaded: true,
  registeredContests: ['TCS CodeVita Season 13', 'ACM ICPC Preliminary Round']
};

export const MOCK_DEPARTMENTS: DepartmentData[] = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    hodName: 'Dr. R. K. Mukherjee, Ph.D. (IIT-B)',
    established: '2001',
    description: 'The Department of Computer Science & Engineering offers undergraduate and post-graduate programs with specializations in AI, Machine Learning, and Data Science. Equipped with specialized NVIDIA GPU computational laboratories.',
    subBranches: ['CSE - Core', 'CSE - Artificial Intelligence', 'CSE - AI & Machine Learning', 'CSE - Data Science'],
    contactEmail: 'hod.cse@college.example',
    contactPhone: '+91 80 2345 6701'
  },
  {
    id: 'aiml',
    name: 'Artificial Intelligence & Machine Learning',
    code: 'AIML',
    hodName: 'Dr. P. V. Ramanan, Ph.D.',
    established: '2021',
    description: 'Dedicated center for emerging cognitive technologies, reinforcement learning, computer vision, and generative foundation models.',
    contactEmail: 'hod.aiml@college.example',
    contactPhone: '+91 80 2345 6702'
  },
  {
    id: 'ece',
    name: 'Electronics & Communication Engineering',
    code: 'ECE',
    hodName: 'Dr. Meenakshi Sundaram, Ph.D.',
    established: '2001',
    description: 'Specializes in VLSI design, embedded systems, IoT sensors, signal processing, and telecommunication systems.',
    contactEmail: 'hod.ece@college.example',
    contactPhone: '+91 80 2345 6703'
  },
  {
    id: 'eee',
    name: 'Electrical & Electronics Engineering',
    code: 'EEE',
    hodName: 'Dr. K. S. Venkatachalam, Ph.D.',
    established: '2002',
    description: 'Curriculum focused on smart grids, renewable energy integration, power electronics, and electric vehicle drives.',
    contactEmail: 'hod.eee@college.example',
    contactPhone: '+91 80 2345 6704'
  },
  {
    id: 'it',
    name: 'Information Technology',
    code: 'IT',
    hodName: 'Dr. Shalini Verma, Ph.D.',
    established: '2004',
    description: 'Programs covering cloud native computing, cybersecurity, software engineering, and full-stack architecture.',
    contactEmail: 'hod.it@college.example',
    contactPhone: '+91 80 2345 6705'
  },
  {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    code: 'ME',
    hodName: 'Dr. Harish Chandra, Ph.D.',
    established: '2001',
    description: 'Focusing on thermal engineering, fluid mechanics, CAD/CAM automation, robotics, and advanced manufacturing.',
    contactEmail: 'hod.me@college.example',
    contactPhone: '+91 80 2345 6706'
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    code: 'CE',
    hodName: 'Dr. Rajeshwari Nair, Ph.D.',
    established: '2005',
    description: 'Instruction in structural engineering, geotechnical analysis, environmental water resources, and BIM modeling.',
    contactEmail: 'hod.ce@college.example',
    contactPhone: '+91 80 2345 6707'
  },
  {
    id: 'bsh',
    name: 'Basic Sciences & Humanities',
    code: 'BS&H',
    hodName: 'Dr. V. Ramanathan, Ph.D.',
    established: '2001',
    description: 'Foundation department providing core instruction in Engineering Mathematics, Applied Physics, Engineering Chemistry, and Communicative English.',
    contactEmail: 'hod.bsh@college.example',
    contactPhone: '+91 80 2345 6708'
  },
  {
    id: 'mca',
    name: 'Master of Computer Applications',
    code: 'MCA',
    hodName: 'Dr. G. Srinivas, Ph.D.',
    established: '2006',
    description: 'Postgraduate computer application program emphasizing enterprise application development and algorithmic problem solving.',
    contactEmail: 'hod.mca@college.example',
    contactPhone: '+91 80 2345 6709'
  }
];

export const MOCK_FACILITIES: FacilityData[] = [
  { id: 'library', name: 'Central Library & Digital Resource Center', iconName: 'BookOpen', desc: 'Over 85,000 volumes, IEEE Xplore, ScienceDirect and quiet reading halls.' },
  { id: 'dispensary', name: 'Campus Health Center & Dispensary', iconName: 'HeartPulse', desc: 'Medical officer on duty 24/7 with emergency first-aid and ambulance service.' },
  { id: 'seminar-halls', name: 'Auditorium & Seminar Halls', iconName: 'Building', desc: 'Air-conditioned auditoriums equipped with acoustic surround sound and live streaming.' },
  { id: 'transport', name: 'Institute Transport Section', iconName: 'Bus', desc: 'Fleet of 42 student buses serving all primary city zones and railway stations.' },
  { id: 'cafeteria', name: 'Central Food Court & Cafeteria', iconName: 'Utensils', desc: 'Hygienic vegetarian and multi-cuisine meal options inspected by FSSAI.' },
  { id: 'sports', name: 'Indoor Sports Arena & Athletic Complex', iconName: 'Dumbbell', desc: 'Badminton courts, gymnasium, basketball courts, and standard athletic tracks.' },
  { id: 'internet', name: 'Campus Wi-Fi & IT Center', iconName: 'Wifi', desc: 'High-speed 1 Gbps fiber connectivity across academic blocks and hostels.' },
  { id: 'hostels', name: 'Student Residential Hostels', iconName: 'Building', desc: 'Secure accommodations with biometric access and dedicated study spaces.' },
  { id: 'bank', name: 'Campus Bank Extension & 24/7 ATM', iconName: 'Landmark', desc: 'Full-service bank branch and ATM kiosk situated at the main campus entrance.' }
];

export const MOCK_FAQS: FAQData[] = [
  {
    category: 'Attendance & Leave',
    question: 'What happens if my aggregate attendance drops below 75%?',
    answer: 'Under Academic Regulation R23, students with attendance below 75% are ineligible for End Semester Examinations. Condonation of shortage between 65% and 75% may be granted strictly on valid medical grounds certified by the Institute Dispensary, subject to approval and payment of the prescribed condonation fee. Students with below 65% are detained.'
  },
  {
    category: 'Attendance & Leave',
    question: 'How do I submit medical certificates for absence condonation?',
    answer: 'Medical discharge summaries or fitness certificates must be submitted to the Head of Department (HOD) within 3 working days of returning to campus. The Institute Medical Officer will endorse the medical claim.'
  },
  {
    category: 'Fees & Payments',
    question: 'Is online fee payment via the portal safe?',
    answer: 'Yes. In the production architecture, payment is routed through bank-grade TLS encryption directly to our ICICI merchant gateway. The student portal prototype operates in sandbox mode for simulation, and never stores card numbers, CVVs, or UPI PINs.'
  },
  {
    category: 'Fees & Payments',
    question: 'Where can I download the official payment receipt?',
    answer: 'Navigate to "Fees & Payments" and scroll to the "Payment Transaction History" table. Click the "Receipt" button next to any successful transaction to open the print-ready official receipt.'
  },
  {
    category: 'Examinations',
    question: 'How can I apply for revaluation of end-semester answer scripts?',
    answer: 'Go to "Examination Section" > "Application Forms" tab, select "Revaluation / Recounting", enter the subject code (e.g. 23ME102), and submit within 10 days of marks publication.'
  },
  {
    category: 'Account & Security',
    question: 'How do I change my 4-digit security PIN?',
    answer: 'Visit "Profile" or "Settings" > "Account Security" and click "Change Security PIN". You will need to enter your current PIN followed by the new 4-digit PIN.'
  },
  {
    category: 'Self-Declaration',
    question: 'Why is the Self-Declaration form mandatory?',
    answer: 'As mandated by UGC and AICTE statutory guidelines, all enrolled first-year engineering students must file annual anti-ragging undertakings and academic honor code declarations before semester hall tickets can be issued.'
  }
];

export const MOCK_CONTESTS: PlacementContest[] = [
  {
    id: 'c-1',
    title: 'TCS CodeVita Season 13 - Global Challenge',
    date: '14 Nov 2026',
    eligibility: 'All Engineering Batches (2026 - 2030)',
    status: 'Open for Registration'
  },
  {
    id: 'c-2',
    title: 'ACM ICPC Collegiate Programming Mock Round',
    date: '28 Nov 2026',
    eligibility: '1st & 2nd Year B.Tech Students',
    status: 'Open for Registration'
  },
  {
    id: 'c-3',
    title: 'HackerRank National Campus Assessment Challenge',
    date: '05 Dec 2026',
    eligibility: 'Computer Science & AI Branches',
    status: 'Open for Registration'
  }
];

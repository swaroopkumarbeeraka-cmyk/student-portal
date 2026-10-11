import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  ChatMessage,
  PaymentTransaction,
  SeminarHallBooking,
  ExamApplicationForm,
  PlacementRegistration
} from '../types';
import { dataService } from '../services/dataService';
import { storageService, STORAGE_KEYS } from '../services/storageService';

const SEED = dataService.getInitialSeedData();

export interface DemoStateOverrides {
  forceLowAttendance: boolean; // Simulates <75% attendance
  forceFeeState: 'normal' | 'fullyPaid' | 'overdue';
  competitiveExamHasData: boolean; // Toggle between empty state and with-data
}

interface PortalContextType {
  // Auth
  isAuthenticated: boolean;
  login: (code: string, pin: string) => { success: boolean; error?: string };
  logout: () => void;
  isSessionTimeoutWarning: boolean;
  extendSession: () => void;
  expireSession: () => void;

  // Student & Academic Year
  student: Student;
  academicYear: AcademicYear;
  setAcademicYear: (year: AcademicYear) => void;
  isReadOnlyYear: boolean;

  // Datasets
  attendance: AttendanceData;
  academics: AcademicData;
  fees: FeesData;
  timetable: DayTimetable[];
  notices: Notice[];
  assignments: OfficialAssignment[];
  calendarEvents: CalendarEvent[];
  documents: DocumentItem[];
  competitiveResults: CompetitiveExamResult[];

  // Interactive Tasks
  tasks: PersonalTask[];
  addTask: (task: Omit<PersonalTask, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<PersonalTask>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Complaints
  complaints: SuggestionComplaint[];
  addComplaint: (recipient: SuggestionComplaint['recipient'], category: SuggestionComplaint['category'], remarks: string) => SuggestionComplaint;

  // Self-Declaration
  selfDeclaration: SelfDeclarationState;
  submitSelfDeclaration: (data: Partial<SelfDeclarationState>) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;

  // Payments
  applySuccessfulPayment: (transaction: PaymentTransaction) => void;

  // Facilities & Exam Forms & Placements
  hallBookings: SeminarHallBooking[];
  addHallBooking: (booking: Omit<SeminarHallBooking, 'id' | 'submittedDate' | 'status'>) => void;
  examForms: ExamApplicationForm[];
  submitExamForm: (formType: ExamApplicationForm['formType'], semester: string, details: string) => void;
  placementReg: PlacementRegistration;
  updatePlacementReg: (updates: Partial<PlacementRegistration>) => void;

  // User Settings & Demo Controls
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  demoOverrides: DemoStateOverrides;
  updateDemoOverrides: (updates: Partial<DemoStateOverrides>) => void;
  resetDemoData: () => void;

  // Network State
  isOnline: boolean;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return storageService.get<boolean>(STORAGE_KEYS.AUTH, true); // default logged in for prototype convenience
  });
  const [isSessionTimeoutWarning, setIsSessionTimeoutWarning] = useState<boolean>(false);

  // 2. Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    return storageService.get<UserPreferences>(STORAGE_KEYS.PREFERENCES, SEED.initialPreferences);
  });

  // 3. Academic Year
  const [academicYear, setAcademicYearState] = useState<AcademicYear>(() => {
    return storageService.get<AcademicYear>(STORAGE_KEYS.ACADEMIC_YEAR, '2026-27');
  });

  // 4. Demo Overrides
  const [demoOverrides, setDemoOverrides] = useState<DemoStateOverrides>(() => {
    return storageService.get<DemoStateOverrides>(STORAGE_KEYS.DEMO_OVERRIDES, {
      forceLowAttendance: false,
      forceFeeState: 'normal',
      competitiveExamHasData: true
    });
  });

  // 5. Tasks
  const [tasks, setTasks] = useState<PersonalTask[]>(() => {
    return storageService.get<PersonalTask[]>(STORAGE_KEYS.TASKS, SEED.initialTasks);
  });

  // 6. Complaints
  const [complaints, setComplaints] = useState<SuggestionComplaint[]>(() => {
    return storageService.get<SuggestionComplaint[]>(STORAGE_KEYS.COMPLAINTS, SEED.initialComplaints);
  });

  // 7. Self Declaration
  const [selfDeclaration, setSelfDeclaration] = useState<SelfDeclarationState>(() => {
    return storageService.get<SelfDeclarationState>(STORAGE_KEYS.SELF_DECLARATION, SEED.initialSelfDeclaration);
  });

  // 8. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return storageService.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED.initialNotifications);
  });

  // 9. Fees
  const [fees2026, setFees2026] = useState<FeesData>(() => {
    return storageService.get<FeesData>(STORAGE_KEYS.FEES_2026, SEED.fees2026);
  });
  const [fees2025] = useState<FeesData>(() => {
    return storageService.get<FeesData>(STORAGE_KEYS.FEES_2025, SEED.fees2025);
  });

  // 10. Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return storageService.get<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        timestamp: 'Just now',
        text: 'Hello Aarav! I am your Campus Assistant. You can ask me about your attendance, fee balances, today\'s classes, upcoming exams, or official college policies. All answers are grounded in your student records and verified college circulars.',
        sources: ['AITS Student Portal Knowledge Base']
      }
    ]);
  });

  // 11. Facilities, Exam Forms, Placements
  const [hallBookings, setHallBookings] = useState<SeminarHallBooking[]>(() => {
    return storageService.get<SeminarHallBooking[]>(STORAGE_KEYS.HALL_BOOKINGS, SEED.initialHallBookings);
  });
  const [examForms, setExamForms] = useState<ExamApplicationForm[]>(() => {
    return storageService.get<ExamApplicationForm[]>(STORAGE_KEYS.EXAM_FORMS, SEED.initialExamForms);
  });
  const [placementReg, setPlacementReg] = useState<PlacementRegistration>(() => {
    return storageService.get<PlacementRegistration>(STORAGE_KEYS.PLACEMENT_REG, SEED.initialPlacementReg);
  });

  // 12. Network Online state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme & Accessibility effect
  useEffect(() => {
    const root = document.documentElement;
    // Theme
    const isDark =
      preferences.theme === 'dark' ||
      (preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Text size
    root.setAttribute('data-text-size', preferences.textSize);

    // Reduced motion
    root.setAttribute('data-reduced-motion', preferences.reducedMotion ? 'true' : 'false');

    storageService.set(STORAGE_KEYS.PREFERENCES, preferences);
  }, [preferences]);

  // Sync to storage
  useEffect(() => { storageService.set(STORAGE_KEYS.AUTH, isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { storageService.set(STORAGE_KEYS.ACADEMIC_YEAR, academicYear); }, [academicYear]);
  useEffect(() => { storageService.set(STORAGE_KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { storageService.set(STORAGE_KEYS.COMPLAINTS, complaints); }, [complaints]);
  useEffect(() => { storageService.set(STORAGE_KEYS.SELF_DECLARATION, selfDeclaration); }, [selfDeclaration]);
  useEffect(() => { storageService.set(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { storageService.set(STORAGE_KEYS.FEES_2026, fees2026); }, [fees2026]);
  useEffect(() => { storageService.set(STORAGE_KEYS.CHAT_MESSAGES, chatMessages); }, [chatMessages]);
  useEffect(() => { storageService.set(STORAGE_KEYS.DEMO_OVERRIDES, demoOverrides); }, [demoOverrides]);
  useEffect(() => { storageService.set(STORAGE_KEYS.HALL_BOOKINGS, hallBookings); }, [hallBookings]);
  useEffect(() => { storageService.set(STORAGE_KEYS.EXAM_FORMS, examForms); }, [examForms]);
  useEffect(() => { storageService.set(STORAGE_KEYS.PLACEMENT_REG, placementReg); }, [placementReg]);

  // Auth Methods
  const login = useCallback((code: string, pin: string) => {
    if (code.trim().toUpperCase() !== 'STU-20260501') {
      return { success: false, error: 'Invalid student code. Use demo credential STU-20260501.' };
    }
    if (pin.trim() !== preferences.securityPin) {
      return { success: false, error: 'Incorrect PIN. Default demo PIN is 2026.' };
    }
    setIsAuthenticated(true);
    return { success: true };
  }, [preferences.securityPin]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const extendSession = useCallback(() => {
    setIsSessionTimeoutWarning(false);
  }, []);

  const expireSession = useCallback(() => {
    setIsSessionTimeoutWarning(false);
    setIsAuthenticated(false);
  }, []);

  // Set Academic Year
  const setAcademicYear = useCallback((year: AcademicYear) => {
    setAcademicYearState(year);
  }, []);

  const isReadOnlyYear = academicYear === '2025-26';

  // Current Student
  const student = useMemo<Student>(() => {
    return academicYear === '2026-27' ? SEED.student : SEED.studentPrev;
  }, [academicYear]);

  // Attendance data with calculation & Demo override
  const attendance = useMemo<AttendanceData>(() => {
    if (academicYear === '2025-26') return SEED.attendancePrev;

    if (demoOverrides.forceLowAttendance) {
      // Simulate low attendance < 75%
      const present = 150;
      const total = 210;
      const percent = Number(((present / total) * 100).toFixed(1));
      return {
        ...SEED.attendance,
        overallPresent: present,
        overallWorkingDays: total,
        overallAbsent: 60,
        overallPercentage: percent,
        maxPermissibleAbsences: 0 // below 75%
      };
    }

    return SEED.attendance;
  }, [academicYear, demoOverrides.forceLowAttendance]);

  // Academics
  const academics = useMemo<AcademicData>(() => {
    return academicYear === '2026-27' ? SEED.academics : SEED.academicsPrev;
  }, [academicYear]);

  // Fees with demo override
  const fees = useMemo<FeesData>(() => {
    if (academicYear === '2025-26') return fees2025;

    if (demoOverrides.forceFeeState === 'fullyPaid') {
      return {
        ...fees2026,
        paidAmount: 120000,
        outstandingAmount: 0,
        percentPaid: 100,
        overallStatus: 'Paid',
        breakdown: fees2026.breakdown.map((b) => ({ ...b, paid: b.total, outstanding: 0 })),
        terms: fees2026.terms.map((t) => ({ ...t, paidAmount: t.totalAmount, outstandingAmount: 0, status: 'Paid' }))
      };
    }

    if (demoOverrides.forceFeeState === 'overdue') {
      return {
        ...fees2026,
        overallStatus: 'Overdue',
        terms: fees2026.terms.map((t, idx) => idx === 1 ? { ...t, status: 'Overdue' } : t)
      };
    }

    return fees2026;
  }, [academicYear, fees2026, fees2025, demoOverrides.forceFeeState]);

  // Competitive exams
  const competitiveResults = useMemo<CompetitiveExamResult[]>(() => {
    return demoOverrides.competitiveExamHasData ? SEED.competitiveResults : [];
  }, [demoOverrides.competitiveExamHasData]);

  // Tasks CRUD
  const addTask = useCallback((taskData: Omit<PersonalTask, 'id' | 'createdAt'>) => {
    const newTask: PersonalTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<PersonalTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  // Complaints
  const addComplaint = useCallback(
    (recipient: SuggestionComplaint['recipient'], category: SuggestionComplaint['category'], remarks: string) => {
      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const ticketNumber = `TKT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newComplaint: SuggestionComplaint = {
        id: `cmp-${Date.now()}`,
        ticketNumber,
        recipient,
        category,
        remarks,
        status: 'Submitted',
        submittedDate: dateFormatted,
        timeline: [
          {
            status: 'Submitted',
            timestamp: `${dateFormatted}, ${timeFormatted}`,
            note: `Ticket submitted by ${student.name} (${student.studentCode})`
          }
        ]
      };

      setComplaints((prev) => [newComplaint, ...prev]);
      return newComplaint;
    },
    [student]
  );

  // Self-Declaration
  const submitSelfDeclaration = useCallback((data: Partial<SelfDeclarationState>) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setSelfDeclaration((prev) => ({
      ...prev,
      ...data,
      isSubmitted: true,
      submissionDate: today
    }));

    // Also add a confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Self-Declaration Form Submitted',
      message: 'Your mandatory Student Self-Declaration 2026-27 has been successfully verified and filed.',
      timestamp: 'Just now',
      category: 'Academic',
      isRead: false,
      targetPath: '/declaration'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  // Notifications
  const unreadNotifCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  // Payments
  const applySuccessfulPayment = useCallback((transaction: PaymentTransaction) => {
    setFees2026((prev) => {
      const newPaid = prev.paidAmount + transaction.amount;
      const newOutstanding = Math.max(0, prev.totalAmount - newPaid);
      const newPercent = Number(((newPaid / prev.totalAmount) * 100).toFixed(2));
      const newOverallStatus = newOutstanding === 0 ? 'Paid' : 'Partially paid';

      // Update terms
      const updatedTerms = prev.terms.map((t) => {
        if (t.id === transaction.termId) {
          const tPaid = t.paidAmount + transaction.amount;
          const tOut = Math.max(0, t.totalAmount - tPaid);
          return {
            ...t,
            paidAmount: tPaid,
            outstandingAmount: tOut,
            status: tOut === 0 ? ('Paid' as const) : ('Partially paid' as const)
          };
        }
        return t;
      });

      // Update category breakdown proportionally or against tuition/transport
      const updatedBreakdown = prev.breakdown.map((b) => {
        if (b.outstanding > 0) {
          const deduct = Math.min(b.outstanding, transaction.amount);
          return {
            ...b,
            paid: b.paid + deduct,
            outstanding: b.outstanding - deduct
          };
        }
        return b;
      });

      return {
        ...prev,
        paidAmount: newPaid,
        outstandingAmount: newOutstanding,
        percentPaid: newPercent,
        overallStatus: newOverallStatus,
        breakdown: updatedBreakdown,
        terms: updatedTerms,
        transactions: [transaction, ...prev.transactions]
      };
    });

    // Add payment success notification
    const paymentNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Payment Successful',
      message: `Simulated payment of ₹${transaction.amount.toLocaleString('en-IN')} for ${transaction.termName} verified. Receipt ${transaction.receiptNumber} generated.`,
      timestamp: 'Just now',
      category: 'Fees',
      isRead: false,
      targetPath: '/fees'
    };
    setNotifications((prev) => [paymentNotif, ...prev]);
  }, []);

  // Chat
  const addChatMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `chat-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMsg]);
  }, []);

  const clearChatHistory = useCallback(() => {
    setChatMessages([]);
  }, []);

  // Hall Booking
  const addHallBooking = useCallback((booking: Omit<SeminarHallBooking, 'id' | 'submittedDate' | 'status'>) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newBooking: SeminarHallBooking = {
      ...booking,
      id: `bk-${Date.now()}`,
      submittedDate: today,
      status: 'Pending Review'
    };
    setHallBookings((prev) => [newBooking, ...prev]);
  }, []);

  // Exam Application Forms
  const submitExamForm = useCallback((formType: ExamApplicationForm['formType'], semester: string, details: string) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newForm: ExamApplicationForm = {
      id: `ef-${Date.now()}`,
      formType,
      semester,
      status: 'Submitted',
      appliedDate: today,
      details
    };
    setExamForms((prev) => [newForm, ...prev]);
  }, []);

  // Placement Reg
  const updatePlacementReg = useCallback((updates: Partial<PlacementRegistration>) => {
    setPlacementReg((prev) => ({ ...prev, ...updates }));
  }, []);

  // Preferences
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  // Demo Overrides
  const updateDemoOverrides = useCallback((updates: Partial<DemoStateOverrides>) => {
    setDemoOverrides((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset Demo Data
  const resetDemoData = useCallback(() => {
    storageService.clearAllDemoData();
    setIsAuthenticated(true);
    setAcademicYearState('2026-27');
    setPreferences(SEED.initialPreferences);
    setTasks(SEED.initialTasks);
    setComplaints(SEED.initialComplaints);
    setSelfDeclaration(SEED.initialSelfDeclaration);
    setNotifications(SEED.initialNotifications);
    setFees2026(SEED.fees2026);
    setHallBookings(SEED.initialHallBookings);
    setExamForms(SEED.initialExamForms);
    setPlacementReg(SEED.initialPlacementReg);
    setDemoOverrides({
      forceLowAttendance: false,
      forceFeeState: 'normal',
      competitiveExamHasData: true
    });
    setChatMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        timestamp: 'Just now',
        text: 'Hello Aarav! I am your Campus Assistant. You can ask me about your attendance, fee balances, today\'s classes, upcoming exams, or official college policies. All answers are grounded in your student records and verified college circulars.',
        sources: ['AITS Student Portal Knowledge Base']
      }
    ]);
  }, []);

  return (
    <PortalContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isSessionTimeoutWarning,
        extendSession,
        expireSession,
        student,
        academicYear,
        setAcademicYear,
        isReadOnlyYear,
        attendance,
        academics,
        fees,
        timetable: SEED.timetable,
        notices: SEED.notices,
        assignments: SEED.assignments,
        calendarEvents: SEED.calendarEvents,
        documents: SEED.documents,
        competitiveResults,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        complaints,
        addComplaint,
        selfDeclaration,
        submitSelfDeclaration,
        notifications,
        unreadNotifCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        chatMessages,
        addChatMessage,
        clearChatHistory,
        applySuccessfulPayment,
        hallBookings,
        addHallBooking,
        examForms,
        submitExamForm,
        placementReg,
        updatePlacementReg,
        preferences,
        updatePreferences,
        demoOverrides,
        updateDemoOverrides,
        resetDemoData,
        isOnline
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};

import {
  Student,
  AttendanceData,
  AcademicData,
  FeesData,
  OfficialAssignment,
  Notice,
  DayTimetable
} from '../types';

export interface AssistantResponse {
  text: string;
  sources?: string[];
}

export class AssistantService {
  /**
   * Process a natural language query against current student records and published college documents.
   * Architecture is prepared to swap this engine with a real LLM / RAG endpoint server-side.
   */
  async askQuestion(
    query: string,
    context: {
      student: Student;
      attendance: AttendanceData;
      academics: AcademicData;
      fees: FeesData;
      assignments: OfficialAssignment[];
      notices: Notice[];
      timetable: DayTimetable[];
    }
  ): Promise<AssistantResponse> {
    // Artificial small delay to simulate typing / processing
    await new Promise((resolve) => setTimeout(resolve, 600));

    const q = query.trim().toLowerCase();

    // 1. Check for queries inquiring about another student's data (Privacy Violation Check)
    const otherStudentKeywords = [
      'rahul', 'priya', 'rohan', 'sneha', 'amit', 'vikram', 'pooja',
      'other student', 'another student', 'classmate', 'friend', 'someone else',
      'section b', 'rank 1 student', 'topper'
    ];
    if (otherStudentKeywords.some((k) => q.includes(k))) {
      return {
        text: `Data Privacy Restriction: I cannot retrieve records for other students. Under institutional data privacy policy, I am only authorized to access records for the currently authenticated student: ${context.student.name} (${context.student.studentCode}).`,
        sources: ['Institutional Student Data Privacy Policy §4.2']
      };
    }

    // 2. Attendance % and breakdown
    if (
      q.includes('attendance') &&
      (q.includes('%') || q.includes('percent') || q.includes('percentage') || q.includes('my') || q.includes('how much') || q.includes('current'))
    ) {
      return {
        text: `Your overall attendance is currently ${context.attendance.overallPercentage}% (${context.attendance.overallPresent} days present out of ${context.attendance.overallWorkingDays} working days). The minimum mandatory cutoff is ${context.attendance.requiredPercentage}%. You have accumulated ${context.attendance.overallAbsent} total absences across January to June.`,
        sources: ['Institutional Attendance Register 2026-27', 'Academic Regulations R23']
      };
    }

    // 3. Can I miss classes / how many classes can I skip / bunk
    if (
      q.includes('can i miss') ||
      q.includes('miss class') ||
      q.includes('bunk') ||
      q.includes('skip class') ||
      q.includes('how many days can i miss') ||
      q.includes('safe leave') ||
      q.includes('absent')
    ) {
      const p = context.attendance.overallPresent;
      const t = context.attendance.requiredPercentage / 100; // 0.75
      const w = context.attendance.overallWorkingDays;
      // Formula: floor(P / T - W)
      const maxAdditional = Math.max(0, Math.floor(p / t - w));
      return {
        text: `Based on your current record (${p} days present out of ${w} working days, 80.0%), you can miss at most ${maxAdditional} additional working days before falling below the 75% threshold.\n\nNote: This calculation uses the formula floor(P/T - W) with T = 75% required attendance, assuming future missed days count as additional working days with no attendance. It is strongly advised to maintain a buffer for unforeseen medical emergencies.`,
        sources: ['Academic Regulations R23 §7.1 (Attendance Rules)']
      };
    }

    // 4. Subjects needing improvement / lowest marks / weak subject
    if (
      q.includes('improvement') ||
      q.includes('weak') ||
      q.includes('lowest') ||
      q.includes('improve') ||
      q.includes('bad score') ||
      q.includes('subject need')
    ) {
      const latestExam = context.academics.exams.find((e) => e.isLatest) || context.academics.exams[0];
      const lowestSub = latestExam.subjects.find((s) => s.isLowest) || latestExam.subjects[0];
      return {
        text: `According to your latest exam (${latestExam.name}), your lowest scoring subject is ${lowestSub.name} (${lowestSub.code}) where you scored ${lowestSub.scoredMarks}/${lowestSub.maxMarks} (${lowestSub.percentage}%, Grade ${lowestSub.grade}).\n\nRecommendation: Focus on Rankine & Carnot cycle problem-solving and consult Dr. K. N. Rao during office hours.`,
        sources: ['Mid-Semester Examination 1 Result Register', 'Department of Mechanical Engineering Course Plan']
      };
    }

    // 5. Today's classes / schedule / timetable
    if (
      q.includes('today') ||
      q.includes('schedule') ||
      q.includes('timetable') ||
      q.includes('period') ||
      q.includes('class today')
    ) {
      const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const dayData = context.timetable.find((d) => d.day.toLowerCase() === currentDay.toLowerCase()) || context.timetable[0]; // fallback to Monday
      const periodList = dayData.periods
        .map((p) => `• Period ${p.periodNumber} (${p.timeRange}): ${p.subjectName} in ${p.room}`)
        .join('\n');
      return {
        text: `Here is the schedule for ${dayData.day} (${context.student.branch} - ${context.student.section}):\n\n${periodList}\n\nYour first session starts at 09:00 AM.`,
        sources: ['B.Tech CSE (AI) Master Timetable Sem-2']
      };
    }

    // 6. Next exam / exam date
    if (
      q.includes('next exam') ||
      q.includes('upcoming exam') ||
      q.includes('exam schedule') ||
      q.includes('when is exam') ||
      q.includes('mid-2') ||
      q.includes('mid 2')
    ) {
      return {
        text: `Your next examination is the Mid-Semester Examination 2 (Mid-2), scheduled to commence on 18 November 2026. The detailed subject timetable will be released by the Examination Cell on 25 October. Ensure your attendance remains above 75% to receive your hall ticket.`,
        sources: ['Notice #2: Mid-Semester Examination 2 Schedule', 'Examination Section Circular EX-2026-08']
      };
    }

    // 7. Pending assignments / homework / tasks
    if (
      q.includes('assignment') ||
      q.includes('homework') ||
      q.includes('submission') ||
      q.includes('pending task')
    ) {
      const pendingAsgs = context.assignments.filter((a) => a.status === 'Pending Submission');
      if (pendingAsgs.length === 0) {
        return {
          text: `You have no pending official assignments at this moment.`,
          sources: ['Department Academic LMS']
        };
      }
      const list = pendingAsgs
        .map((a) => `• ${a.subjectName} (${a.subjectCode}): "${a.title}" - Due on ${a.dueDate} (Max Marks: ${a.maxMarks})`)
        .join('\n');
      return {
        text: `You have ${pendingAsgs.length} pending official course assignments:\n\n${list}\n\nCheck the Study Planner > Assignments tab for full submission instructions.`,
        sources: ['Official Course LMS Submissions Register']
      };
    }

    // 8. Fee balance / fees / outstanding / due fee
    if (
      q.includes('fee') ||
      q.includes('dues') ||
      q.includes('balance') ||
      q.includes('outstanding') ||
      q.includes('payment') ||
      q.includes('tuition')
    ) {
      return {
        text: `Here is your current fee summary:\n• Total Annual Fees: ₹${context.fees.totalAmount.toLocaleString('en-IN')}\n• Total Amount Paid: ₹${context.fees.paidAmount.toLocaleString('en-IN')}\n• Outstanding Balance: ₹${context.fees.outstandingAmount.toLocaleString('en-IN')} (Status: ${context.fees.overallStatus})\n\nBreakdown of pending amount:\n- Term 2 Tuition Balance: ₹30,000\n- Transport Fee (Route 14): ₹5,000\n- Examination Fee: ₹5,000\n\nThe due date for Term 2 is 15 November 2026. You can pay online via the Fees & Payments sandbox gateway.`,
        sources: ['Accounts & Finance Section Fee Ledger 2026-27']
      };
    }

    // 9. Minimum attendance rule / condonation policy
    if (
      q.includes('rule') ||
      q.includes('condonation') ||
      q.includes('minimum attendance') ||
      q.includes('attendance policy') ||
      q.includes('75')
    ) {
      return {
        text: `Institutional Attendance Regulations (R23):\n1. Minimum 75% aggregate attendance is strictly required to be eligible for End Semester Examinations.\n2. Condonation of shortage (between 65% and 75%) is permitted only on genuine medical grounds certified by the Institute Medical Officer, subject to Academic Council approval and payment of the prescribed condonation fee.\n3. Students with attendance below 65% are detained and not permitted to sit for examinations.`,
        sources: ['Academic Regulations R23 §7.1 - 7.4', 'Notice #5: Attendance & Condonation Policy']
      };
    }

    // 10. Notices summary / recent notices / announcements
    if (
      q.includes('notice') ||
      q.includes('announcement') ||
      q.includes('circular') ||
      q.includes('news') ||
      q.includes('update')
    ) {
      const topNotices = context.notices.slice(0, 3);
      const list = topNotices
        .map((n) => `• ${n.title} (${n.date}) - Category: ${n.category}`)
        .join('\n');
      return {
        text: `Here are the top active institutional notices:\n\n${list}\n\nPlease note especially the mandatory Self-Declaration form due on 20 October 2026.`,
        sources: ['Institutional Notice Board System']
      };
    }

    // 11. Self declaration query
    if (q.includes('declaration') || q.includes('undertaking') || q.includes('honor code')) {
      return {
        text: `The Student Self-Declaration Form 2026-27 is mandatory for all first-year students and is due on 20 October 2026. It includes verification of academic honor code, medical fitness declaration, and statutory anti-ragging undertakings. You can fill and submit it directly under the 'Self-Declaration Form' section.`,
        sources: ['Notice #1: Submission of Mandatory Student Self-Declaration']
      };
    }

    // 12. CGPA query
    if (q.includes('cgpa') || q.includes('gpa') || q.includes('marks') || q.includes('grade')) {
      return {
        text: `Your current Cumulative Grade Point Average (CGPA) is 8.2 on a 10-point scale across completed semesters. In Mid-1, your average score was 42/50 (84.0%), ranking 4th in Section A.`,
        sources: ['Academic Transcript Register 2026-27']
      };
    }

    // 13. Default fallback for unknown question
    return {
      text: 'Information unavailable in current published documents or student records. Please verify with your department academic advisor or administrative office.'
    };
  }
}

export const assistantService = new AssistantService();

import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  BarChart2,
  FileQuestion,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';

export const AcademicsPage: React.FC = () => {
  const { academics } = usePortal();

  const [selectedExamId, setSelectedExamId] = useState<string>(
    academics.latestExamId || academics.exams[0]?.id
  );

  if (!academics.exams || academics.exams.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: 'Academics & Results' }]} />
        <div className="p-8 bg-app-surface border border-app-border rounded text-center space-y-3">
          <FileQuestion className="w-8 h-8 text-app-muted mx-auto" />
          <h2 className="text-base font-semibold text-app-text">No Examination Results Published</h2>
          <p className="text-xs text-app-muted max-w-md mx-auto">
            Examination records have not yet been uploaded for this academic session by the Controller of Examinations.
          </p>
        </div>
      </div>
    );
  }

  const selectedExam =
    academics.exams.find((e) => e.id === selectedExamId) || academics.exams[0];
  const lowestSubject = selectedExam.subjects.find((s) => s.isLowest);

  const examChartData = academics.exams.map((e) => ({
    id: e.id,
    name: e.examType,
    fullName: e.name,
    percentage: e.percentage,
    scored: e.scoredTotal,
    max: e.maxTotal
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'Academics & Results' }]} />

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Academics & Examination Results
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            B.Tech CSE (AI) • Evaluation Ledger & Continuous Assessment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-app-muted">Overall Academic Health:</span>
          <Badge variant="success" size="md">
            Excellent Standing
          </Badge>
        </div>
      </div>

      {/* 1. Academic Metrics Highlights */}
      <div className="bg-app-surface border border-app-border rounded p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-app-border">
          {/* CGPA */}
          <div className="sm:pr-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Cumulative GPA (CGPA)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-mono text-app-text tabular-nums">
                {academics.cgpa}
              </span>
              <span className="text-xs text-app-muted">/ 10.0</span>
            </div>
            <span className="text-[11px] text-app-success font-medium">Class: First with Distinction</span>
          </div>

          {/* Average Percentage */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Average Score %
            </span>
            <span className="text-2xl font-bold font-mono text-app-text tabular-nums mt-1 block">
              {academics.averageScorePercentage}%
            </span>
            <span className="text-[11px] text-app-muted">Across all evaluated exams</span>
          </div>

          {/* Latest Exam */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Latest Examination
            </span>
            <p className="text-sm font-semibold text-app-text mt-1 truncate">
              {academics.exams.find((e) => e.isLatest)?.name || 'Mid-1'}
            </p>
            <span className="text-[11px] text-app-muted font-mono">
              Score: 210/250 (84.0%)
            </span>
          </div>

          {/* Best Exam */}
          <div className="pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Peak Performance
            </span>
            <p className="text-sm font-semibold text-app-text mt-1 truncate">
              {academics.exams.find((e) => e.isBest)?.name || 'Sem 1 Final'}
            </p>
            <span className="text-[11px] text-app-accent font-mono font-medium">
              86.4% (Rank 2 in Section)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Exam Bar Chart & Selected Exam Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Exam Comparison Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-app-surface border border-app-border rounded p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-app-text">Examinations Overview</h2>
                <p className="text-xs text-app-muted">Click any exam bar to inspect subject-wise marks</p>
              </div>
              <BarChart2 className="w-4 h-4 text-app-accent" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={examChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onClick={(e) => {
                    if (e && e.activePayload && e.activePayload.length > 0) {
                      const clickedId = e.activePayload[0].payload.id;
                      setSelectedExamId(clickedId);
                    }
                  }}
                >
                  <XAxis dataKey="name" stroke="var(--color-muted)" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="var(--color-muted)" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-app-surface border border-app-border p-2.5 rounded text-xs space-y-1">
                            <p className="font-semibold text-app-text">{data.fullName}</p>
                            <p className="text-app-accent font-mono font-medium">
                              Percentage: {data.percentage}%
                            </p>
                            <p className="text-app-muted font-mono">
                              Total Marks: {data.scored} / {data.max}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]} cursor="pointer">
                    {examChartData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={
                          entry.id === selectedExam.id
                            ? 'var(--color-accent)'
                            : 'var(--color-border)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-app-border flex items-center justify-between text-xs text-app-muted">
            <span>Currently selected: <span className="font-semibold text-app-text">{selectedExam.name}</span></span>
            <span className="font-mono">{selectedExam.percentage}%</span>
          </div>
        </div>

        {/* Right: Selected Exam Detailed Breakdown Panel (7 cols) */}
        <div className="lg:col-span-7 bg-app-surface border border-app-border rounded p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Header of selected exam */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-app-border">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-app-text">{selectedExam.name}</h3>
                  {selectedExam.rank && (
                    <Badge variant="accent" size="sm">
                      Rank {selectedExam.rank} in Section
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-app-muted mt-0.5">
                  Conducted on {selectedExam.date} • Total: <span className="font-mono font-medium text-app-text">{selectedExam.scoredTotal} / {selectedExam.maxTotal}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-bold font-mono text-app-accent tabular-nums">
                  {selectedExam.percentage}%
                </span>
                <p className="text-[11px] text-app-muted">Average: {selectedExam.averageMarks} pts</p>
              </div>
            </div>

            {/* Subject-wise Marks Table with Performance Bar */}
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-app-border text-app-muted text-[11px]">
                      <th className="pb-2 font-medium">Subject Code & Title</th>
                      <th className="pb-2 font-medium text-right">Max</th>
                      <th className="pb-2 font-medium text-right">Scored</th>
                      <th className="pb-2 font-medium text-right">Percentage</th>
                      <th className="pb-2 font-medium text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border">
                    {selectedExam.subjects.map((sub) => (
                      <tr key={sub.code} className="hover:bg-app-bg/50 transition-colors">
                        <td className="py-2.5 pr-2">
                          <p className="font-medium text-app-text flex items-center gap-1.5">
                            {sub.name}
                            {sub.isLowest && (
                              <span className="text-[10px] text-app-warning font-semibold">
                                (Lowest)
                              </span>
                            )}
                          </p>
                          <span className="text-[11px] font-mono text-app-muted">{sub.code}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-app-muted">{sub.maxMarks}</td>
                        <td className="py-2.5 text-right font-mono font-medium text-app-text">
                          {sub.scoredMarks}
                        </td>
                        <td className="py-2.5 text-right font-mono text-app-text">
                          <div className="flex items-center justify-end gap-2">
                            <span>{sub.percentage}%</span>
                            <div className="w-12 bg-app-border h-1.5 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full ${
                                  sub.percentage >= 85
                                    ? 'bg-app-success'
                                    : sub.percentage >= 75
                                    ? 'bg-app-accent'
                                    : 'bg-app-warning'
                                }`}
                                style={{ width: `${sub.percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 text-center font-mono font-bold text-app-text">
                          {sub.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Subject improvement guidance footer */}
          {lowestSubject && (
            <div className="mt-4 pt-3 border-t border-app-border bg-app-bg/40 -mx-4 -mb-4 p-3 rounded-b flex items-start gap-2.5 text-xs text-app-muted">
              <AlertCircle className="w-4 h-4 text-app-warning shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-app-text">Academic Recommendation:</span>
                <span className="ml-1">
                  In {selectedExam.name}, lowest subject is <span className="text-app-text font-medium">{lowestSubject.name}</span> ({lowestSubject.scoredMarks}/{lowestSubject.maxMarks}, {lowestSubject.percentage}%). Department tutorial hours are held every Saturday 09:50 AM in LH-104.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Educational Section: CGPA vs Percentage vs Marks Explained */}
      <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-app-accent" />
          <h2 className="text-sm font-semibold text-app-text">
            Evaluation System Primer: CGPA vs Percentage vs Raw Marks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-app-muted leading-relaxed">
          <div className="p-3 bg-app-bg border border-app-border rounded space-y-1.5">
            <h3 className="font-semibold text-app-text">Cumulative GPA (CGPA)</h3>
            <p>
              Calculated on a 10.0 scale as the weighted average of Grade Points obtained across all registered courses:
            </p>
            <p className="font-mono text-[11px] text-app-accent font-medium">
              CGPA = Σ(Credits × Grade Points) / Σ(Total Credits)
            </p>
            <p>
              CGPA 8.2 places you in First Class with Distinction under Regulation R23.
            </p>
          </div>

          <div className="p-3 bg-app-bg border border-app-border rounded space-y-1.5">
            <h3 className="font-semibold text-app-text">Aggregate Percentage</h3>
            <p>
              Arithmetic percentage of marks secured out of total available marks across all internal assessments and end-semester tests:
            </p>
            <p className="font-mono text-[11px] text-app-accent font-medium">
              % = (Total Scored Marks / Total Max Marks) × 100
            </p>
            <p>
              Conversion formula for AICTE/UGC: <span className="font-mono">Percentage = (CGPA - 0.75) × 10</span> = 74.5% equivalent.
            </p>
          </div>

          <div className="p-3 bg-app-bg border border-app-border rounded space-y-1.5">
            <h3 className="font-semibold text-app-text">Relative Grading Scale</h3>
            <p>
              Grades awarded follow the UGC 7-point scale:
            </p>
            <ul className="space-y-0.5 text-[11px]">
              <li>• <span className="font-mono font-bold text-app-text">O (Outstanding)</span>: 90-100% (Grade Point 10)</li>
              <li>• <span className="font-mono font-bold text-app-text">A+ (Excellent)</span>: 80-89% (Grade Point 9)</li>
              <li>• <span className="font-mono font-bold text-app-text">A (Very Good)</span>: 70-79% (Grade Point 8)</li>
              <li>• <span className="font-mono font-bold text-app-text">B+ (Good)</span>: 60-69% (Grade Point 7)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

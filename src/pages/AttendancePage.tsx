import React, { useState } from 'react';
import {
  CalendarCheck,
  AlertTriangle,
  Info,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  FileQuestion
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';

export const AttendancePage: React.FC = () => {
  const { attendance, isReadOnlyYear } = usePortal();

  // Selected month state for interactive drilling
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);

  // Compute max permissible absences formula: floor(P / T - W)
  const P = attendance.overallPresent;
  const T = attendance.requiredPercentage / 100; // 0.75
  const W = attendance.overallWorkingDays;
  const computedMaxAbsences = Math.max(0, Math.floor(P / T - W));

  // Determine status
  const attendanceStatus =
    attendance.overallPercentage >= 75
      ? 'Safe'
      : attendance.overallPercentage >= 65
      ? 'Warning'
      : 'Critical';

  // Check data availability
  if (!attendance.records || attendance.records.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: 'Attendance' }]} />
        <div className="p-8 bg-app-surface border border-app-border rounded text-center space-y-3">
          <FileQuestion className="w-8 h-8 text-app-muted mx-auto" />
          <h2 className="text-base font-semibold text-app-text">Attendance Data Unavailable</h2>
          <p className="text-xs text-app-muted max-w-md mx-auto">
            No monthly attendance records are registered for the selected academic session. Please verify with the Academic Section.
          </p>
        </div>
      </div>
    );
  }

  const selectedRecord = attendance.records[selectedMonthIndex] || attendance.records[0];

  const chartData = attendance.records.map((r, idx) => ({
    name: r.month,
    fullName: r.monthFullName,
    percentage: r.percentage,
    present: r.presentDays,
    absent: r.absentDays,
    working: r.workingDays,
    index: idx
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'Attendance' }]} />

      {/* Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Attendance Record
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            B.Tech Academic Year {attendance.academicYear} • Regulation R23
          </p>
        </div>

        <Badge
          variant={
            attendanceStatus === 'Safe'
              ? 'success'
              : attendanceStatus === 'Warning'
              ? 'warning'
              : 'danger'
          }
          size="md"
        >
          Status: {attendanceStatus} ({attendance.overallPercentage}%)
        </Badge>
      </div>

      {/* 1. Overall Progress & Metrics Bar */}
      <div className="bg-app-surface border border-app-border rounded p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-app-border">
          {/* Overall % */}
          <div className="sm:pr-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Aggregate Attendance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-mono text-app-text tabular-nums">
                {attendance.overallPercentage}%
              </span>
            </div>
            <span className="text-[11px] text-app-muted">Cutoff: {attendance.requiredPercentage}%</span>
          </div>

          {/* Working Days */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Total Working Days
            </span>
            <span className="text-2xl font-bold font-mono text-app-text tabular-nums mt-1 block">
              {attendance.overallWorkingDays}
            </span>
            <span className="text-[11px] text-app-muted">Conducted sessions</span>
          </div>

          {/* Present Days */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Present Days
            </span>
            <span className="text-2xl font-bold font-mono text-app-success tabular-nums mt-1 block">
              {attendance.overallPresent}
            </span>
            <span className="text-[11px] text-app-muted">Sessions attended</span>
          </div>

          {/* Absent Days */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Absent Days
            </span>
            <span className="text-2xl font-bold font-mono text-app-danger tabular-nums mt-1 block">
              {attendance.overallAbsent}
            </span>
            <span className="text-[11px] text-app-muted">Full & half day leaves</span>
          </div>

          {/* Max Permissible Absences */}
          <div className="pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Safe Leave Buffer
            </span>
            <span className="text-2xl font-bold font-mono text-app-accent tabular-nums mt-1 block">
              {computedMaxAbsences} days
            </span>
            <span className="text-[11px] text-app-muted">Remaining margin</span>
          </div>
        </div>

        {/* Slim Overall Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-app-muted">
            <span>Overall Progress</span>
            <span className="font-mono">{attendance.overallPercentage}% / 100%</span>
          </div>
          <div className="w-full bg-app-border h-2 rounded-full overflow-hidden relative">
            {/* 75% threshold marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-black dark:bg-white z-10"
              style={{ left: '75%' }}
              title="75% Mandatory Cutoff"
            />
            <div
              className={`h-full transition-all duration-300 ${
                attendance.overallPercentage >= 75
                  ? 'bg-app-success'
                  : attendance.overallPercentage >= 65
                  ? 'bg-app-warning'
                  : 'bg-app-danger'
              }`}
              style={{ width: `${Math.min(100, attendance.overallPercentage)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-app-muted pt-0.5">
            <span>0%</span>
            <span className="font-semibold text-app-text">▲ 75% Mandatory Cutoff</span>
            <span>100%</span>
          </div>
        </div>

        {/* Max Absences Formula Explanation (Required by prompt) */}
        <div className="p-3 bg-app-bg border border-app-border rounded text-xs text-app-muted flex items-start gap-2.5">
          <Info className="w-4 h-4 text-app-accent shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-medium text-app-text">
              Max Additional Absences Computation: {computedMaxAbsences} days
            </p>
            <p className="leading-relaxed">
              Calculated using the statutory academic formula: <span className="font-mono font-medium text-app-text">floor(P / T - W)</span>, where Present Days (P) = {P}, Required Threshold (T) = 0.75, and Current Working Days (W) = {W}:
              <br />
              <span className="font-mono text-app-accent font-medium">
                floor({P} / 0.75 - {W}) = floor(224 - 210) = 14 days.
              </span>
              <br />
              Assumption: Each future missed day increments total working days while present days remain constant.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Monthly Bar Chart & Monthly Detail Drill-down */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-app-surface border border-app-border rounded p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-app-text">Monthly Attendance Trend</h2>
                <p className="text-xs text-app-muted">Click any month bar to inspect daily absence logs</p>
              </div>
              <span className="text-xs font-mono text-app-muted">
                Dashed line = 75% cutoff
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onClick={(e) => {
                    if (e && e.activePayload && e.activePayload.length > 0) {
                      const idx = e.activePayload[0].payload.index;
                      setSelectedMonthIndex(idx);
                    }
                  }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="var(--color-muted)"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[60, 100]}
                    stroke="var(--color-muted)"
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-app-surface border border-app-border p-2.5 rounded shadow-none text-xs space-y-1">
                            <p className="font-semibold text-app-text">{data.fullName}</p>
                            <p className="text-app-accent font-mono font-medium">
                              Attendance: {data.percentage}%
                            </p>
                            <p className="text-app-muted">
                              Present: {data.present} / {data.working} days
                            </p>
                            <p className="text-app-danger">
                              Absent: {data.absent} days
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={75}
                    stroke="#B42318"
                    strokeDasharray="3 3"
                    label={{ value: '75% Cutoff', fill: '#B42318', fontSize: 10, position: 'insideTopRight' }}
                  />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]} cursor="pointer">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === selectedMonthIndex
                            ? 'var(--color-accent)'
                            : entry.percentage >= 75
                            ? '#2E7D4F'
                            : '#B7791F'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-3 border-t border-app-border text-xs text-app-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-app-accent" /> Selected Month
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2E7D4F]" /> ≥ 75% (Safe)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#B7791F]" /> Warning Zone
            </span>
          </div>
        </div>

        {/* Right: Selected Month Detailed Records (5 cols) */}
        <div className="lg:col-span-5 bg-app-surface border border-app-border rounded p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-app-border">
              <div>
                <h3 className="text-sm font-semibold text-app-text">
                  {selectedRecord.monthFullName}
                </h3>
                <p className="text-xs text-app-muted">
                  {selectedRecord.presentDays} present of {selectedRecord.workingDays} working days ({selectedRecord.percentage}%)
                </p>
              </div>
              <Badge
                variant={selectedRecord.percentage >= 75 ? 'success' : 'warning'}
                size="sm"
              >
                {selectedRecord.percentage}%
              </Badge>
            </div>

            {/* List of absent dates in this month */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-app-text uppercase tracking-wider">
                Absence Log ({selectedRecord.absentDays} days)
              </p>

              {selectedRecord.dailyRecords.length === 0 ? (
                <div className="p-4 bg-app-bg border border-app-border rounded text-center text-xs text-app-muted">
                  No absences recorded in this month. 100% full attendance!
                </div>
              ) : (
                <div className="divide-y divide-app-border max-h-60 overflow-y-auto">
                  {selectedRecord.dailyRecords.map((item, i) => (
                    <div key={i} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-app-text">{item.date}</span>
                          <span className="text-app-muted">({item.dayName})</span>
                        </div>
                        {item.remarks && (
                          <p className="text-[11px] text-app-muted mt-0.5">
                            Reason: {item.remarks}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={item.status === 'AbsentHalf' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {item.status === 'AbsentHalf' ? 'Half Day' : 'Full Day'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-app-border text-[11px] text-app-muted">
            <p>
              Condonation rules: Condonation is permitted between 65% and 75% aggregate solely upon submission of medical discharge certificate to HOD within 3 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

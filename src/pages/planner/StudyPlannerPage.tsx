import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CheckSquare,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Filter,
  ArrowUpDown,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { PersonalTask } from '../../types';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const StudyPlannerPage: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    assignments,
    calendarEvents,
    timetable
  } = usePortal();

  const location = useLocation();
  const navigate = useNavigate();

  // Tab state derived from URL or default
  const getInitialTab = () => {
    if (location.pathname.includes('/assignments')) return 'assignments';
    if (location.pathname.includes('/timetable')) return 'timetable';
    if (location.pathname.includes('/calendar')) return 'calendar';
    return 'tasks';
  };

  const [activeTab, setActiveTab] = useState<'tasks' | 'assignments' | 'timetable' | 'calendar'>(
    getInitialTab()
  );

  // Tasks Filter & Sort state
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<string>('all');
  const [taskSort, setTaskSort] = useState<'dueDate' | 'priority'>('dueDate');

  // Add Task Modal state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskCategory, setNewTaskCategory] = useState<PersonalTask['category']>('Exam Prep');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  // Delete Task Confirm Modal state
  const [taskToDelete, setTaskToDelete] = useState<PersonalTask | null>(null);

  // Timetable view toggle
  const [timetableMode, setTimetableMode] = useState<'day' | 'week'>('day');
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<number>(0); // 0 = Monday

  // Calendar month state
  const [calendarMonth, setCalendarMonth] = useState<number>(9); // 9 = October (0-indexed)

  // Filter tasks
  const filteredTasks = tasks
    .filter((t) => {
      if (taskFilter === 'pending' && t.completed) return false;
      if (taskFilter === 'completed' && !t.completed) return false;
      if (taskPriorityFilter !== 'all' && t.priority !== taskPriorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (taskSort === 'dueDate') {
        return a.dueDate.localeCompare(b.dueDate);
      }
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const taskProgressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDueDate) return;

    addTask({
      title: newTaskTitle.trim(),
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      category: newTaskCategory,
      completed: false,
      notes: newTaskNotes.trim()
    });

    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskNotes('');
    setIsAddTaskOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'Study Planner' }]} />

      {/* Header with 4-way Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Study Planner & Academic Schedule
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Personal study task manager, official LMS assignments, timetable, and academic calendar
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-app-surface p-1 rounded border border-app-border text-xs overflow-x-auto">
          {[
            { id: 'tasks', label: 'Personal Tasks', count: tasks.length },
            { id: 'assignments', label: 'Official Assignments', count: assignments.length },
            { id: 'timetable', label: 'Timetable' },
            { id: 'calendar', label: 'Academic Calendar' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                navigate(`/planner/${tab.id}`);
              }}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'bg-app-accent text-white font-semibold'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB 1: PERSONAL TASKS ================= */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Progress Goal Banner */}
          <div className="bg-app-surface border border-app-border rounded p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                Task Completion Progress
              </span>
              <p className="text-sm font-semibold text-app-text">
                {completedTasksCount} of {tasks.length} study goals completed ({taskProgressPercent}%)
              </p>
              <div className="w-64 bg-app-border h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-app-accent h-full transition-all duration-300"
                  style={{ width: `${taskProgressPercent}%` }}
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddTaskOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Add New Study Task
            </Button>
          </div>

          {/* Filter & Sort Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-app-muted flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <div className="flex items-center gap-1 bg-app-surface p-0.5 rounded border border-app-border">
                {['all', 'pending', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTaskFilter(f as any)}
                    className={`px-2.5 py-1 rounded capitalize ${
                      taskFilter === f
                        ? 'bg-app-accent text-white font-medium'
                        : 'text-app-muted hover:text-app-text'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <select
                value={taskPriorityFilter}
                onChange={(e) => setTaskPriorityFilter(e.target.value)}
                className="h-8 px-2 bg-app-surface border border-app-border rounded text-app-text"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-app-muted flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={taskSort}
                onChange={(e) => setTaskSort(e.target.value as any)}
                className="h-8 px-2 bg-app-surface border border-app-border rounded text-app-text"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-app-surface border border-app-border rounded divide-y divide-app-border">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-app-muted">
                No tasks match the active filters.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 flex items-start justify-between gap-3 text-xs transition-colors ${
                    task.completed ? 'bg-app-bg/40 opacity-75' : 'hover:bg-app-bg/30'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                      className="mt-0.5 text-app-muted hover:text-app-accent transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-app-success" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <p
                        className={`font-semibold text-app-text ${
                          task.completed ? 'line-through text-app-muted' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.notes && (
                        <p className="text-[11px] text-app-muted leading-relaxed">
                          {task.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-app-muted flex-wrap">
                        <Badge
                          variant={
                            task.priority === 'High'
                              ? 'danger'
                              : task.priority === 'Medium'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                        <span className="font-mono">Due: {task.dueDate}</span>
                        <span>• {task.category}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setTaskToDelete(task)}
                    aria-label="Delete task"
                    className="p-1.5 rounded text-app-muted hover:text-app-danger hover:bg-app-bg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: OFFICIAL ASSIGNMENTS ================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="p-3 bg-app-bg border border-app-border rounded text-xs text-app-muted flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-app-accent shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-app-text">Official LMS Coursework:</span> These assignments are scheduled by respective subject faculties. Submissions must be uploaded to the department laboratory server before the cutoff date.
            </p>
          </div>

          <div className="bg-app-surface border border-app-border rounded divide-y divide-app-border">
            {assignments.map((asg) => (
              <div key={asg.id} className="p-4 sm:p-5 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-[11px] text-app-muted block">
                      {asg.subjectCode} • {asg.subjectName}
                    </span>
                    <h3 className="text-sm font-semibold text-app-text mt-0.5">{asg.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        asg.status === 'Graded'
                          ? 'success'
                          : asg.status === 'Submitted'
                          ? 'accent'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {asg.status}
                    </Badge>
                    {asg.obtainedMarks !== undefined && (
                      <span className="font-mono font-bold text-app-text">
                        {asg.obtainedMarks} / {asg.maxMarks} marks
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-app-muted leading-relaxed">{asg.instructions}</p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-app-muted border-t border-app-border">
                  <span>Assigned: {asg.assignedDate}</span>
                  <span className="font-mono font-medium text-app-danger">
                    Cutoff: {asg.dueDate} (Max: {asg.maxMarks} pts)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: TIMETABLE ================= */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          {/* Day / Week View Mode switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1 bg-app-surface p-1 rounded border border-app-border">
              <button
                onClick={() => setTimetableMode('day')}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  timetableMode === 'day'
                    ? 'bg-app-accent text-white'
                    : 'text-app-muted hover:text-app-text'
                }`}
              >
                Day View
              </button>
              <button
                onClick={() => setTimetableMode('week')}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  timetableMode === 'week'
                    ? 'bg-app-accent text-white'
                    : 'text-app-muted hover:text-app-text'
                }`}
              >
                Full Week Matrix
              </button>
            </div>

            {timetableMode === 'day' && (
              <div className="flex items-center gap-1 overflow-x-auto">
                {timetable.map((t, idx) => (
                  <button
                    key={t.day}
                    onClick={() => setSelectedTimetableDay(idx)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      selectedTimetableDay === idx
                        ? 'bg-app-accent text-white font-medium'
                        : 'bg-app-surface border border-app-border text-app-muted hover:text-app-text'
                    }`}
                  >
                    {t.day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {timetableMode === 'day' ? (
            /* Day View Card */
            <div className="bg-app-surface border border-app-border rounded p-4 sm:p-5 space-y-3">
              <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
                {timetable[selectedTimetableDay].day} Schedule (Section A)
              </h2>

              <div className="divide-y divide-app-border">
                {timetable[selectedTimetableDay].periods.map((period) => (
                  <div key={period.periodNumber} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-8 font-mono text-app-muted font-bold">
                        P{period.periodNumber}
                      </span>
                      <div>
                        <p className="font-semibold text-app-text">{period.subjectName}</p>
                        <p className="text-[11px] text-app-muted">
                          {period.subjectCode} • {period.room} • {period.facultyName}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-app-muted font-medium shrink-0">
                      {period.timeRange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Full Week Matrix Table */
            <div className="bg-app-surface border border-app-border rounded p-4 sm:p-5 overflow-x-auto">
              <table className="w-full text-left text-xs border border-app-border">
                <thead className="bg-app-bg text-app-muted border-b border-app-border">
                  <tr>
                    <th className="p-2.5 font-medium border-r border-app-border">Day</th>
                    <th className="p-2.5 font-medium border-r border-app-border">09:00 - 09:50</th>
                    <th className="p-2.5 font-medium border-r border-app-border">09:50 - 10:40</th>
                    <th className="p-2.5 font-medium border-r border-app-border">10:55 - 11:45</th>
                    <th className="p-2.5 font-medium border-r border-app-border">11:45 - 12:35</th>
                    <th className="p-2.5 font-medium border-r border-app-border">01:30 - 02:20</th>
                    <th className="p-2.5 font-medium">02:20 - 04:00</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {timetable.map((day) => (
                    <tr key={day.day} className="hover:bg-app-bg/50">
                      <td className="p-2.5 font-semibold text-app-text border-r border-app-border bg-app-bg/30">
                        {day.day}
                      </td>
                      {day.periods.slice(0, 6).map((p, idx) => (
                        <td key={idx} className="p-2.5 border-r border-app-border last:border-r-0 align-top">
                          <p className="font-medium text-app-text text-[11px]">{p.subjectName}</p>
                          <p className="text-[10px] text-app-muted mt-0.5">{p.room}</p>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: ACADEMIC CALENDAR ================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-app-surface border border-app-border rounded p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-app-border">
              <div>
                <h2 className="text-sm font-semibold text-app-text">Institutional Calendar (2026-27)</h2>
                <p className="text-xs text-app-muted">Autonomous schedule approved by the Academic Council</p>
              </div>
              <Badge variant="accent" size="sm">
                Semester 2 Cycle
              </Badge>
            </div>

            <div className="divide-y divide-app-border">
              {calendarEvents.map((evt) => (
                <div key={evt.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-app-text">{evt.date}</span>
                      <Badge
                        variant={
                          evt.category === 'Holiday'
                            ? 'neutral'
                            : evt.category === 'Exam'
                            ? 'danger'
                            : evt.category === 'Deadline'
                            ? 'warning'
                            : 'accent'
                        }
                        size="sm"
                      >
                        {evt.category}
                      </Badge>
                    </div>
                    <p className="font-medium text-app-text">{evt.title}</p>
                    {evt.description && (
                      <p className="text-[11px] text-app-muted">{evt.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        title="Add New Study Goal"
        subtitle="Manage personal academic milestones"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-app-text mb-1">Task Title</label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Revise Chemistry Polymers Chapter"
              className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-app-text mb-1">Target Date</label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-app-text mb-1">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="w-full h-9 px-2 bg-app-bg border border-app-border rounded text-app-text"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-app-text mb-1">Category</label>
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value as any)}
              className="w-full h-9 px-2 bg-app-bg border border-app-border rounded text-app-text"
            >
              <option value="Exam Prep">Exam Prep</option>
              <option value="Assignment">Assignment</option>
              <option value="Lab Work">Lab Work</option>
              <option value="Reading">Reading</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-app-text mb-1">Notes / Objectives</label>
            <textarea
              rows={2}
              value={newTaskNotes}
              onChange={(e) => setNewTaskNotes(e.target.value)}
              placeholder="Key textbook pages, theorem numbers..."
              className="w-full p-2 bg-app-bg border border-app-border rounded text-app-text"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddTaskOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Task Confirmation Modal */}
      {taskToDelete && (
        <Modal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          title="Confirm Delete Task"
          subtitle="Remove study goal"
          maxWidth="sm"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setTaskToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  deleteTask(taskToDelete.id);
                  setTaskToDelete(null);
                }}
              >
                Delete
              </Button>
            </>
          }
        >
          <p className="text-xs text-app-muted leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-app-text">"{taskToDelete.title}"</span>? This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  Users,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  FileText,
  Info,
  ChevronRight
} from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { DepartmentData } from '../../types';
import { dataService } from '../../services/dataService';

export const DepartmentsPage: React.FC = () => {
  const { deptId } = useParams<{ deptId?: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'faculty' | 'resources'>('overview');
  const [departments, setDepartments] = useState<DepartmentData[]>(() => dataService.getInitialSeedData().departments);

  useEffect(() => {
    dataService.getDepartments().then(setDepartments).catch(console.error);
  }, []);

  // If specific department is chosen
  const activeDept = deptId ? departments.find((d) => d.id === deptId) : null;

  if (activeDept) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Departments', path: '/departments' },
            { label: `${activeDept.name} (${activeDept.code})` }
          ]}
        />

        {/* Dept Header */}
        <div className="bg-app-surface border border-app-border rounded p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-app-border">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-app-text">{activeDept.name}</h1>
                <Badge variant="accent" size="sm">{activeDept.code}</Badge>
              </div>
              <p className="text-xs text-app-muted mt-0.5">Est. {activeDept.established} • Autonomous Faculty</p>
            </div>
            <div className="text-right text-xs">
              <span className="text-app-muted">Head of Department:</span>
              <p className="font-semibold text-app-text">{activeDept.hodName}</p>
            </div>
          </div>

          <p className="text-xs text-app-muted leading-relaxed">{activeDept.description}</p>

          {activeDept.subBranches && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-app-text block mb-1.5">Offered Programs:</span>
              <div className="flex flex-wrap gap-2">
                {activeDept.subBranches.map((sub, i) => (
                  <Badge key={i} variant="neutral" size="sm">
                    {sub}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs for Dept details */}
        <div className="flex items-center gap-1 bg-app-surface p-1 rounded border border-app-border text-xs">
          {[
            { id: 'overview', label: 'Department Profile' },
            { id: 'faculty', label: 'Faculty Directory' },
            { id: 'resources', label: 'Curriculum & Labs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded transition-colors font-medium ${
                activeTab === tab.id
                  ? 'bg-app-accent text-white'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="bg-app-surface border border-app-border rounded p-5 space-y-4 text-xs">
            <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
              Contact & Department Office
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
                <span className="text-app-muted">Official HOD Email</span>
                <p className="font-mono font-medium text-app-text">{activeDept.contactEmail}</p>
              </div>
              <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
                <span className="text-app-muted">Department Desk Extension</span>
                <p className="font-mono font-medium text-app-text">{activeDept.contactPhone}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faculty' && (
          <div className="bg-app-surface border border-app-border rounded p-8 text-center space-y-3">
            <Users className="w-8 h-8 text-app-muted mx-auto" />
            <h3 className="text-sm font-semibold text-app-text">Faculty Roster</h3>
            <p className="text-xs text-app-muted max-w-md mx-auto leading-relaxed">
              Information will appear here when published by the Academic Dean's office for session 2026-27. Faculty office hours are posted on department noticeboards.
            </p>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-app-surface border border-app-border rounded p-5 space-y-4 text-xs">
            <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
              Course Material & Laboratory Syllabi
            </h2>
            <div className="divide-y divide-app-border">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-app-text">Autonomous Curriculum Scheme R23</p>
                  <p className="text-[11px] text-app-muted">Updated for Academic Session 2026-27</p>
                </div>
                <Link to="/documents">
                  <Badge variant="accent" size="sm">View in Documents</Badge>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // All Departments Grid Overview
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: 'Academic Departments' }]} />

      <div className="pb-2 border-b border-app-border">
        <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
          Academic Departments Directory
        </h1>
        <p className="text-xs text-app-muted mt-0.5">
          Engineering, technology, basic sciences and postgraduate departments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Link
            key={dept.id}
            to={`/departments/${dept.id}`}
            className="p-4 bg-app-surface border border-app-border rounded hover:border-app-accent transition-colors flex flex-col justify-between group space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-app-accent bg-app-accent/10 px-2 py-0.5 rounded">
                  {dept.code}
                </span>
                <span className="text-[10px] text-app-muted font-mono">Est. {dept.established}</span>
              </div>
              <h2 className="text-sm font-semibold text-app-text group-hover:text-app-accent transition-colors">
                {dept.name}
              </h2>
              <p className="text-xs text-app-muted mt-1 line-clamp-2 leading-relaxed">
                {dept.description}
              </p>
            </div>

            <div className="pt-2 border-t border-app-border flex items-center justify-between text-xs text-app-accent font-medium">
              <span>View Department Page</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

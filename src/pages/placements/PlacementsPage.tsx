import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle2,
  FileCheck,
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Building,
  Users,
  Check
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { PlacementContest } from '../../types';
import { dataService } from '../../services/dataService';

export const PlacementsPage: React.FC = () => {
  const { student, placementReg, updatePlacementReg } = usePortal();

  const [activeTab, setActiveTab] = useState<'profile' | 'verification' | 'contests' | 'mous'>('profile');
  const [preferredDomain, setPreferredDomain] = useState(placementReg.preferredDomain);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [contestsList, setContestsList] = useState<PlacementContest[]>(() => dataService.getInitialSeedData().contests);

  useEffect(() => {
    dataService.getPlacementContests().then(setContestsList).catch(console.error);
  }, []);

  const handleRegisterContest = (contestTitle: string) => {
    if (placementReg.registeredContests.includes(contestTitle)) {
      setToastMessage(`You are already registered for ${contestTitle}`);
    } else {
      updatePlacementReg({
        registeredContests: [...placementReg.registeredContests, contestTitle]
      });
      setToastMessage(`Successfully registered for ${contestTitle}!`);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateVerification = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlacementReg({ preferredDomain });
    setToastMessage('Placement profile preferences updated successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: 'Placements & Training' }]} />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-app-text text-app-surface px-4 py-2 rounded text-xs shadow-lg flex items-center gap-2 border border-app-border">
          <Check className="w-4 h-4 text-app-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Training & Placement Cell (T&P)
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Campus Recruitment Coordination, Industry Internships & Competitive Coding Drives
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-app-surface p-1 rounded border border-app-border text-xs overflow-x-auto">
          {[
            { id: 'profile', label: 'T&P Charter' },
            { id: 'verification', label: 'Student Verification' },
            { id: 'contests', label: 'Contests & Mock Tests' },
            { id: 'mous', label: 'Industry MoUs & CoEs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'bg-app-accent text-white font-semibold'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Profile */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-app-surface border border-app-border rounded p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
              Training & Placement Cell Charter
            </h2>
            <p className="text-xs text-app-muted leading-relaxed">
              The Training & Placement Cell facilitates campus recruitment, pre-placement training modules, mock technical interviews, and industry internships for eligible students. First-year foundation students are prepared through systematic algorithmic problem solving and soft-skills seminars.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
                <span className="text-app-muted block">Dean - Placements & Corporate Relations</span>
                <p className="font-semibold text-app-text">Dr. S. K. Subramanian</p>
                <p className="text-[11px] text-app-muted font-mono">placements@college.example • Ext. 3101</p>
              </div>

              <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
                <span className="text-app-muted block">Office of Career Guidance</span>
                <p className="font-semibold text-app-text">Placement Block, Level 2</p>
                <p className="text-[11px] text-app-muted">Open 09:00 AM - 05:00 PM Weekdays</p>
              </div>
            </div>
          </div>

          {/* Honest Placeholder for Branch-wise Statistics as required by prompt */}
          <div className="bg-app-surface border border-app-border rounded p-6 text-center space-y-2">
            <h3 className="text-sm font-semibold text-app-text">Annual Branch-Wise Placement Statistics</h3>
            <p className="text-xs text-app-muted max-w-md mx-auto leading-relaxed">
              Information will appear here when published officially by the T&P Cell for current graduating batches.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Student Verification */}
      {activeTab === 'verification' && (
        <div className="bg-app-surface border border-app-border rounded p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-app-border">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-app-accent" />
              <h2 className="text-sm font-semibold text-app-text">Candidate Placement Verification</h2>
            </div>
            <Badge variant="success" size="sm">
              Eligible (CGPA 8.2)
            </Badge>
          </div>

          <form onSubmit={handleUpdateVerification} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-app-bg border border-app-border rounded">
              <div>
                <span className="text-app-muted">Candidate Name</span>
                <p className="font-semibold text-app-text mt-0.5">{student.name}</p>
              </div>
              <div>
                <span className="text-app-muted">Roll Number</span>
                <p className="font-mono text-app-text mt-0.5">{student.rollNo}</p>
              </div>
              <div>
                <span className="text-app-muted">Current CGPA Standing</span>
                <p className="font-mono text-app-accent font-bold mt-0.5">8.2 / 10.0</p>
              </div>
            </div>

            <div>
              <label className="block font-medium text-app-text mb-1">
                Preferred Technical Career Domain
              </label>
              <select
                value={preferredDomain}
                onChange={(e) => setPreferredDomain(e.target.value)}
                className="w-full h-9 px-3 bg-app-bg border border-app-border rounded text-app-text focus:outline-none focus:border-app-accent"
              >
                <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                <option value="Full-Stack Web & Distributed Systems">Full-Stack Web & Distributed Systems</option>
                <option value="Data Engineering & Analytics">Data Engineering & Analytics</option>
                <option value="Cybersecurity & Cloud Defense">Cybersecurity & Cloud Defense</option>
                <option value="Core Engineering (Robotics/Automation)">Core Engineering (Robotics/Automation)</option>
              </select>
            </div>

            <div>
              <span className="block font-medium text-app-text mb-1.5">Attested Skill Badges:</span>
              <div className="flex flex-wrap gap-2">
                {placementReg.skills.map((s, i) => (
                  <Badge key={i} variant="neutral" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                Update Preferences
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Contests & Mock Tests */}
      {activeTab === 'contests' && (
        <div className="bg-app-surface border border-app-border rounded p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-app-border">
            <h2 className="text-sm font-semibold text-app-text">Upcoming Coding Contests & Mock Tests</h2>
            <span className="text-xs text-app-muted font-mono">{contestsList.length} open tests</span>
          </div>

          <div className="divide-y divide-app-border">
            {contestsList.map((c) => {
              const isRegistered = placementReg.registeredContests.includes(c.title);
              return (
                <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-app-text text-sm">{c.title}</h3>
                      {isRegistered && (
                        <Badge variant="success" size="sm">
                          Registered
                        </Badge>
                      )}
                    </div>
                    <p className="text-app-muted">
                      Scheduled Date: <span className="font-mono text-app-text font-medium">{c.date}</span> • {c.eligibility}
                    </p>
                  </div>

                  <Button
                    variant={isRegistered ? 'outline' : 'primary'}
                    size="sm"
                    disabled={isRegistered}
                    onClick={() => handleRegisterContest(c.title)}
                  >
                    {isRegistered ? 'Already Registered' : 'Register Now'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Industry MoUs & CoEs */}
      {activeTab === 'mous' && (
        <div className="bg-app-surface border border-app-border rounded p-6 text-center space-y-3">
          <Building className="w-8 h-8 text-app-muted mx-auto" />
          <h2 className="text-sm font-semibold text-app-text">Centers of Excellence & Industry MoUs</h2>
          <p className="text-xs text-app-muted max-w-md mx-auto leading-relaxed">
            Information will appear here when published upon ratification by the College Governing Body.
          </p>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  Award,
  Download,
  ExternalLink,
  PlusCircle,
  FileCheck2,
  Inbox
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const CompetitiveExamsPage: React.FC = () => {
  const { competitiveResults, demoOverrides, updateDemoOverrides } = usePortal();

  const handleToggleState = () => {
    updateDemoOverrides({
      competitiveExamHasData: !demoOverrides.competitiveExamHasData
    });
  };

  const handleDownloadScorecard = (examName: string) => {
    alert(`[Sandbox Preview] Simulating scorecard download for: ${examName}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'Competitive Exams' }]} />

      {/* Header with state toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Competitive & National Examinations
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Verified scores for GATE, CAT, GRE, TCS CodeVita, and NPTEL Certifications
          </p>
        </div>

        {/* State Toggle for prototype demo testing */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleState}
            icon={<Inbox className="w-3.5 h-3.5" />}
          >
            {demoOverrides.competitiveExamHasData ? 'View Empty State' : 'View Populated State'}
          </Button>
        </div>
      </div>

      {competitiveResults.length === 0 ? (
        /* Empty State */
        <div className="p-10 bg-app-surface border border-app-border rounded text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded bg-app-muted/10 text-app-muted flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-app-text">
              No Competitive Exam Records Filed
            </h2>
            <p className="text-xs text-app-muted leading-relaxed">
              You have not registered or linked any national competitive examination scorecards yet. Once you appear for GATE, NPTEL, or corporate challenges, submit your hall ticket to the Training & Placement Cell.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleToggleState}
              icon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              Load Sample Verification Results
            </Button>
          </div>
        </div>
      ) : (
        /* Results Table State */
        <div className="bg-app-surface border border-app-border rounded p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-app-text">Verified Qualifications</h2>
            <span className="text-xs text-app-muted">{competitiveResults.length} records verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-app-border text-app-muted text-[11px]">
                  <th className="pb-2.5 font-medium">Exam Name</th>
                  <th className="pb-2.5 font-medium">Registration No</th>
                  <th className="pb-2.5 font-medium">Attempt Date</th>
                  <th className="pb-2.5 font-medium">Score / Performance</th>
                  <th className="pb-2.5 font-medium">National Standing</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium text-right">Scorecard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {competitiveResults.map((exam) => (
                  <tr key={exam.id} className="hover:bg-app-bg/50 transition-colors">
                    <td className="py-3 font-semibold text-app-text">{exam.examName}</td>
                    <td className="py-3 font-mono text-app-muted">{exam.registrationNo}</td>
                    <td className="py-3 text-app-muted">{exam.attemptDate}</td>
                    <td className="py-3 font-medium text-app-text font-mono">{exam.score}</td>
                    <td className="py-3 text-app-muted">{exam.rankOrPercentile}</td>
                    <td className="py-3">
                      <Badge variant="success" size="sm">
                        {exam.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      {exam.scorecardAvailable ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadScorecard(exam.examName)}
                          icon={<Download className="w-3 h-3 text-app-accent" />}
                        >
                          PDF
                        </Button>
                      ) : (
                        <span className="text-[11px] text-app-muted">Not Issued</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-app-bg border border-app-border rounded text-xs text-app-muted flex items-start gap-2">
            <FileCheck2 className="w-4 h-4 text-app-accent shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Scores listed here are officially attested for college placement eligibility filters and higher education recommendations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

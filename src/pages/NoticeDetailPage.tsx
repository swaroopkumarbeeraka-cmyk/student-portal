import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Building,
  Download,
  Bot,
  ArrowLeft,
  Share2,
  Printer,
  AlertCircle
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const NoticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { notices, addChatMessage } = usePortal();
  const navigate = useNavigate();

  const notice = notices.find((n) => n.id === id);

  if (!notice) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-base font-semibold text-app-text">Notice Not Found</h1>
        <p className="text-xs text-app-muted">The requested notice circular is no longer active.</p>
        <Link to="/notices">
          <Button variant="primary" size="sm">Back to Notices</Button>
        </Link>
      </div>
    );
  }

  const handleAskAI = () => {
    addChatMessage({
      sender: 'user',
      text: `Summarize key directives and deadlines for notice: "${notice.title}"`
    });
    navigate('/ai-assistant');
  };

  const handleDownload = (filename: string) => {
    alert(`[Sandbox Preview] Simulating file download: ${filename}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Campus Notices', path: '/notices' },
          { label: notice.title }
        ]}
      />

      <div className="bg-app-surface border border-app-border rounded p-6 sm:p-8 space-y-6">
        {/* Notice Meta Header */}
        <div className="space-y-3 pb-4 border-b border-app-border">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={notice.isUrgent ? 'danger' : 'neutral'} size="sm">
                {notice.category}
              </Badge>
              {notice.isUrgent && (
                <span className="text-[10px] text-app-danger font-semibold uppercase">
                  Statutory Notice
                </span>
              )}
            </div>
            <span className="font-mono text-xs text-app-muted">{notice.date}</span>
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-app-text leading-snug">
            {notice.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-app-muted">
            <Building className="w-4 h-4" />
            <span>Issued by: <strong className="text-app-text">{notice.publisher}</strong></span>
          </div>
        </div>

        {/* Notice Content Body */}
        <div className="text-xs sm:text-sm text-app-text leading-relaxed whitespace-pre-wrap space-y-4">
          <p>{notice.content}</p>
        </div>

        {/* Attachments Section */}
        {notice.attachments && notice.attachments.length > 0 && (
          <div className="p-4 bg-app-bg border border-app-border rounded space-y-2">
            <p className="text-xs font-semibold text-app-text">Official Attachments:</p>
            <div className="divide-y divide-app-border">
              {notice.attachments.map((att, i) => (
                <div key={i} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-app-accent" />
                    <div>
                      <p className="font-medium text-app-text">{att.name}</p>
                      <p className="text-[10px] text-app-muted">{att.size} • {att.type}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(att.name)}
                    icon={<Download className="w-3 h-3" />}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-app-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/notices')}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back to Notices
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              icon={<Printer className="w-3.5 h-3.5" />}
            >
              Print Circular
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleAskAI}
              icon={<Bot className="w-3.5 h-3.5" />}
            >
              Ask AI About This Notice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

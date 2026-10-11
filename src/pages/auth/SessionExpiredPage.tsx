import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const SessionExpiredPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-app-surface border border-app-border rounded p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded bg-app-warning/15 text-app-warning flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-semibold text-app-text">Session Expired</h1>
        <p className="text-xs text-app-muted leading-relaxed">
          Your portal session expired due to 15 minutes of inactivity. Please re-enter your credentials to resume.
        </p>
        <div className="pt-2">
          <Link to="/login">
            <Button variant="primary" size="md" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
              Re-authenticate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

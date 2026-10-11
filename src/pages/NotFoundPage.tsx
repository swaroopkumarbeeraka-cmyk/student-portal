import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-app-surface border border-app-border rounded p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded bg-app-muted/15 text-app-muted flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-app-accent font-mono">404</p>
          <h1 className="text-base font-semibold text-app-text">Page Not Found</h1>
        </div>
        <p className="text-xs text-app-muted leading-relaxed">
          The requested institutional page or resource could not be found. Please check the URL or return to the main dashboard.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="md" className="w-full" icon={<Home className="w-4 h-4" />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

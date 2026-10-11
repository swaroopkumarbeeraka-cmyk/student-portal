import React from 'react';
import { Wrench, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-app-surface border border-app-border rounded p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded bg-app-warning/15 text-app-warning flex items-center justify-center mx-auto">
          <Wrench className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-semibold text-app-text">System Maintenance</h1>
        <p className="text-xs text-app-muted leading-relaxed">
          The Student Portal examination and fee server is temporarily undergoing scheduled maintenance. Services will resume shortly.
        </p>
        <p className="text-[11px] font-mono text-app-muted bg-app-bg p-2 rounded border border-app-border">
          Expected completion: 11 Oct 2026, 21:00 IST
        </p>
        <div className="pt-2">
          <Button
            variant="outline"
            size="md"
            className="w-full"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={() => window.location.reload()}
          >
            Check Status
          </Button>
        </div>
      </div>
    </div>
  );
};

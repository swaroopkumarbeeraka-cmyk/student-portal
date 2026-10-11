import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Terms of Use' }]} />
      <div className="bg-app-surface border border-app-border rounded p-6 sm:p-8 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-app-text">Institutional Portal Terms of Use</h1>
          <p className="text-xs text-app-muted mt-1">Last updated: Academic Year 2026-27</p>
        </div>

        <section className="space-y-2 text-xs text-app-muted leading-relaxed">
          <h2 className="text-sm font-semibold text-app-text">1. Acceptable Use Policy</h2>
          <p>
            The Student Portal is intended exclusively for authorized students of the institution. Users must maintain the confidentiality of their login credentials and student PIN. Unauthorized access attempts or scraping of internal records will invite disciplinary action under Academic Regulation R23.
          </p>
        </section>

        <section className="space-y-2 text-xs text-app-muted leading-relaxed">
          <h2 className="text-sm font-semibold text-app-text">2. Fee Settlements & Payment Gateway</h2>
          <p>
            Online fee payments processed through the portal are verified against the institution accounts ledger. In prototype demonstration mode, payments are simulated in sandbox mode without invoking real currency transactions.
          </p>
        </section>

        <section className="space-y-2 text-xs text-app-muted leading-relaxed">
          <h2 className="text-sm font-semibold text-app-text">3. Academic Records Authenticity</h2>
          <p>
            The examination and attendance records presented herein are generated from official academic cell registries. Official printed grade cards and transcripts bear the seal of the Controller of Examinations.
          </p>
        </section>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
      <div className="bg-app-surface border border-app-border rounded p-6 sm:p-8 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-app-text">Student Data Privacy Policy</h1>
          <p className="text-xs text-app-muted mt-1">Governed by Institutional Data Protection Bylaws</p>
        </div>

        <section className="space-y-2 text-xs text-app-muted leading-relaxed">
          <h2 className="text-sm font-semibold text-app-text">1. Information We Collect</h2>
          <p>
            The portal collects and displays student identity data (Roll number, Student code, Email, Masked contact number), academic progress records, fee settlement histories, and self-declaration undertakings.
          </p>
        </section>

        <section className="space-y-2 text-xs text-app-muted leading-relaxed">
          <h2 className="text-sm font-semibold text-app-text">2. Sensitive Financial Information Protection</h2>
          <p>
            The student portal never requests or stores sensitive banking credentials, such as UPI PINs, Net Banking passwords, or Debit/Credit card CVVs. All payment transactions utilize tokenized merchant integration.
          </p>
        </section>

        <section className="space-y-2 text-xs text-app-muted leading-relaxed">
          <h2 className="text-sm font-semibold text-app-text">3. AI Campus Assistant Scoping</h2>
          <p>
            The embedded Campus Assistant adheres strictly to user isolation boundaries. Students can query their own attendance and academic results, but queries requesting data for other enrolled students are automatically denied.
          </p>
        </section>
      </div>
    </div>
  );
};

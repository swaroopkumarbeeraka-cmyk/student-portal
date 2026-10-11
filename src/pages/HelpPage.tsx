import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Mail,
  Phone,
  Building,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FAQData } from '../types';
import { dataService } from '../services/dataService';

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FAQData[]>(() => dataService.getInitialSeedData().faqs);

  useEffect(() => {
    dataService.getFAQs().then(setFaqs).catch(console.error);
  }, []);

  const filteredFaqs = faqs.filter(
    (f) =>
      !search.trim() ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: 'Help & FAQs' }]} />

      {/* Header */}
      <div className="pb-2 border-b border-app-border">
        <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
          Help Desk & Frequently Asked Questions
        </h1>
        <p className="text-xs text-app-muted mt-0.5">
          Academic regulations, fee guidelines, portal troubleshooting, and campus assistance
        </p>
      </div>

      {/* Search FAQs */}
      <div className="relative">
        <Search className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions (e.g. attendance cutoff, fee receipt, pin reset)..."
          className="w-full h-10 pl-9 pr-3 text-xs bg-app-surface border border-app-border rounded text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
        />
      </div>

      {/* FAQ Accordion */}
      <div className="bg-app-surface border border-app-border rounded divide-y divide-app-border">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-xs text-app-muted">
            No matching questions found. For urgent assistance, please contact the campus helpdesk below.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="p-4 sm:p-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-3 text-xs font-semibold text-app-text hover:text-app-accent transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-app-muted transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-app-accent' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 text-xs text-app-muted leading-relaxed border-t border-app-border/40 pt-2.5">
                    <p>{faq.answer}</p>
                    <span className="text-[10px] text-app-accent font-medium mt-1.5 block">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Campus Emergency Contacts Desk */}
      <div className="bg-app-surface border border-app-border rounded p-5 space-y-4 text-xs">
        <h2 className="text-sm font-semibold text-app-text pb-2 border-b border-app-border">
          Institutional Support Helplines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
            <span className="font-semibold text-app-text">IT Portal Support</span>
            <p className="text-[11px] text-app-muted font-mono">portal-support@college.example</p>
            <p className="text-[11px] text-app-muted font-mono">+91 80 2345 6780</p>
          </div>

          <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
            <span className="font-semibold text-app-text">Academic Affairs Office</span>
            <p className="text-[11px] text-app-muted font-mono">academics@college.example</p>
            <p className="text-[11px] text-app-muted font-mono">+91 80 2345 6781</p>
          </div>

          <div className="p-3 bg-app-bg border border-app-border rounded space-y-1">
            <span className="font-semibold text-app-text">Accounts & Fees Section</span>
            <p className="text-[11px] text-app-muted font-mono">accounts@college.example</p>
            <p className="text-[11px] text-app-muted font-mono">+91 80 2345 6782</p>
          </div>
        </div>
      </div>
    </div>
  );
};

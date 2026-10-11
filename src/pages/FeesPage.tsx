import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { FeeTerm, PaymentTransaction } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { PaymentSandboxModal } from '../components/fees/PaymentSandboxModal';
import { ReceiptModal } from '../components/fees/ReceiptModal';

export const FeesPage: React.FC = () => {
  const { fees, student, isReadOnlyYear, applySuccessfulPayment } = usePortal();

  // Payment modal state
  const [selectedTermForPayment, setSelectedTermForPayment] = useState<FeeTerm | null>(null);

  // Receipt modal state
  const [selectedTxnForReceipt, setSelectedTxnForReceipt] = useState<PaymentTransaction | null>(null);

  const activeTermToPay = fees.terms.find((t) => t.outstandingAmount > 0) || fees.terms[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'Fees & Payments' }]} />

      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Fees & Institutional Payments
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Academic Year {fees.academicYear} • Term Installments & Settlement Ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              fees.overallStatus === 'Paid'
                ? 'success'
                : fees.overallStatus === 'Overdue'
                ? 'danger'
                : 'warning'
            }
            size="md"
          >
            {fees.overallStatus} ({fees.percentPaid}% Cleared)
          </Badge>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <div className="bg-app-surface border border-app-border rounded p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-app-border">
          {/* Total Annual Fee */}
          <div className="sm:pr-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Total Annual Fee
            </span>
            <span className="text-3xl font-bold font-mono text-app-text tabular-nums mt-1 block">
              ₹{fees.totalAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-app-muted">Prescribed syllabus fee</span>
          </div>

          {/* Paid Amount */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Total Amount Paid
            </span>
            <span className="text-2xl font-bold font-mono text-app-success tabular-nums mt-1 block">
              ₹{fees.paidAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-app-muted">{fees.percentPaid}% verified settlement</span>
          </div>

          {/* Outstanding Amount */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Outstanding Dues
            </span>
            <span className="text-2xl font-bold font-mono text-app-danger tabular-nums mt-1 block">
              ₹{fees.outstandingAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-app-muted">Current payable balance</span>
          </div>

          {/* Action Callout */}
          <div className="pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted block">
              Term 2 Due Date
            </span>
            <span className="text-sm font-semibold text-app-text mt-1 block font-mono">
              15 Nov 2026
            </span>
            <div className="mt-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                disabled={fees.outstandingAmount === 0 || isReadOnlyYear}
                onClick={() => setSelectedTermForPayment(activeTermToPay)}
                icon={<CreditCard className="w-3.5 h-3.5" />}
              >
                {isReadOnlyYear
                  ? 'Archive Read-Only'
                  : fees.outstandingAmount === 0
                  ? 'All Fees Cleared'
                  : 'Pay Online Now'}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-app-muted">
            <span>Settlement Progress</span>
            <span className="font-mono font-medium text-app-text">
              ₹{fees.paidAmount.toLocaleString('en-IN')} / ₹{fees.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-app-border h-2 rounded-full overflow-hidden">
            <div
              className="bg-app-accent h-full transition-all duration-300"
              style={{ width: `${Math.min(100, fees.percentPaid)}%` }}
            />
          </div>
        </div>

        {/* Sandbox Notice Banner */}
        <div className="p-3 bg-app-bg border border-app-border rounded text-xs text-app-muted flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-app-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-medium text-app-text">Sandbox Demonstration Mode:</span> All fee payment interactions simulate the ICICI Bank payment gateway interface. No actual bank transfers or real money transactions occur. Outstanding balances and history tables update strictly upon verified simulated success.
          </p>
        </div>
      </div>

      {/* 2. Fee Category Breakdown Table */}
      <div className="bg-app-surface border border-app-border rounded p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-app-border">
          <h2 className="text-sm font-semibold text-app-text">Fee Category Breakdown</h2>
          <span className="text-xs text-app-muted">Annual Academic Schedule</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-app-border text-app-muted text-[11px]">
                <th className="pb-2 font-medium">Category Description</th>
                <th className="pb-2 text-right font-medium">Total Prescribed</th>
                <th className="pb-2 text-right font-medium">Amount Cleared</th>
                <th className="pb-2 text-right font-medium">Balance Dues</th>
                <th className="pb-2 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {fees.breakdown.map((cat) => (
                <tr key={cat.id} className="hover:bg-app-bg/50 transition-colors">
                  <td className="py-2.5 font-medium text-app-text">{cat.name}</td>
                  <td className="py-2.5 text-right font-mono text-app-muted">
                    ₹{cat.total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 text-right font-mono text-app-success font-medium">
                    ₹{cat.paid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-app-danger">
                    ₹{cat.outstanding.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 text-center">
                    <Badge variant={cat.outstanding === 0 ? 'success' : 'warning'} size="sm">
                      {cat.outstanding === 0 ? 'Paid' : 'Partially Paid'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-app-border font-semibold text-app-text">
              <tr>
                <td className="py-2.5">Total Reconciled</td>
                <td className="py-2.5 text-right font-mono">₹{fees.totalAmount.toLocaleString('en-IN')}</td>
                <td className="py-2.5 text-right font-mono text-app-success">₹{fees.paidAmount.toLocaleString('en-IN')}</td>
                <td className="py-2.5 text-right font-mono text-app-danger">₹{fees.outstandingAmount.toLocaleString('en-IN')}</td>
                <td className="py-2.5 text-center">
                  <Badge variant={fees.outstandingAmount === 0 ? 'success' : 'warning'} size="sm">
                    {fees.overallStatus}
                  </Badge>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3. Term-wise Schedule & Installments */}
      <div className="bg-app-surface border border-app-border rounded p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-app-border">
          <h2 className="text-sm font-semibold text-app-text">Term Schedule & Installments</h2>
          <span className="text-xs text-app-muted">Reconciled with Accounts Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-app-border text-app-muted text-[11px]">
                <th className="pb-2 font-medium">Installment Term</th>
                <th className="pb-2 font-medium">Due Date</th>
                <th className="pb-2 text-right font-medium">Total Term Fee</th>
                <th className="pb-2 text-right font-medium">Amount Paid</th>
                <th className="pb-2 text-right font-medium">Outstanding</th>
                <th className="pb-2 text-center font-medium">Status</th>
                <th className="pb-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {fees.terms.map((term) => (
                <tr key={term.id} className="hover:bg-app-bg/50 transition-colors">
                  <td className="py-3 font-semibold text-app-text">{term.name}</td>
                  <td className="py-3 font-mono text-app-muted">{term.dueDate}</td>
                  <td className="py-3 text-right font-mono text-app-muted">
                    ₹{term.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right font-mono text-app-success font-medium">
                    ₹{term.paidAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-app-danger">
                    ₹{term.outstandingAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-center">
                    <Badge
                      variant={
                        term.status === 'Paid'
                          ? 'success'
                          : term.status === 'Overdue'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {term.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    {term.outstandingAmount > 0 ? (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isReadOnlyYear}
                        onClick={() => setSelectedTermForPayment(term)}
                      >
                        Pay Now
                      </Button>
                    ) : (
                      <span className="text-xs text-app-success font-medium flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Cleared
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Payment Transaction History Table */}
      <div className="bg-app-surface border border-app-border rounded p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-app-border">
          <div>
            <h2 className="text-sm font-semibold text-app-text">Payment Transaction History</h2>
            <p className="text-xs text-app-muted">Verified audit trail of completed settlements</p>
          </div>
          <span className="text-xs text-app-muted font-mono">
            {fees.transactions.length} transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-app-border text-app-muted text-[11px]">
                <th className="pb-2 font-medium">Transaction ID</th>
                <th className="pb-2 font-medium">Date & Timestamp</th>
                <th className="pb-2 font-medium">Term / Purpose</th>
                <th className="pb-2 font-medium">Channel</th>
                <th className="pb-2 font-medium">Bank Reference</th>
                <th className="pb-2 text-right font-medium">Amount</th>
                <th className="pb-2 text-center font-medium">Status</th>
                <th className="pb-2 text-right font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {fees.transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-app-bg/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-app-text">{tx.txnId}</td>
                  <td className="py-3 text-app-muted">{tx.date}</td>
                  <td className="py-3 text-app-text font-medium">{tx.termName}</td>
                  <td className="py-3 text-app-muted">{tx.method}</td>
                  <td className="py-3 font-mono text-[11px] text-app-muted">{tx.referenceNo}</td>
                  <td className="py-3 text-right font-mono font-bold text-app-text">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={tx.status === 'Success' ? 'success' : 'danger'} size="sm">
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTxnForReceipt(tx)}
                      icon={<Receipt className="w-3.5 h-3.5 text-app-accent" />}
                    >
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Payment Sandbox Modal */}
      {selectedTermForPayment && (
        <PaymentSandboxModal
          isOpen={!!selectedTermForPayment}
          onClose={() => setSelectedTermForPayment(null)}
          term={selectedTermForPayment}
          onPaymentSuccess={(newTxn) => {
            applySuccessfulPayment(newTxn);
          }}
        />
      )}

      {/* Official Printable Receipt Modal */}
      {selectedTxnForReceipt && (
        <ReceiptModal
          isOpen={!!selectedTxnForReceipt}
          onClose={() => setSelectedTxnForReceipt(null)}
          transaction={selectedTxnForReceipt}
          student={student}
        />
      )}
    </div>
  );
};

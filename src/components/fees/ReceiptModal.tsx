import React from 'react';
import { Printer, Download, X, CheckCircle2 } from 'lucide-react';
import { PaymentTransaction, Student } from '../../types';
import { Button } from '../common/Button';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
  student: Student;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  student
}) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-app-surface border border-app-border rounded-md w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-app-border flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-app-success" />
            <h3 className="text-sm font-semibold text-app-text">Fee Payment Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-3.5 h-3.5" />}
            >
              Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1 rounded text-app-muted hover:text-app-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-app-text font-sans bg-white text-black">
          {/* Institution Header */}
          <div className="text-center pb-4 border-b border-gray-300">
            <h2 className="text-base font-bold tracking-tight text-gray-900 uppercase">
              {student.institutionName}
            </h2>
            <p className="text-[11px] text-gray-600 mt-0.5">
              Accounts & Finance Section • Official e-Fee Receipt
            </p>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">
              (Autonomous Institution Approved by AICTE, Affiliated to University)
            </p>
          </div>

          {/* Receipt Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs border-b border-gray-200 pb-4">
            <div>
              <p className="text-gray-500 text-[10px] uppercase">Receipt Number</p>
              <p className="font-mono font-bold text-gray-900">{transaction.receiptNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] uppercase">Transaction Date</p>
              <p className="font-mono text-gray-900">{transaction.date}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase">Student Code / Roll No</p>
              <p className="font-mono font-medium text-gray-900">
                {student.studentCode} ({student.rollNo})
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] uppercase">Student Name</p>
              <p className="font-medium text-gray-900">{student.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase">Course & Branch</p>
              <p className="text-gray-900">{student.course} - {student.specialization || student.branch}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] uppercase">Academic Year</p>
              <p className="text-gray-900">{student.academicYear}</p>
            </div>
          </div>

          {/* Transaction Particulars Table */}
          <div>
            <table className="w-full text-left text-xs border border-gray-300">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="p-2 font-semibold text-gray-700">Fee Particulars</th>
                  <th className="p-2 font-semibold text-gray-700">Payment Channel</th>
                  <th className="p-2 text-right font-semibold text-gray-700">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-2 font-medium text-gray-900">{transaction.termName}</td>
                  <td className="p-2 text-gray-600">{transaction.method}</td>
                  <td className="p-2 text-right font-mono font-bold text-gray-900">
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-300">
                <tr>
                  <td colSpan={2} className="p-2 font-bold text-gray-900 text-right">
                    Total Amount Received:
                  </td>
                  <td className="p-2 text-right font-mono font-bold text-gray-900 text-sm">
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Reference Details */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded text-[11px] space-y-1 text-gray-600">
            <div className="flex justify-between">
              <span>Transaction Reference:</span>
              <span className="font-mono font-medium text-gray-800">{transaction.referenceNo}</span>
            </div>
            <div className="flex justify-between">
              <span>Internal Txn ID:</span>
              <span className="font-mono text-gray-800">{transaction.txnId}</span>
            </div>
            <div className="flex justify-between">
              <span>Settlement Status:</span>
              <span className="text-emerald-700 font-semibold uppercase">{transaction.status} (Verified)</span>
            </div>
          </div>

          {/* Stamp & Verification */}
          <div className="pt-4 flex justify-between items-end text-[10px] text-gray-500 border-t border-gray-200">
            <div>
              <p>Computer-generated official receipt.</p>
              <p>Simulated Sandbox Mode (Demo Audit Trail).</p>
            </div>
            <div className="text-right">
              <div className="h-8 mb-1 border-b border-dashed border-gray-400 w-32 ml-auto" />
              <p className="font-semibold text-gray-800">Finance Officer</p>
              <p>Apex Institute of Technology</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="p-3 border-t border-app-border bg-app-bg flex justify-end no-print">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

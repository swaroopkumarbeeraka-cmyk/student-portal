import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCw,
  Building,
  QrCode,
  Lock,
  ExternalLink
} from 'lucide-react';
import { FeeTerm, PaymentMethod, PaymentTransaction } from '../../types';
import { paymentService, PaymentOrder } from '../../services/paymentService';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface PaymentSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  term: FeeTerm;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

type PaymentStep =
  | 'review'
  | 'choose_method'
  | 'redirecting'
  | 'sandbox_gateway'
  | 'verifying'
  | 'success'
  | 'failed'
  | 'pending';

export const PaymentSandboxModal: React.FC<PaymentSandboxModalProps> = ({
  isOpen,
  onClose,
  term,
  onPaymentSuccess
}) => {
  const [step, setStep] = useState<PaymentStep>('review');
  const [payAmount, setPayAmount] = useState<number>(term.outstandingAmount);
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [selectedBank, setSelectedBank] = useState<string>('ICICI Bank');
  const [confirmedCheckbox, setConfirmedCheckbox] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active order state
  const [activeOrder, setActiveOrder] = useState<PaymentOrder | null>(null);
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);

  if (!isOpen) return null;

  const handleStartPayment = async () => {
    if (!confirmedCheckbox) {
      setErrorMessage('Please confirm the payment acknowledgement checkbox to proceed.');
      return;
    }
    setErrorMessage(null);
    setStep('choose_method');
  };

  const handleProceedToGateway = async () => {
    setErrorMessage(null);
    // Create initiated order in payment service
    const orderRes = await paymentService.createOrder({
      termId: term.id,
      termName: term.name,
      amount: payAmount,
      method
    });

    if (!orderRes.success || !orderRes.order) {
      setErrorMessage(orderRes.error || 'Unable to initiate order.');
      return;
    }

    setActiveOrder(orderRes.order);
    setStep('redirecting');
    setTimeout(() => {
      setStep('sandbox_gateway');
    }, 800);
  };

  const handleSimulateBankOutcome = async (
    outcome: 'Success' | 'Failed' | 'Pending' | 'Cancelled'
  ) => {
    if (!activeOrder) return;

    if (outcome === 'Cancelled') {
      await paymentService.verifyPayment(activeOrder.orderId, 'Cancelled');
      setStep('review');
      setActiveOrder(null);
      return;
    }

    setStep('verifying');

    setTimeout(async () => {
      const verifyRes = await paymentService.verifyPayment(activeOrder.orderId, outcome);

      if (verifyRes.status === 'Success' && verifyRes.transaction) {
        setCompletedTxn(verifyRes.transaction);
        setStep('success');
        onPaymentSuccess(verifyRes.transaction);
      } else if (verifyRes.status === 'Failed') {
        setErrorMessage(verifyRes.message);
        setStep('failed');
      } else if (verifyRes.status === 'Pending') {
        setStep('pending');
      }
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (step === 'verifying') {
          // Do not close during critical verification
          return;
        }
        onClose();
      }}
      title={
        step === 'sandbox_gateway'
          ? 'ICICI Merchant Gateway Simulation'
          : 'Fee Payment Portal'
      }
      subtitle="Sandbox Simulation • No real money processed"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Step 1: Review */}
        {step === 'review' && (
          <div className="space-y-4">
            <div className="p-3 bg-app-bg border border-app-border rounded space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-app-muted">Fee Installment:</span>
                <span className="font-semibold text-app-text">{term.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted">Due Date:</span>
                <span className="font-mono text-app-text">{term.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted">Total Outstanding:</span>
                <span className="font-mono font-bold text-app-danger">
                  ₹{term.outstandingAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Amount Selection */}
            <div>
              <label className="block text-xs font-medium text-app-text mb-1.5">
                Select Amount to Pay
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayAmount(term.outstandingAmount)}
                  className={`p-2.5 rounded border text-xs text-left transition-colors ${
                    payAmount === term.outstandingAmount
                      ? 'border-app-accent bg-app-accent/10 font-medium text-app-text'
                      : 'border-app-border bg-app-surface text-app-muted hover:border-app-muted'
                  }`}
                >
                  <p className="font-semibold text-app-text">Full Outstanding</p>
                  <p className="font-mono mt-0.5 text-app-accent font-bold">
                    ₹{term.outstandingAmount.toLocaleString('en-IN')}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPayAmount(Math.min(term.outstandingAmount, 20000))}
                  className={`p-2.5 rounded border text-xs text-left transition-colors ${
                    payAmount === Math.min(term.outstandingAmount, 20000) && payAmount !== term.outstandingAmount
                      ? 'border-app-accent bg-app-accent/10 font-medium text-app-text'
                      : 'border-app-border bg-app-surface text-app-muted hover:border-app-muted'
                  }`}
                >
                  <p className="font-semibold text-app-text">Part Installment</p>
                  <p className="font-mono mt-0.5 text-app-accent font-bold">
                    ₹{Math.min(term.outstandingAmount, 20000).toLocaleString('en-IN')}
                  </p>
                </button>
              </div>
            </div>

            {/* Acknowledgement Checkbox */}
            <label className="flex items-start gap-2.5 p-3 rounded bg-app-bg border border-app-border cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={confirmedCheckbox}
                onChange={(e) => setConfirmedCheckbox(e.target.checked)}
                className="mt-0.5 accent-app-accent rounded"
              />
              <span className="text-app-text leading-relaxed">
                I verify that this payment is for B.Tech Semester 2 institutional fees for Aarav Kumar (STU-20260501).
              </span>
            </label>

            {errorMessage && (
              <p className="text-xs text-app-danger">{errorMessage}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartPayment}
                disabled={!confirmedCheckbox}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Continue to Payment Method
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Method */}
        {step === 'choose_method' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-app-border">
              <span className="text-app-muted">Amount to be paid:</span>
              <span className="font-mono font-bold text-base text-app-accent">
                ₹{payAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Methods Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-app-text">
                Select Electronic Payment Channel
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMethod('UPI')}
                  className={`p-3 rounded border text-left flex items-start gap-2.5 transition-colors ${
                    method === 'UPI'
                      ? 'border-app-accent bg-app-accent/10 text-app-text font-medium'
                      : 'border-app-border bg-app-surface text-app-muted'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-app-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-app-text text-xs">UPI</p>
                    <p className="text-[11px] text-app-muted">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('Net Banking')}
                  className={`p-3 rounded border text-left flex items-start gap-2.5 transition-colors ${
                    method === 'Net Banking'
                      ? 'border-app-accent bg-app-accent/10 text-app-text font-medium'
                      : 'border-app-border bg-app-surface text-app-muted'
                  }`}
                >
                  <Building className="w-4 h-4 text-app-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-app-text text-xs">Net Banking</p>
                    <p className="text-[11px] text-app-muted">ICICI, HDFC, SBI, Axis, Canara</p>
                  </div>
                </button>
              </div>
            </div>

            {method === 'Net Banking' && (
              <div>
                <label className="block text-xs font-medium text-app-text mb-1">
                  Select Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-app-bg border border-app-border rounded text-app-text focus:outline-none focus:border-app-accent"
                >
                  <option value="ICICI Bank">ICICI Bank (Merchant Partner)</option>
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Canara Bank">Canara Bank</option>
                </select>
              </div>
            )}

            {/* Crucial Honesty & Security Notice */}
            <div className="p-3 bg-app-bg border border-app-border rounded text-xs space-y-1 text-app-muted">
              <div className="flex items-center gap-1.5 font-medium text-app-text">
                <Lock className="w-3.5 h-3.5 text-app-accent" />
                <span>Security Assurance</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                This portal never asks for, processes, or stores your UPI PIN, banking password, or card CVV. You will be redirected to the simulated bank authorization interface.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStep('review')}>
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleProceedToGateway}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Proceed to Secure Gateway
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Redirecting */}
        {step === 'redirecting' && (
          <div className="py-8 text-center space-y-3">
            <RotateCw className="w-8 h-8 text-app-accent animate-spin mx-auto" />
            <p className="text-sm font-semibold text-app-text">
              Connecting to Secure Sandbox Gateway...
            </p>
            <p className="text-xs text-app-muted">
              Handshake initialized with ICICI / NPCI sandbox node. Please do not refresh.
            </p>
          </div>
        )}

        {/* Step 4: Sandbox Bank Gateway Page (Simulated Bank Page) */}
        {step === 'sandbox_gateway' && (
          <div className="space-y-4">
            {/* Prominent Sandbox Mode Warning Banner */}
            <div className="p-3 bg-[#B7791F]/15 border border-[#B7791F]/30 rounded text-xs text-app-text space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#B7791F] uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Sandbox Mode — No Real Money Involved</span>
              </div>
              <p className="text-app-muted leading-relaxed text-[11px]">
                This simulates the external ICICI Payment Gateway authorization step. Real merchant API and server-side webhook validation will replace this interface in production.
              </p>
            </div>

            {/* Order details */}
            <div className="p-3 bg-app-bg border border-app-border rounded text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-app-muted">Gateway Order Ref:</span>
                <span className="text-app-text font-bold">{activeOrder?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted">Payment Channel:</span>
                <span className="text-app-text">{method} {method === 'Net Banking' ? `(${selectedBank})` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted">Transaction Amount:</span>
                <span className="text-app-accent font-bold">₹{payAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Simulation Control Buttons */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                Simulate Gateway Callback:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateBankOutcome('Success')}
                  className="p-3 rounded bg-app-success/10 border border-app-success/30 text-app-success hover:bg-app-success/20 text-xs font-semibold text-center transition-colors"
                >
                  Simulate Success
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateBankOutcome('Failed')}
                  className="p-3 rounded bg-app-danger/10 border border-app-danger/30 text-app-danger hover:bg-app-danger/20 text-xs font-semibold text-center transition-colors"
                >
                  Simulate Failure
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateBankOutcome('Pending')}
                  className="p-3 rounded bg-app-warning/10 border border-app-warning/30 text-app-warning hover:bg-app-warning/20 text-xs font-semibold text-center transition-colors"
                >
                  Simulate Pending
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateBankOutcome('Cancelled')}
                  className="p-3 rounded bg-app-bg border border-app-border text-app-muted hover:text-app-text text-xs font-medium text-center transition-colors"
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Verifying / Pending with Bank */}
        {step === 'verifying' && (
          <div className="py-8 text-center space-y-3">
            <RotateCw className="w-8 h-8 text-app-accent animate-spin mx-auto" />
            <p className="text-sm font-semibold text-app-text">
              Verifying Payment with Bank...
            </p>
            <p className="text-xs text-app-muted max-w-sm mx-auto leading-relaxed">
              We are confirming settlement with the issuing bank. Outstanding balance will update ONLY once verification is confirmed. Do not pay again.
            </p>
          </div>
        )}

        {/* Step 6: Success */}
        {step === 'success' && completedTxn && (
          <div className="py-4 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-app-success mx-auto" />
            <div>
              <h3 className="text-base font-bold text-app-text">
                Payment Verified & Accepted
              </h3>
              <p className="text-xs text-app-muted mt-0.5">
                Amount ₹{completedTxn.amount.toLocaleString('en-IN')} successfully credited to institutional accounts.
              </p>
            </div>

            <div className="p-3 bg-app-bg border border-app-border rounded text-xs space-y-1.5 font-mono text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-app-muted">Transaction ID:</span>
                <span className="font-bold text-app-text">{completedTxn.txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted">Receipt Number:</span>
                <span className="text-app-accent font-bold">{completedTxn.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted">Bank Ref:</span>
                <span className="text-app-muted">{completedTxn.referenceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted">Date & Time:</span>
                <span className="text-app-text">{completedTxn.date}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={onClose}
              >
                Close & View Updated Ledger
              </Button>
            </div>
          </div>
        )}

        {/* Step 7: Failed */}
        {step === 'failed' && (
          <div className="py-4 text-center space-y-4">
            <XCircle className="w-12 h-12 text-app-danger mx-auto" />
            <div>
              <h3 className="text-base font-bold text-app-text">
                Transaction Declined
              </h3>
              <p className="text-xs text-app-danger mt-1">
                {errorMessage || 'Simulated card/bank decline.'}
              </p>
              <p className="text-[11px] text-app-muted mt-1">
                Your account balance and fee dues remain unchanged. No money was deducted.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={onClose}>
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep('review')}
                icon={<RotateCw className="w-3.5 h-3.5" />}
              >
                Retry Payment
              </Button>
            </div>
          </div>
        )}

        {/* Step 8: Pending */}
        {step === 'pending' && (
          <div className="py-4 text-center space-y-4">
            <Clock className="w-12 h-12 text-app-warning mx-auto" />
            <div>
              <h3 className="text-base font-bold text-app-text">
                Settlement Confirmation Pending
              </h3>
              <p className="text-xs text-app-muted mt-1 max-w-sm mx-auto leading-relaxed">
                The gateway is waiting for interbank webhook acknowledgement. <span className="font-semibold text-app-text">Do not initiate a duplicate payment.</span> Outstanding balances will update automatically once verified.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSimulateBankOutcome('Success')}
                icon={<RotateCw className="w-3.5 h-3.5" />}
              >
                Re-check Gateway Status
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

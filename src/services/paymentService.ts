import { PaymentMethod, PaymentStatus, PaymentTransaction } from '../types';

export interface PaymentOrder {
  orderId: string;
  termId: string;
  termName: string;
  amount: number;
  method: PaymentMethod;
  createdAt: number;
  status: PaymentStatus;
  receiptNumber?: string;
  referenceNo?: string;
}

// Payment Service interface structured for real gateway (e.g. ICICI / Razorpay) replacement
class PaymentService {
  private activeOrders: Map<string, PaymentOrder> = new Map();

  /**
   * Create an initiated order. Prevents duplicate concurrent pending payment orders for the same term.
   */
  async createOrder(params: {
    termId: string;
    termName: string;
    amount: number;
    method: PaymentMethod;
  }): Promise<{ success: boolean; order?: PaymentOrder; error?: string }> {
    // Check if an order is already actively in progress for this term
    for (const [_, order] of this.activeOrders.entries()) {
      if (order.termId === params.termId && order.status === 'Pending') {
        return {
          success: false,
          error: 'An active payment session is already in progress for this term. Please complete or cancel it before retrying.'
        };
      }
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const newOrder: PaymentOrder = {
      orderId,
      termId: params.termId,
      termName: params.termName,
      amount: params.amount,
      method: params.method,
      createdAt: Date.now(),
      status: 'Pending'
    };

    this.activeOrders.set(orderId, newOrder);
    return { success: true, order: newOrder };
  }

  /**
   * Verifies the simulated payment transaction.
   * Balances change ONLY when status is 'Success'.
   */
  async verifyPayment(
    orderId: string,
    simulatedOutcome: 'Success' | 'Failed' | 'Pending' | 'Cancelled'
  ): Promise<{ status: PaymentStatus; transaction?: PaymentTransaction; message: string }> {
    const order = this.activeOrders.get(orderId);
    if (!order) {
      return {
        status: 'Failed',
        message: 'Order reference not found. Transaction cannot be verified.'
      };
    }

    order.status = simulatedOutcome;

    if (simulatedOutcome === 'Success') {
      const txnNumber = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
      const refNumber = order.method === 'UPI'
        ? `UPI-SANDBOX-${Math.floor(10000000 + Math.random() * 90000000)}`
        : `NB-ICICI-SBX-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      order.receiptNumber = receiptNo;
      order.referenceNo = refNumber;

      const transaction: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        txnId: txnNumber,
        date: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        amount: order.amount,
        method: order.method,
        status: 'Success',
        termId: order.termId,
        termName: order.termName,
        referenceNo: refNumber,
        receiptNumber: receiptNo,
        notes: 'Verified Sandbox Simulation'
      };

      this.activeOrders.delete(orderId);
      return {
        status: 'Success',
        transaction,
        message: 'Payment verified successfully by sandbox gateway.'
      };
    }

    if (simulatedOutcome === 'Failed') {
      this.activeOrders.delete(orderId);
      return {
        status: 'Failed',
        message: 'Transaction declined by issuer bank in sandbox simulation.'
      };
    }

    if (simulatedOutcome === 'Cancelled') {
      this.activeOrders.delete(orderId);
      return {
        status: 'Cancelled',
        message: 'Transaction cancelled by student.'
      };
    }

    // Pending: kept active in case of manual retry verification
    return {
      status: 'Pending',
      message: 'Bank settlement confirmation is currently pending. Do not initiate duplicate payment.'
    };
  }

  getOrder(orderId: string): PaymentOrder | undefined {
    return this.activeOrders.get(orderId);
  }
}

export const paymentService = new PaymentService();

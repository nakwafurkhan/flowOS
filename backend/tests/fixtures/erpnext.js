/**
 * Synthetic ERPNext fixtures for development and tests.
 *
 * These are invented records. They must never be treated as real
 * customer or financial data.
 */

export const customers = [
  {
    name: 'CUST-001',
    customer_name: 'Acme Trading LLC',
    territory: 'United Arab Emirates',
    customer_group: 'Commercial',
    credit_limit: 250000,
    disabled: 0,
  },
  {
    name: 'CUST-002',
    customer_name: 'Beta Retailers',
    territory: 'Saudi Arabia',
    customer_group: 'Retail',
    credit_limit: 100000,
    disabled: 0,
  },
  {
    name: 'CUST-003',
    customer_name: 'Cedar Wholesale',
    territory: 'Qatar',
    customer_group: 'Commercial',
    credit_limit: null,
    disabled: 0,
  },
  {
    name: 'CUST-004',
    customer_name: 'Acme Parts',
    territory: 'United Arab Emirates',
    customer_group: 'Commercial',
    credit_limit: 50000,
    disabled: 0,
  },
];

export const salesInvoices = [
  {
    name: 'SINV-1001',
    customer: 'CUST-001',
    posting_date: '2026-09-01',
    due_date: '2026-09-30',
    currency: 'AED',
    grand_total: 50000,
    outstanding_amount: 20000,
    status: 'Overdue',
    docstatus: 1,
  },
  {
    name: 'SINV-1002',
    customer: 'CUST-001',
    posting_date: '2026-09-20',
    due_date: '2026-10-20',
    currency: 'AED',
    grand_total: 30000,
    outstanding_amount: 30000,
    status: 'Unpaid',
    docstatus: 1,
  },
  {
    name: 'SINV-1003',
    customer: 'CUST-001',
    posting_date: '2026-10-01',
    due_date: null,
    currency: 'AED',
    grand_total: 15000,
    outstanding_amount: 15000,
    status: 'Unpaid',
    docstatus: 1,
  },
  {
    name: 'SINV-1004',
    customer: 'CUST-002',
    posting_date: '2026-08-15',
    due_date: '2026-08-30',
    currency: 'SAR',
    grand_total: 45000,
    outstanding_amount: 0,
    status: 'Paid',
    docstatus: 1,
  },
];

export const paymentEntries = [
  {
    name: 'PAY-2001',
    party_type: 'Customer',
    party: 'CUST-001',
    posting_date: '2026-09-15',
    paid_amount: 30000,
    unallocated_amount: 0,
    payment_type: 'Receive',
    status: 'Submitted',
    docstatus: 1,
  },
  {
    name: 'PAY-2002',
    party_type: 'Customer',
    party: 'CUST-002',
    posting_date: '2026-08-30',
    paid_amount: 45000,
    unallocated_amount: 0,
    payment_type: 'Receive',
    status: 'Submitted',
    docstatus: 1,
  },
];

export const salesOrders = [
  {
    name: 'SO-3001',
    customer: 'CUST-001',
    transaction_date: '2026-09-25',
    delivery_date: '2026-10-10',
    currency: 'AED',
    grand_total: 40000,
    status: 'To Deliver and Bill',
    per_delivered: 0,
    per_billed: 0,
    docstatus: 1,
  },
  {
    name: 'SO-3002',
    customer: 'CUST-001',
    transaction_date: '2026-09-28',
    delivery_date: '2026-10-15',
    currency: 'AED',
    grand_total: 25000,
    status: 'To Bill',
    per_delivered: 100,
    per_billed: 0,
    docstatus: 1,
  },
  {
    name: 'SO-3003',
    customer: 'CUST-002',
    transaction_date: '2026-09-10',
    delivery_date: '2026-09-20',
    currency: 'SAR',
    grand_total: 12000,
    status: 'Completed',
    per_delivered: 100,
    per_billed: 100,
    docstatus: 1,
  },
];

export const deliveryNotes = [
  {
    name: 'DN-4001',
    customer: 'CUST-001',
    posting_date: '2026-10-05',
    currency: 'AED',
    grand_total: 18000,
    status: 'To Bill',
    per_billed: 0,
    docstatus: 1,
  },
  {
    name: 'DN-4002',
    customer: 'CUST-002',
    posting_date: '2026-09-22',
    currency: 'SAR',
    grand_total: 12000,
    status: 'Completed',
    per_billed: 100,
    docstatus: 1,
  },
];

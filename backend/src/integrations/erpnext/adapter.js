import {
  ErpnextAmbiguousMatchError,
  ErpnextForbiddenDoctypeError,
  ErpnextResponseError,
} from './errors.js';

/**
 * Explicit read-only DocType contract.
 *
 * Every allowed DocType has an exact field list. ERPNext `fields` are
 * requested explicitly so arbitrary data is never pulled into memory or
 * passed to the LLM layer.
 */
const ALLOWED_DOCTYPES = Object.freeze({
  Customer: Object.freeze([
    'name',
    'customer_name',
    'territory',
    'customer_group',
    'credit_limit',
  ]),
  'Sales Invoice': Object.freeze([
    'name',
    'customer',
    'posting_date',
    'due_date',
    'currency',
    'grand_total',
    'outstanding_amount',
    'status',
    'docstatus',
  ]),
  'Payment Entry': Object.freeze([
    'name',
    'party_type',
    'party',
    'posting_date',
    'paid_amount',
    'unallocated_amount',
    'payment_type',
    'status',
    'docstatus',
  ]),
  'Sales Order': Object.freeze([
    'name',
    'customer',
    'transaction_date',
    'delivery_date',
    'currency',
    'grand_total',
    'status',
    'per_delivered',
    'per_billed',
    'docstatus',
  ]),
  'Delivery Note': Object.freeze([
    'name',
    'customer',
    'posting_date',
    'currency',
    'grand_total',
    'status',
    'per_billed',
    'docstatus',
  ]),
});

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function toFilterList(filters = {}) {
  return Object.entries(filters).map(([field, value]) => [field, '=', value]);
}

/**
 * Read-only ERPNext adapter.
 *
 * The adapter knows nothing about HTTP; it receives a transport with a
 * `get(path, { headers, signal })` method. The default transport is
 * {@link HttpTransport}; tests inject a mock.
 */
export class ErpnextAdapter {
  constructor({ transport }) {
    if (!transport || typeof transport.get !== 'function') {
      throw new TypeError('ErpnextAdapter requires a transport with a get(path) method');
    }
    this.transport = transport;
  }

  /**
   * Search customers by ID or name. ERPNext `like` filters are used so
   * partial matches surface for the caller to disambiguate.
   *
   * Returns an array of customer summaries (id, name, territory).
   */
  async searchCustomers(query, { limit = 10 } = {}) {
    const normalized = String(query ?? '').trim();
    if (normalized === '') return [];

    const pageSize = clampPageSize(limit);
    const like = `%${normalized}%`;
    const payload = await this.request({
      doctype: 'Customer',
      filters: { disabled: 0 },
      orFilters: [
        ['name', 'like', like],
        ['customer_name', 'like', like],
      ],
      limitPageLength: pageSize,
    });

    return listPayload(payload).map(mapCustomerSummary);
  }

  /**
   * Look up one customer by exact ID. Returns a customer summary or
   * `null` when the customer does not exist.
   */
  async getCustomer(customerId) {
    const normalized = String(customerId ?? '').trim();
    if (normalized === '') return null;

    const payload = await this.request({
      doctype: 'Customer',
      filters: { name: normalized, disabled: 0 },
      fields: ALLOWED_DOCTYPES.Customer,
      // Request two rows so a duplicated ID can be surfaced as an
      // ambiguity instead of being silently truncated.
      limitPageLength: 2,
    });

    const rows = listPayload(payload);
    if (rows.length === 0) return null;
    if (rows.length > 1) {
      throw new ErpnextAmbiguousMatchError(rows.map(mapCustomerSummary));
    }
    return mapCustomerSummary(rows[0]);
  }

  /** List read-only sales invoice summaries for a customer. */
  async listSalesInvoices(customerId, { status, limit = 20 } = {}) {
    const filters = {
      customer: requireCustomerId(customerId),
      docstatus: 1,
    };
    if (status) filters.status = status;

    const payload = await this.request({
      doctype: 'Sales Invoice',
      filters,
      limitPageLength: clampPageSize(limit),
    });
    return listPayload(payload).map(mapSalesInvoice);
  }

  /** List read-only payment entry summaries for a customer. */
  async listPaymentEntries(customerId, { limit = 20 } = {}) {
    const payload = await this.request({
      doctype: 'Payment Entry',
      filters: {
        party_type: 'Customer',
        party: requireCustomerId(customerId),
        docstatus: 1,
      },
      limitPageLength: clampPageSize(limit),
    });
    return listPayload(payload).map(mapPaymentEntry);
  }

  /** List read-only sales order summaries for a customer. */
  async listSalesOrders(customerId, { statuses = [], limit = 20 } = {}) {
    const filters = {
      customer: requireCustomerId(customerId),
      docstatus: 1,
    };
    const orFilters = statuses.length > 0
      ? statuses.map((status) => ['status', '=', status])
      : undefined;

    const payload = await this.request({
      doctype: 'Sales Order',
      filters,
      orFilters,
      limitPageLength: clampPageSize(limit),
    });
    return listPayload(payload).map(mapSalesOrder);
  }

  /** List read-only delivery note summaries for a customer. */
  async listDeliveryNotes(customerId, { statuses = [], limit = 20 } = {}) {
    const filters = {
      customer: requireCustomerId(customerId),
      docstatus: 1,
    };
    const orFilters = statuses.length > 0
      ? statuses.map((status) => ['status', '=', status])
      : undefined;

    const payload = await this.request({
      doctype: 'Delivery Note',
      filters,
      orFilters,
      limitPageLength: clampPageSize(limit),
    });
    return listPayload(payload).map(mapDeliveryNote);
  }

  /**
   * Low-level read request. Validates the DocType and keeps every
   * request explicit: fields, filters, or-filters and pagination.
   */
  async request({
    doctype,
    filters = {},
    orFilters,
    fields,
    limitPageLength = DEFAULT_PAGE_SIZE,
    limitStart = 0,
  }) {
    if (!(doctype in ALLOWED_DOCTYPES)) {
      throw new ErpnextForbiddenDoctypeError(doctype);
    }

    const params = new URLSearchParams();
    params.set('filters', JSON.stringify(toFilterList(filters)));
    if (orFilters) {
      params.set('or_filters', JSON.stringify(orFilters));
    }
    params.set('fields', JSON.stringify(fields ?? ALLOWED_DOCTYPES[doctype]));
    params.set('limit_page_length', String(clampPageSize(limitPageLength)));
    params.set('limit_start', String(Math.max(0, limitStart)));

    const payload = await this.transport.get(
      `/api/resource/${encodeURIComponent(doctype)}?${params.toString()}`,
    );

    if (payload && typeof payload === 'object' && Array.isArray(payload.data)) {
      return payload;
    }
    throw new ErpnextResponseError('ERPNext list response missing data array');
  }
}

function listPayload(payload) {
  if (!payload || !Array.isArray(payload.data)) {
    throw new ErpnextResponseError('ERPNext list response missing data array');
  }
  return payload.data;
}

function requireCustomerId(customerId) {
  const normalized = String(customerId ?? '').trim();
  if (normalized === '') throw new TypeError('customerId is required');
  return normalized;
}

function clampPageSize(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(parsed, MAX_PAGE_SIZE);
}

function mapCustomerSummary(row) {
  return {
    id: row.name,
    name: row.customer_name ?? row.name,
    territory: row.territory ?? null,
    customerGroup: row.customer_group ?? null,
    creditLimit: typeof row.credit_limit === 'number' ? row.credit_limit : null,
  };
}

function mapSalesInvoice(row) {
  return {
    id: row.name,
    customer: row.customer,
    postingDate: row.posting_date ?? null,
    dueDate: row.due_date ?? null,
    currency: row.currency ?? null,
    grandTotal: numberOrNull(row.grand_total),
    outstandingAmount: numberOrNull(row.outstanding_amount),
    status: row.status ?? null,
    docstatus: row.docstatus ?? null,
  };
}

function mapPaymentEntry(row) {
  return {
    id: row.name,
    partyType: row.party_type ?? null,
    party: row.party ?? null,
    postingDate: row.posting_date ?? null,
    paidAmount: numberOrNull(row.paid_amount),
    unallocatedAmount: numberOrNull(row.unallocated_amount),
    paymentType: row.payment_type ?? null,
    status: row.status ?? null,
    docstatus: row.docstatus ?? null,
  };
}

function mapSalesOrder(row) {
  return {
    id: row.name,
    customer: row.customer,
    transactionDate: row.transaction_date ?? null,
    deliveryDate: row.delivery_date ?? null,
    currency: row.currency ?? null,
    grandTotal: numberOrNull(row.grand_total),
    status: row.status ?? null,
    perDelivered: numberOrNull(row.per_delivered),
    perBilled: numberOrNull(row.per_billed),
    docstatus: row.docstatus ?? null,
  };
}

function mapDeliveryNote(row) {
  return {
    id: row.name,
    customer: row.customer,
    postingDate: row.posting_date ?? null,
    currency: row.currency ?? null,
    grandTotal: numberOrNull(row.grand_total),
    status: row.status ?? null,
    perBilled: numberOrNull(row.per_billed),
    docstatus: row.docstatus ?? null,
  };
}

function numberOrNull(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export { ALLOWED_DOCTYPES };

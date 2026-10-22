import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { ErpnextAdapter } from '../src/integrations/erpnext/adapter.js';
import {
  ErpnextAmbiguousMatchError,
  ErpnextForbiddenDoctypeError,
  ErpnextResponseError,
} from '../src/integrations/erpnext/errors.js';
import { MockTransport } from './helpers/mock-transport.js';
import {
  customers,
  salesInvoices,
  paymentEntries,
  salesOrders,
  deliveryNotes,
} from './fixtures/erpnext.js';

function buildAdapter(overrides = {}) {
  const transport = new MockTransport({
    Customer: customers,
    'Sales Invoice': salesInvoices,
    'Payment Entry': paymentEntries,
    'Sales Order': salesOrders,
    'Delivery Note': deliveryNotes,
  });
  return {
    transport,
    adapter: new ErpnextAdapter({ transport, ...overrides }),
  };
}

describe('searchCustomers', () => {
  test('returns matching customer summaries', async () => {
    const { adapter } = buildAdapter();
    const results = await adapter.searchCustomers('Acme');
    assert.equal(results.length, 2);
    assert.deepEqual(results[0], {
      id: 'CUST-001',
      name: 'Acme Trading LLC',
      territory: 'United Arab Emirates',
      customerGroup: 'Commercial',
      creditLimit: 250000,
    });
  });

  test('returns empty list for a blank query without calling transport', async () => {
    const { adapter, transport } = buildAdapter();
    const results = await adapter.searchCustomers('   ');
    assert.deepEqual(results, []);
    assert.equal(transport.requests.length, 0);
  });

  test('returns empty list when no customer matches', async () => {
    const { adapter } = buildAdapter();
    const results = await adapter.searchCustomers('Zebra Nonexistent');
    assert.deepEqual(results, []);
  });
});

describe('getCustomer', () => {
  test('returns a summary for an exact ID', async () => {
    const { adapter } = buildAdapter();
    const customer = await adapter.getCustomer('CUST-002');
    assert.equal(customer.id, 'CUST-002');
    assert.equal(customer.name, 'Beta Retailers');
  });

  test('returns null for an unknown ID', async () => {
    const { adapter } = buildAdapter();
    const customer = await adapter.getCustomer('CUST-999');
    assert.equal(customer, null);
  });

  test('returns null for a blank ID without calling transport', async () => {
    const { adapter, transport } = buildAdapter();
    assert.equal(await adapter.getCustomer(''), null);
    assert.equal(transport.requests.length, 0);
  });

  test('throws an ambiguity error when more than one row matches exact ID', async () => {
    const transport = new MockTransport({
      Customer: [
        customers[0],
        { ...customers[0], customer_name: 'Acme Trading Duplicate' },
      ],
    });
    const adapter = new ErpnextAdapter({ transport });
    await assert.rejects(
      () => adapter.getCustomer('CUST-001'),
      (error) => {
        assert.ok(error instanceof ErpnextAmbiguousMatchError);
        assert.equal(error.candidates.length, 2);
        return true;
      },
    );
  });
});

describe('document lists', () => {
  test('listSalesInvoices returns only posted invoices for the customer', async () => {
    const { adapter, transport } = buildAdapter();
    const invoices = await adapter.listSalesInvoices('CUST-001');
    assert.equal(invoices.length, 3);
    assert.ok(invoices.every((invoice) => invoice.customer === 'CUST-001'));
    assert.ok(invoices.every((invoice) => invoice.docstatus === 1));
    assert.equal(invoices.find((invoice) => invoice.id === 'SINV-1003').dueDate, null);
    assert.ok(transport.requests[0].includes('filters='));
  });

  test('listSalesInvoices supports a status filter', async () => {
    const { adapter } = buildAdapter();
    const invoices = await adapter.listSalesInvoices('CUST-001', { status: 'Overdue' });
    assert.equal(invoices.length, 1);
    assert.equal(invoices[0].id, 'SINV-1001');
  });

  test('listPaymentEntries returns customer payment receipts', async () => {
    const { adapter } = buildAdapter();
    const payments = await adapter.listPaymentEntries('CUST-001');
    assert.equal(payments.length, 1);
    assert.equal(payments[0].id, 'PAY-2001');
    assert.equal(payments[0].partyType, 'Customer');
  });

  test('listSalesOrders applies OR status filters', async () => {
    const { adapter } = buildAdapter();
    const orders = await adapter.listSalesOrders('CUST-001', {
      statuses: ['To Deliver and Bill', 'To Bill'],
    });
    assert.equal(orders.length, 2);
    assert.deepEqual(
      orders.map((order) => order.status).sort(),
      ['To Bill', 'To Deliver and Bill'],
    );
  });

  test('listDeliveryNotes returns delivery notes for the customer', async () => {
    const { adapter } = buildAdapter();
    const notes = await adapter.listDeliveryNotes('CUST-001');
    assert.equal(notes.length, 1);
    assert.equal(notes[0].id, 'DN-4001');
  });

  test('list methods require a customer ID', async () => {
    const { adapter } = buildAdapter();
    await assert.rejects(() => adapter.listSalesInvoices(''), TypeError);
  });
});

describe('request guardrails', () => {
  test('rejects non-allowed DocTypes', async () => {
    const { adapter } = buildAdapter();
    await assert.rejects(
      () => adapter.request({ doctype: 'User' }),
      ErpnextForbiddenDoctypeError,
    );
  });

  test('throws a response error when data array is missing', async () => {
    const transport = { get: async () => ({ message: 'unexpected shape' }) };
    const adapter = new ErpnextAdapter({ transport });
    await assert.rejects(
      () => adapter.searchCustomers('Acme'),
      ErpnextResponseError,
    );
  });

  test('requests include explicit fields and pagination', async () => {
    const { adapter, transport } = buildAdapter();
    await adapter.getCustomer('CUST-001');
    const path = transport.requests[0];
    assert.ok(path.includes('fields='));
    assert.ok(path.includes('limit_page_length=2'));
    assert.ok(path.includes('limit_start=0'));
  });
});

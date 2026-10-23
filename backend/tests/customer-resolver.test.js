import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveCustomer,
  RESOLVE_STATUS,
} from '../src/services/customer-resolver.js';
import { ErpnextAdapter } from '../src/integrations/erpnext/adapter.js';
import { MockTransport } from './helpers/mock-transport.js';
import { customers } from './fixtures/erpnext.js';

function buildResolver(dataByDoctype = { Customer: customers }) {
  const transport = new MockTransport(dataByDoctype);
  const adapter = new ErpnextAdapter({ transport });
  return { resolver: (query, options) => resolveCustomer(query, adapter, options), transport };
}

describe('resolveCustomer', () => {
  test('exact ID match wins over a fuzzy name search', async () => {
    const { resolver, transport } = buildResolver();
    const result = await resolver('CUST-001');

    assert.equal(result.status, RESOLVE_STATUS.FOUND);
    assert.equal(result.customer.id, 'CUST-001');
    assert.equal(result.customer.name, 'Acme Trading LLC');

    // Exact ID path makes a single getCustomer call; no name search.
    assert.equal(transport.requests.length, 1);
  });

  test('a unique name search resolves to one customer', async () => {
    const { resolver } = buildResolver();
    const result = await resolver('Beta Retailers');

    assert.equal(result.status, RESOLVE_STATUS.FOUND);
    assert.equal(result.customer.id, 'CUST-002');
  });

  test('multiple name matches return ambiguous with all candidates', async () => {
    const { resolver } = buildResolver();
    const result = await resolver('Acme');

    assert.equal(result.status, RESOLVE_STATUS.AMBIGUOUS);
    assert.equal(result.candidates.length, 2);
    assert.ok(
      result.candidates.some((candidate) => candidate.id === 'CUST-001'),
    );
    assert.ok(
      result.candidates.some((candidate) => candidate.id === 'CUST-004'),
    );
    assert.match(result.message, /2 customers match "Acme"/);
  });

  test('no matches return not_found with a helpful message', async () => {
    const { resolver } = buildResolver();
    const result = await resolver('Zebra Nonexistent');

    assert.equal(result.status, RESOLVE_STATUS.NOT_FOUND);
    assert.match(result.message, /No customer found/);
  });

  test('blank queries return invalid_query without calling ERPNext', async () => {
    const { resolver, transport } = buildResolver();
    for (const blank of ['', '   ', '\t\n']) {
      const result = await resolver(blank);
      assert.equal(result.status, RESOLVE_STATUS.INVALID_QUERY);
    }
    assert.equal(transport.requests.length, 0);
  });

  test('null/undefined query is treated as invalid_query', async () => {
    const { resolver, transport } = buildResolver();
    const result = await resolver(null);
    assert.equal(result.status, RESOLVE_STATUS.INVALID_QUERY);
    assert.equal(transport.requests.length, 0);
  });

  test('adapter failures propagate and are not converted to not_found', async () => {
    const boom = new Error('ERPNext is unreachable');
    const failingAdapter = {
      getCustomer: async () => {
        throw boom;
      },
      searchCustomers: async () => {
        throw boom;
      },
    };
    await assert.rejects(
      () => resolveCustomer('CUST-001', failingAdapter),
      (error) => error === boom,
    );
  });

  test('missing adapter methods are rejected with a TypeError', async () => {
    await assert.rejects(
      () => resolveCustomer('Acme', {}),
      TypeError,
    );
  });

  test('candidate limit is passed through to the name search', async () => {
    const { resolver, transport } = buildResolver();
    await resolver('Acme', { candidateLimit: 1 });

    const path = transport.requests[transport.requests.length - 1];
    assert.ok(path.includes('limit_page_length=1'), path);
  });
});

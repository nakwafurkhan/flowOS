import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { HttpTransport } from '../src/integrations/erpnext/http-transport.js';
import {
  ErpnextConfigurationError,
  ErpnextHttpError,
  ErpnextTimeoutError,
} from '../src/integrations/erpnext/errors.js';

function buildTransport({ fetchFn, ...config } = {}) {
  return new HttpTransport({
    baseUrl: 'https://erpnext.test',
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    timeoutMs: 100,
    fetchFn: fetchFn ?? (async () => jsonResponse({ data: [] })),
    ...config,
  });
}

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe('HttpTransport', () => {
  test('sends a token auth header without leaking the secret', async () => {
    let captured;
    const fetchFn = async (url, options) => {
      captured = { url, headers: options.headers };
      return jsonResponse({ data: [] });
    };
    const transport = buildTransport({ fetchFn });
    await transport.get('/api/resource/Customer');

    const expectedToken = Buffer.from('test-key:test-secret').toString('base64');
    assert.equal(captured.url, 'https://erpnext.test/api/resource/Customer');
    assert.equal(captured.headers.Authorization, `token ${expectedToken}`);
  });

  test('maps non-2xx responses to ErpnextHttpError with a safe message', async () => {
    const transport = buildTransport({
      fetchFn: async () =>
        jsonResponse(
          { exception: 'PermissionError', message: 'Not permitted' },
          403,
        ),
    });
    await assert.rejects(
      () => transport.get('/api/resource/Customer'),
      (error) => {
        assert.ok(error instanceof ErpnextHttpError);
        assert.equal(error.status, 403);
        assert.match(error.message, /Not permitted/);
        return true;
      },
    );
  });

  test('maps aborted requests to ErpnextTimeoutError', async () => {
    const transport = buildTransport({
      fetchFn: async (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => {
            const error = new Error('aborted');
            error.name = 'AbortError';
            reject(error);
          });
        }),
    });
    await assert.rejects(
      () => transport.get('/api/resource/Customer'),
      ErpnextTimeoutError,
    );
  });

  test('rejects when API key or secret is missing', () => {
    const transport = new HttpTransport({
      baseUrl: 'https://erpnext.test',
      apiKey: '',
      apiSecret: 'secret',
    });
    assert.throws(() => transport.authHeader(), ErpnextConfigurationError);
  });
});

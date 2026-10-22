import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  loadErpnextConfig,
  assertErpnextConfig,
} from '../src/integrations/erpnext/config.js';
import { ErpnextConfigurationError } from '../src/integrations/erpnext/errors.js';

describe('ERPNext config', () => {
  test('loads and trims values from the environment', () => {
    const config = loadErpnextConfig({
      ERPNEXT_BASE_URL: '  https://erpnext.test/  ',
      ERPNEXT_API_KEY: ' key ',
      ERPNEXT_API_SECRET: ' secret ',
      ERPNEXT_TIMEOUT_MS: '3000',
    });
    assert.equal(config.baseUrl, 'https://erpnext.test');
    assert.equal(config.apiKey, 'key');
    assert.equal(config.apiSecret, 'secret');
    assert.equal(config.timeoutMs, 3000);
  });

  test('defaults timeout to 5000 when missing or invalid', () => {
    assert.equal(loadErpnextConfig({}).timeoutMs, 5000);
    assert.equal(
      loadErpnextConfig({ ERPNEXT_TIMEOUT_MS: 'not-a-number' }).timeoutMs,
      5000,
    );
  });

  test('assertErpnextConfig lists every missing value', () => {
    assert.throws(
      () => assertErpnextConfig(loadErpnextConfig({})),
      (error) => {
        assert.ok(error instanceof ErpnextConfigurationError);
        assert.match(error.message, /ERPNEXT_BASE_URL/);
        assert.match(error.message, /ERPNEXT_API_KEY/);
        assert.match(error.message, /ERPNEXT_API_SECRET/);
        return true;
      },
    );
  });

  test('assertErpnextConfig passes when required values are present', () => {
    const config = loadErpnextConfig({
      ERPNEXT_BASE_URL: 'https://erpnext.test',
      ERPNEXT_API_KEY: 'key',
      ERPNEXT_API_SECRET: 'secret',
    });
    assert.doesNotThrow(() => assertErpnextConfig(config));
  });
});

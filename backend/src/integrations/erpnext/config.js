import { ErpnextConfigurationError } from './errors.js';

/**
 * Load ERPNext connection settings from the environment.
 *
 * Never logs the secret values. Returns null for optional values so
 * callers can decide what to do when configuration is absent.
 */
export function loadErpnextConfig(env = process.env) {
  const baseUrl = (env.ERPNEXT_BASE_URL ?? '').trim().replace(/\/+$/, '');
  const apiKey = (env.ERPNEXT_API_KEY ?? '').trim();
  const apiSecret = (env.ERPNEXT_API_SECRET ?? '').trim();
  const timeoutMs = Number.parseInt(env.ERPNEXT_TIMEOUT_MS ?? '5000', 10);

  const timeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 5000;

  return {
    baseUrl,
    apiKey,
    apiSecret,
    timeoutMs: timeout,
  };
}

/**
 * Validate that the values required for a real HTTP call are present.
 * Tests use mock transports and therefore do not need real credentials.
 */
export function assertErpnextConfig(config) {
  const missing = [];
  if (!config.baseUrl) missing.push('ERPNEXT_BASE_URL');
  if (!config.apiKey) missing.push('ERPNEXT_API_KEY');
  if (!config.apiSecret) missing.push('ERPNEXT_API_SECRET');

  if (missing.length > 0) {
    throw new ErpnextConfigurationError(
      `Missing ERPNext configuration: ${missing.join(', ')}`,
    );
  }
}

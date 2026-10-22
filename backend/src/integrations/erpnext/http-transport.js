import {
  ErpnextConfigurationError,
  ErpnextHttpError,
  ErpnextResponseError,
  ErpnextTimeoutError,
} from './errors.js';

/**
 * Default HTTP transport for a real ERPNext instance.
 *
 * The adapter only depends on `transport.get(path, { headers, signal })`,
 * so tests can inject a mock object with the same contract and make no
 * network calls at all.
 */
export class HttpTransport {
  constructor({ baseUrl, apiKey, apiSecret, timeoutMs = 5000, fetchFn = fetch }) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.timeoutMs = timeoutMs;
    this.fetchFn = fetchFn;
  }

  authHeader() {
    if (!this.apiKey || !this.apiSecret) {
      throw new ErpnextConfigurationError(
        'ERPNext API key and secret are required for HTTP transport',
      );
    }
    const token = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
    return { Authorization: `token ${token}` };
  }

  async get(path, { headers = {}, signal } = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
    const externalSignal = signal;

    const onAbort = () => controller.abort();
    if (externalSignal) {
      if (externalSignal.aborted) controller.abort();
      else externalSignal.addEventListener('abort', onAbort, { once: true });
    }

    try {
      const response = await this.fetchFn(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...this.authHeader(),
          ...headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ErpnextHttpError(
          response.status,
          await readErrorMessage(response),
        );
      }

      try {
        return await response.json();
      } catch (cause) {
        throw new ErpnextResponseError(
          'ERPNext response was not valid JSON',
          { cause },
        );
      }
    } catch (error) {
      if (error instanceof ErpnextHttpError) throw error;
      if (error instanceof ErpnextResponseError) throw error;
      if (error?.name === 'AbortError' || controller.signal.aborted) {
        throw new ErpnextTimeoutError('ERPNext request timed out', { cause: error });
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      if (externalSignal) externalSignal.removeEventListener('abort', onAbort);
    }
  }
}

async function readErrorMessage(response) {
  try {
    const body = await response.json();
    const serverMessages = Array.isArray(body?._server_messages)
      ? body._server_messages.map((raw) => {
          try {
            return JSON.parse(raw)?.message ?? raw;
          } catch {
            return raw;
          }
        })
      : [];
    const message =
      body?.message ??
      body?.exception ??
      (serverMessages.length > 0 ? serverMessages.join('; ') : '');
    return typeof message === 'string' ? message.slice(0, 500) : '';
  } catch {
    return '';
  }
}

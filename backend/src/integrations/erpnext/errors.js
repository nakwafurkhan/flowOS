/**
 * Typed errors for the ERPNext adapter.
 *
 * Callers must be able to distinguish "the data is genuinely empty"
 * from "we could not reach ERPNext" or "credentials are missing".
 * These errors are the contract for that distinction.
 */

export class ErpnextError extends Error {
  constructor(message, options = {}) {
    super(message, options);
    this.name = this.constructor.name;
    this.cause = options.cause;
    this.code = options.code ?? 'ERPNEXT_ERROR';
  }
}

/** Configuration is incomplete (missing base URL, API key or secret). */
export class ErpnextConfigurationError extends ErpnextError {
  constructor(message, options = {}) {
    super(message, { ...options, code: 'ERPNEXT_CONFIGURATION' });
  }
}

/** The request timed out before ERPNext answered. */
export class ErpnextTimeoutError extends ErpnextError {
  constructor(message = 'ERPNext request timed out', options = {}) {
    super(message, { ...options, code: 'ERPNEXT_TIMEOUT' });
  }
}

/** ERPNext responded with a non-2xx status. */
export class ErpnextHttpError extends ErpnextError {
  constructor(status, message, options = {}) {
    const detail = message ? `: ${message}` : '';
    super(`ERPNext request failed with status ${status}${detail}`, {
      ...options,
      code: 'ERPNEXT_HTTP',
    });
    this.status = status;
  }
}

/** The ERPNext response did not match the expected JSON shape. */
export class ErpnextResponseError extends ErpnextError {
  constructor(message = 'Unexpected ERPNext response shape', options = {}) {
    super(message, { ...options, code: 'ERPNEXT_RESPONSE' });
  }
}

/** Multiple customers matched and a choice is required. */
export class ErpnextAmbiguousMatchError extends ErpnextError {
  constructor(candidates, message = 'Multiple customers match the query', options = {}) {
    super(message, { ...options, code: 'ERPNEXT_AMBIGUOUS_MATCH' });
    this.candidates = candidates;
  }
}

/** A caller requested a document type that the adapter does not allow. */
export class ErpnextForbiddenDoctypeError extends ErpnextError {
  constructor(doctype, options = {}) {
    super(`DocType ${doctype} is not allowed by this read-only adapter`, {
      ...options,
      code: 'ERPNEXT_FORBIDDEN_DOCTYPE',
    });
    this.doctype = doctype;
  }
}

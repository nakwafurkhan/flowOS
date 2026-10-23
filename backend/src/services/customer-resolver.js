/**
 * Deterministic customer lookup and disambiguation.
 *
 * Product rule (PRODUCT_SPEC.md / AGENTS.md):
 *   - exact ID match takes priority;
 *   - never silently choose between ambiguous matches;
 *   - failures must stay visible as typed errors and must never be
 *     converted into "not found" or a zero balance.
 *
 * The resolver returns a discriminated result so callers can branch
 * without inspecting exception objects.
 */

export const RESOLVE_STATUS = Object.freeze({
  FOUND: 'found',
  AMBIGUOUS: 'ambiguous',
  NOT_FOUND: 'not_found',
  INVALID_QUERY: 'invalid_query',
});

/**
 * Resolve a free-text customer query to a single customer or a list of
 * candidates.
 *
 * @param {string} rawQuery  customer name or ID as typed by the user
 * @param {object} adapter   read-only ERPNext adapter (INT-001)
 * @param {object} [options]
 * @param {number} [options.candidateLimit=10] max name-search candidates
 * @returns {Promise<object>} discriminated result
 */
export async function resolveCustomer(rawQuery, adapter, { candidateLimit = 10 } = {}) {
  const query = String(rawQuery ?? '').trim();

  if (query === '') {
    return {
      status: RESOLVE_STATUS.INVALID_QUERY,
      message: 'Please provide a customer name or ID.',
    };
  }

  assertAdapter(adapter);

  // 1. Exact ID match takes priority. This is a single deterministic
  //    hit and must not fall through to a fuzzy name search.
  const exact = await adapter.getCustomer(query);
  if (exact) {
    return { status: RESOLVE_STATUS.FOUND, customer: exact };
  }

  // 2. Name search. Multiple matches are ambiguous and are returned
  //    verbatim for the caller to ask the user to choose.
  const candidates = await adapter.searchCustomers(query, {
    limit: candidateLimit,
  });

  if (candidates.length === 0) {
    return {
      status: RESOLVE_STATUS.NOT_FOUND,
      message: `No customer found for "${query}". Check the name or ID and try again.`,
    };
  }

  if (candidates.length === 1) {
    return { status: RESOLVE_STATUS.FOUND, customer: candidates[0] };
  }

  return {
    status: RESOLVE_STATUS.AMBIGUOUS,
    query,
    candidates,
    message: `${candidates.length} customers match "${query}". Please choose one.`,
  };
}

function assertAdapter(adapter) {
  if (
    !adapter ||
    typeof adapter.getCustomer !== 'function' ||
    typeof adapter.searchCustomers !== 'function'
  ) {
    throw new TypeError(
      'resolveCustomer requires an adapter with getCustomer() and searchCustomers()',
    );
  }
}

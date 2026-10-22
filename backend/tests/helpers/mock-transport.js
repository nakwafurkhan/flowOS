import { URL } from 'node:url';

/**
 * In-memory transport that mimics the Frappe/ERPNext list endpoint.
 *
 * It parses the query string the adapter produces, applies the filters
 * against synthetic fixtures, and records every request for assertions.
 */
export class MockTransport {
  constructor(dataByDoctype) {
    this.dataByDoctype = dataByDoctype;
    this.requests = [];
    this.failWith = null;
  }

  get(path) {
    this.requests.push(path);
    if (this.failWith) {
      const error = this.failWith;
      this.failWith = null;
      throw error;
    }

    const url = new URL(path, 'https://erpnext.test');
    const doctype = decodeURIComponent(url.pathname.replace(/^\/api\/resource\//, ''));
    const filters = JSON.parse(url.searchParams.get('filters') ?? '[]');
    const orFilters = JSON.parse(url.searchParams.get('or_filters') ?? 'null');
    const limit = Number.parseInt(url.searchParams.get('limit_page_length') ?? '20', 10);

    const rows = (this.dataByDoctype[doctype] ?? [])
      .filter((row) => matchesFilters(row, filters) && matchesOrFilters(row, orFilters))
      .slice(0, limit);

    return { data: rows };
  }
}

function matchesFilters(row, filters) {
  return filters.every(([field, operator, value]) => {
    if (operator === '=') return row[field] === value;
    if (operator === 'like') return likeMatch(row[field], value);
    return false;
  });
}

function matchesOrFilters(row, orFilters) {
  if (!orFilters || orFilters.length === 0) return true;
  return orFilters.some(([field, operator, value]) => {
    if (operator === '=') return row[field] === value;
    if (operator === 'like') return likeMatch(row[field], value);
    return false;
  });
}

function likeMatch(actual, pattern) {
  if (actual == null) return false;
  const needle = String(pattern).replace(/^%|%$/g, '').toLowerCase();
  return String(actual).toLowerCase().includes(needle);
}

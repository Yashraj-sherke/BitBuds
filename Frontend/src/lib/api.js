export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').trim();
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

let accessToken = null;
let refreshInFlight = null;

export const getApiBaseUrl = () => API_BASE_URL;
export const getAccessToken = () => accessToken;
export const setAccessToken = (nextToken) => {
  accessToken = nextToken;
};
export const clearAccessToken = () => {
  accessToken = null;
};

const buildUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const readJson = async (response) => {
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  return JSON.parse(text);
};

const parseErrorMessage = (payload, fallback) => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = payload.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
};

const refreshAccessToken = async () => {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(buildUrl('/auth/refresh'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorPayload = await readJson(response).catch(() => null);
        throw new ApiError(
          response.status,
          parseErrorMessage(errorPayload, 'Unable to refresh session'),
          errorPayload,
        );
      }

      const payload = await readJson(response);
      const nextToken = payload?.data?.tokens?.accessToken ?? null;
      setAccessToken(nextToken);
      return nextToken;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
};

export const request = async (path, options = {}) => {
  const { body, retryOn401 = true, headers, ...requestInit } = options;
  const nextHeaders = new Headers(headers);

  if (accessToken) {
    nextHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const hasBody = body !== undefined;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (hasBody && !isFormData && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    ...requestInit,
    headers: nextHeaders,
    credentials: 'include',
    body: hasBody
      ? isFormData || typeof body === 'string'
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  if (response.status === 401 && retryOn401 && path !== '/auth/refresh') {
    const refreshed = await refreshAccessToken().catch(() => null);
    if (refreshed) {
      return request(path, { ...options, retryOn401: false });
    }
  }

  if (!response.ok) {
    const errorPayload = await readJson(response).catch(() => null);
    throw new ApiError(
      response.status,
      parseErrorMessage(errorPayload, response.statusText || 'Request failed'),
      errorPayload,
    );
  }

  const payload = await readJson(response);
  return payload.data;
};

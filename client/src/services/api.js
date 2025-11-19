const API_BASE = '';

const buildUrl = (path) => {
  if (!path) return API_BASE || '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

const isFormData = (payload) => typeof FormData !== 'undefined' && payload instanceof FormData;

export async function request(path, options = {}) {
  const { method = 'GET', body, token, headers = {}, ...rest } = options;
  const resolvedHeaders = {
    Accept: 'application/json',
    ...(!isFormData(body) && body ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  if (token) {
    resolvedHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    body: body && !isFormData(body) ? JSON.stringify(body) : body,
    headers: resolvedHeaders,
    ...rest,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      data = text;
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  me: (token) => request('/api/me', { token }),
  login: (credentials) => request('/api/login', { method: 'POST', body: credentials }),
  signup: (payload) => request('/api/signup', { method: 'POST', body: payload }),
  updateProfile: (userId, payload, token) =>
    request(`/api/users/${userId}`, { method: 'PUT', body: payload, token }),
};

export const booksApi = {
  list: () => request('/api/books'),
  create: (payload, token) => request('/api/books', { method: 'POST', body: payload, token }),
  update: (bookId, payload, token) =>
    request(`/api/books/${bookId}`, { method: 'PUT', body: payload, token }),
  remove: (bookId, token) =>
    request(`/api/books/${bookId}`, { method: 'DELETE', token }),
};

export const favoritesApi = {
  list: (token) => request('/api/users/favorites', { token }),
  toggle: (bookId, token) =>
    request('/api/users/favorite', {
      method: 'POST',
      body: { bookId },
      token,
    }),
};

export const exchangesApi = {
  list: (token) => request('/api/exchanges', { token }),
  create: (payload, token) =>
    request('/api/exchanges', { method: 'POST', body: payload, token }),
  accept: (exchangeId, token) =>
    request(`/api/exchanges/${exchangeId}/accept`, { method: 'PUT', token }),
  decline: (exchangeId, token) =>
    request(`/api/exchanges/${exchangeId}/decline`, { method: 'PUT', token }),
};

export const conversationsApi = {
  list: (token) => request('/api/conversations', { token }),
  create: (payload, token) =>
    request('/api/conversations', { method: 'POST', body: payload, token }),
  messages: (conversationId, token) =>
    request(`/api/conversations/${conversationId}/messages`, { token }),
  sendMessage: (conversationId, payload, token) =>
    request(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: payload,
      token,
    }),
  markRead: (conversationId, token) =>
    request(`/api/conversations/${conversationId}/read`, { method: 'PUT', token }),
};

export const aiApi = {
  ask: (question, token) =>
    request('/api/ai-help', {
      method: 'POST',
      body: { question },
      token,
    }),
};


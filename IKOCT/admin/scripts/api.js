// Shared fetch wrapper for every admin page. Centralizes the API base URL,
// attaches the JWT, and normalizes error handling so pages don't repeat it.
const IkoctAPI = (() => {
  // Change this if the backend is deployed somewhere other than localhost.
  const BASE_URL = window.IKOCT_API_BASE_URL || 'http://localhost:4000/api';

  function getToken() {
    return localStorage.getItem('ikoct_admin_token');
  }

  function setToken(token) {
    localStorage.setItem('ikoct_admin_token', token);
  }

  function clearToken() {
    localStorage.removeItem('ikoct_admin_token');
    localStorage.removeItem('ikoct_admin_profile');
  }

  async function request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      clearToken();
      if (!location.pathname.endsWith('login.html')) {
        location.href = 'login.html';
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
  }

  return {
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
    me: () => request('/auth/me'),
    changePassword: (currentPassword, newPassword) =>
      request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),

    list: (resource) => request(`/${resource}/admin/all`),
    get: (resource, id) => request(`/${resource}/${id}`),
    create: (resource, payload) => request(`/${resource}`, { method: 'POST', body: payload }),
    update: (resource, id, payload) => request(`/${resource}/${id}`, { method: 'PUT', body: payload }),
    remove: (resource, id) => request(`/${resource}/${id}`, { method: 'DELETE' }),

    contactMessages: () => request('/contact'),
    markMessageRead: (id) => request(`/contact/${id}/read`, { method: 'PATCH' }),
    deleteMessage: (id) => request(`/contact/${id}`, { method: 'DELETE' }),

    uploadImage: async (file) => {
      const token = getToken();
      const form = new FormData();
      form.append('image', file);
      const res = await fetch(`${BASE_URL}/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed.');
      return data;
    },

    getToken,
    setToken,
    clearToken,
  };
})();

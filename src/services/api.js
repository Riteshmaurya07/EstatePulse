const API_BASE_URL = 'http://localhost:5000/api';

// Helper for Token
export function getToken() {
  return localStorage.getItem('estatepulse_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('estatepulse_token', token);
  } else {
    localStorage.removeItem('estatepulse_token');
  }
}

export function getCurrentUserFromStorage() {
  const userJson = localStorage.getItem('estatepulse_user');
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUserInStorage(user) {
  if (user) {
    localStorage.setItem('estatepulse_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('estatepulse_user');
  }
}

// Unified API fetcher
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An unexpected API error occurred.');
  }

  return data;
}

export const api = {
  // Auth
  register: async (userData) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  verifyOtp: async (email, otp) => {
    const data = await request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
    if (data.token) {
      setToken(data.token);
      setCurrentUserInStorage(data.user);
    }
    return data;
  },

  resendOtp: async (email) => {
    return await request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  login: async (credentials) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (data.token) {
      setToken(data.token);
      setCurrentUserInStorage(data.user);
    }
    return data;
  },

  // Secret Admin Portal Direct Login
  adminLogin: async (credentials) => {
    const data = await request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (data.token) {
      setToken(data.token);
      setCurrentUserInStorage(data.user);
    }
    return data;
  },

  logout: () => {
    setToken(null);
    setCurrentUserInStorage(null);
  },

  getMe: async () => {
    const data = await request('/auth/me');
    if (data.user) {
      setCurrentUserInStorage(data.user);
    }
    return data.user;
  },

  // Projects
  getProjects: async () => {
    return await request('/projects');
  },

  // B2B Developer API Keys
  getApiKeys: async () => {
    return await request('/developer/api-keys');
  },

  createApiKey: async (name, scopes) => {
    return await request('/developer/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name, scopes })
    });
  },

  revokeApiKey: async (keyId) => {
    return await request(`/developer/api-keys/${keyId}`, {
      method: 'DELETE'
    });
  },

  // Access Requests
  submitAccessRequest: async (requestData) => {
    return await request('/requests/access', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  getMyRequest: async () => {
    return await request('/requests/my');
  },

  // Admin APIs
  getAdminDashboard: async () => {
    return await request('/admin/dashboard');
  },

  getAdminUsers: async () => {
    return await request('/admin/users');
  },

  updateUserRoleStatus: async (userId, updateData) => {
    return await request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  getAdminRequests: async () => {
    return await request('/admin/requests');
  },

  updateAccessRequest: async (requestId, status) => {
    return await request(`/admin/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  getSampleToggles: async () => {
    return await request('/admin/sample-toggles');
  },

  toggleSampleContactDetails: async (projectId, showContactDetails) => {
    return await request(`/admin/sample-toggles/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify({ showContactDetails })
    });
  }
};

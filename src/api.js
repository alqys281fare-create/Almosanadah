
const API_BASE_URL = 'https://site-content-api.mohamedmasterdegree.workers.dev';

const AUTH_KEY = 'almosanadah:auth';

const apiUrl = (path) => `${API_BASE_URL}${path}`;

export const getAuth = () => {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_KEY) || 'null');
  } catch {
    return null;
  }
};

export const setAuth = (auth) => {
  try {
    if (auth) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  } catch {
    // Ignore session storage errors
  }
};

const notify = (ok, error = null) => {
  window.dispatchEvent(
    new CustomEvent('almosanadah:sync', {
      detail: { ok, error },
    })
  );
};

// =====================================
// 1. GET SITE CONTENT
// =====================================

export async function fetchSite() {
  try {
    const response = await fetch(apiUrl('/api/site'), {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) return null;

    return await response.json();
  } catch {
    return null;
  }
}

// =====================================
// 2. ADMIN LOGIN
// =====================================

export async function serverLogin(username, password) {
  try {
    const response = await fetch(apiUrl('/api/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok || !data.token) {
      return { ok: false, token: null };
    }

    return {
      ok: true,
      token: data.token,
    };
  } catch {
    return null;
  }
}

// =====================================
// 3. SAVE SITE CONTENT
// =====================================

export async function saveSite(partial) {
  const auth = getAuth();

  if (!auth?.token) {
    notify(false, 'auth');
    return false;
  }

  try {
    const response = await fetch(apiUrl('/api/site'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(partial),
    });

    if (response.status === 401) {
      notify(false, 'auth');
      return false;
    }

    if (!response.ok) {
      notify(false, 'server');
      return false;
    }

    notify(true);
    return true;
  } catch {
    notify(false, 'offline');
    return false;
  }
}

// =====================================
// 4. ADMIN LOGOUT
// =====================================

export async function serverLogout() {
  const auth = getAuth();

  try {
    if (auth?.token) {
      await fetch(apiUrl('/api/logout'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
    }
  } catch {
    // Clear local session even if server is unavailable
  }

  setAuth(null);
}

// =====================================
// 5. UPDATE ADMIN CREDENTIALS
// =====================================

// Cloudflare Worker does not currently support /api/credentials.
// Credential updates are disabled until a backend route is added.

export async function saveCredentials() {
  notify(false, 'unsupported');
  return false;
}

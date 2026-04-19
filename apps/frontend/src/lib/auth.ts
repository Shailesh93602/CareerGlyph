export interface StoredUser {
  id: string;
  username: string;
  name: string;
  email: string;
}

export function saveAuth(token: string, user: StoredUser) {
  localStorage.setItem('cg_token', token);
  localStorage.setItem('cg_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('cg_token');
  localStorage.removeItem('cg_user');
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cg_token');
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('cg_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

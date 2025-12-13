



export function isLoggedIn() {
  // Misal cek token di localStorage atau cookie
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token;
}

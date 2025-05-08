const KEY = 'auth-user';

export const storeUser = (user: any, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  const user = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
  return user ? JSON.parse(user) : null;
};

export const clearStoredUser = () => {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
};

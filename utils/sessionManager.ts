/**
 * Session Manager - Handles user-specific data isolation
 * Ensures each user has isolated localStorage namespace
 */

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createUserNamespace = (userId: string, key: string): string => {
  return `qk_user_${userId}_${key}`;
};

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('qk_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('qk_session_id', sessionId);
  }
  return sessionId;
};

export const clearSessionId = (): void => {
  sessionStorage.removeItem('qk_session_id');
};

/**
 * Get all keys for a specific user from localStorage
 */
export const getUserKeys = (userId: string): string[] => {
  const keys: string[] = [];
  const prefix = `qk_user_${userId}_`;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Clear all user-specific data from localStorage
 */
export const clearUserData = (userId: string): void => {
  const keys = getUserKeys(userId);
  keys.forEach((key) => {
    localStorage.removeItem(key);
  });
};

/**
 * Get user-scoped localStorage value
 */
export const getUserStorage = (userId: string, key: string): string | null => {
  return localStorage.getItem(createUserNamespace(userId, key));
};

/**
 * Set user-scoped localStorage value
 */
export const setUserStorage = (userId: string, key: string, value: string): void => {
  localStorage.setItem(createUserNamespace(userId, key), value);
};

/**
 * Remove user-scoped localStorage value
 */
export const removeUserStorage = (userId: string, key: string): void => {
  localStorage.removeItem(createUserNamespace(userId, key));
};

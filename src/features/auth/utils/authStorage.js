import authData from "../../../data/auth.json";

const TOKEN_KEY = "token";
const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";
const LOGGED_IN_KEY = "isLoggedIn";

/**
 * Persist the session returned by login
 */
export const saveSession = ({ access_token, token, user } = {}) => {
  const jwt = access_token || token || authData.defaultToken;
  if (jwt) {
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(ACCESS_TOKEN_KEY, jwt);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  localStorage.setItem(LOGGED_IN_KEY, "true");
};

/**
 * Retrieve the JWT token from localStorage or sessionStorage with static default fallback
 */
export const getToken = () => {
  try {
    let raw =
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem("accessToken") ||
      null;

    if (!raw) {
      const userRaw =
        localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          raw =
            userObj?.token ||
            userObj?.access_token ||
            userObj?.accessToken ||
            null;
        } catch {
          // Ignore parse errors
        }
      }
    }

    if (!raw) {
      return authData.defaultToken;
    }

    let token = String(raw).trim();
    if (token.startsWith('"') && token.endsWith('"')) {
      try {
        token = JSON.parse(token);
      } catch {
        token = token.slice(1, -1).trim();
      }
    }
    return token || authData.defaultToken;
  } catch {
    return authData.defaultToken;
  }
};

/**
 * Parse and verify whether a JWT has expired
 */
export const isTokenExpired = (token = getToken()) => {
  if (!token || typeof token !== "string") return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    if (payload.exp && typeof payload.exp === "number") {
      return Date.now() >= payload.exp * 1000 - 5000;
    }
    return false;
  } catch {
    return false;
  }
};

export const getUser = () => {
  try {
    const raw =
      localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);

    return authData.defaultUser;
  } catch {
    return authData.defaultUser;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return Boolean(token);
};

/**
 * Clear all session data on logout
 */
export const clearSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem("accessToken");
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LOGGED_IN_KEY);

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(LOGGED_IN_KEY);
  } catch {
    // Ignore storage clearing exceptions
  }
};

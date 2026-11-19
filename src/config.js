const rawBasePath = import.meta.env.VITE_BASE_PATH || "";

const toBasePath = (url) => {
  if (!url || url === "/") return "";
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "");
    return pathname === "/api" ? "" : pathname;
  } catch {
    const cleaned = String(url).replace(/\/+$/, "");
    return cleaned === "/api" ? "" : cleaned;
  }
};

export const BASE_URL = toBasePath(rawBasePath);

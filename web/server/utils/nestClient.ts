import type { H3Event } from "h3";
import type { IBaseApiResponse } from "~~/types/api";
import type { IAuthRefresh } from "~~/types/data";
import { ENDPOINTS, STORAGE_KEYS } from "~~/utils/constant";

const COOKIE_BASE = { httpOnly: true, sameSite: "lax" as const, path: "/" };

async function refreshAccessToken(event: H3Event) {
  const {
    private: { apiBase },
  } = useRuntimeConfig();
  const refresh = getCookie(event, STORAGE_KEYS.REFRESH_TOKEN);
  if (!refresh)
    throw createError({ statusCode: 401, statusMessage: "No refresh token" });

  const res = await $fetch<IBaseApiResponse<IAuthRefresh>>(
    ENDPOINTS.AUTH.PRIVATE.REFRESH,
    { baseURL: apiBase, method: "POST", body: { refresh_token: refresh } },
  );

  setCookie(event, STORAGE_KEYS.ACCESS_TOKEN, res.data.access_token, {
    ...COOKIE_BASE,
    secure: true,
    maxAge: 60 * 15,
  });
  if (res.data.refresh_token) {
    setCookie(event, STORAGE_KEYS.REFRESH_TOKEN, res.data.refresh_token, {
      ...COOKIE_BASE,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return res.data.access_token;
}

async function getCsrfToken() {
  const {
    private: { apiBase },
  } = useRuntimeConfig();
  const csrf = await $fetch<IBaseApiResponse<string>>(
    ENDPOINTS.AUTH.PRIVATE.CSRF,
    { baseURL: apiBase, method: "GET" },
  );
  return csrf.data;
}

type Init = {
  method?: string;
  body?: any;
  query?: Record<string, any>;
  headers?: Record<string, string>;
};

export async function callNestWithBearer<T = unknown>(
  event: H3Event,
  path: string,
  init: Init = {},
): Promise<T> {
  const {
    private: { apiBase },
  } = useRuntimeConfig();
  let access = getCookie(event, STORAGE_KEYS.ACCESS_TOKEN);

  const attempt = (token: string, csrfOverride?: string) => {
    const csrf = csrfOverride ?? getCookie(event, STORAGE_KEYS.CSRF_TOKEN);
    const baseHeaders = init.headers || {};
    const headers: Record<string, string> = {
      ...baseHeaders,
      Authorization: `Bearer ${token}`,
      ...(baseHeaders["x-csrf-token"] || baseHeaders["X-CSRF-Token"]
        ? {}
        : csrf
          ? { "x-csrf-token": csrf }
          : {}),
    };

    const cookieFromInit = baseHeaders["cookie"] || baseHeaders["Cookie"];
    const cookieParts: string[] = [];
    if (cookieFromInit) cookieParts.push(String(cookieFromInit));
    if (csrf && !/\bcsrf_token=/.test(cookieFromInit || ""))
      cookieParts.push(`csrf_token=${csrf}`);
    if (cookieParts.length) headers["cookie"] = cookieParts.join("; ");

    const opts: any = { ...init, baseURL: apiBase, headers };
    return $fetch<T>(path, opts);
  };

  try {
    if (!access && getCookie(event, STORAGE_KEYS.REFRESH_TOKEN)) {
      access = await refreshAccessToken(event);
    }
    if (!access)
      throw createError({ statusCode: 401, statusMessage: "No access token" });
    return await attempt(access);
  } catch (err: any) {
    const status = err?.status ?? err?.statusCode;
    if (status === 401 && getCookie(event, STORAGE_KEYS.REFRESH_TOKEN)) {
      const newAccess = await refreshAccessToken(event);
      return await attempt(newAccess);
    }
    if (status === 403) {
      const newCsrf = await getCsrfToken();
      setCookie(event, STORAGE_KEYS.CSRF_TOKEN, newCsrf, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
      });
      const currentAccess = getCookie(event, STORAGE_KEYS.ACCESS_TOKEN);
      if (currentAccess) return await attempt(currentAccess, newCsrf);
      throw err;
    }
    throw err;
  }
}

export function clearAuthCookies(event: H3Event) {
  setCookie(event, STORAGE_KEYS.ACCESS_TOKEN, "", { path: "/", maxAge: 0 });
  setCookie(event, STORAGE_KEYS.REFRESH_TOKEN, "", { path: "/", maxAge: 0 });
  setCookie(event, STORAGE_KEYS.CSRF_TOKEN, "", { path: "/", maxAge: 0 });
}

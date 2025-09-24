import { ENDPOINTS, STORAGE_KEYS } from "~~/utils/constant";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const refresh = getCookie(event, STORAGE_KEYS.REFRESH_TOKEN);
  if (!refresh) throw createError({ statusCode: 401 });

  const res = await $fetch<{ access_token: string; refresh_token?: string }>(
    ENDPOINTS.AUTH.PRIVATE.REFRESH,
    {
      baseURL: config.private.apiBase,
      method: "POST",
      body: { refresh_token: refresh },
    },
  );

  setCookie(event, STORAGE_KEYS.ACCESS_TOKEN, res.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  if (res.refresh_token) {
    setCookie(event, STORAGE_KEYS.REFRESH_TOKEN, res.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return { ok: true };
});

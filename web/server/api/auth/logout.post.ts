import { STORAGE_KEYS } from "~~/utils/constant";

export default defineEventHandler((event) => {
  setCookie(event, STORAGE_KEYS.ACCESS_TOKEN, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  setCookie(event, STORAGE_KEYS.REFRESH_TOKEN, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return { ok: true };
});

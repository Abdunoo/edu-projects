import { callNestWithBearer } from "~~/server/utils/nestClient";
import { STORAGE_KEYS } from "~~/utils/constant";

export default defineEventHandler(async (event) => {
  // get user data from cookie
  try {
    const user = getCookie(event, STORAGE_KEYS.USER);
    if (!user)
      return { ok: true, data: await callNestWithBearer(event, "/auth/me") };
    return { ok: true, data: JSON.parse(user) };
  } catch {
    return { ok: false };
  }
});

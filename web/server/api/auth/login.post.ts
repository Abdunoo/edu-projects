import { ENDPOINTS, STORAGE_KEYS } from '~~/utils/constant'
import type { IAuthLogin, IAuthLoginRequest } from '~~/types/data';
import type { IBaseApiResponse } from '~~/types/api';

export default defineEventHandler(async (event) => {
    const body = await readBody<IAuthLoginRequest>(event)
    const { private: { apiBase } } = useRuntimeConfig()
  
    const { data } = await $fetch<IBaseApiResponse<IAuthLogin>>(
      ENDPOINTS.AUTH.PRIVATE.LOGIN,
      { baseURL: apiBase, method: 'POST', body }
    )

    setCookie(event, STORAGE_KEYS.ACCESS_TOKEN, data.access_token, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 15,
    })
    setCookie(event, STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    })
    setCookie(event, STORAGE_KEYS.USER, JSON.stringify(data.user), {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    })
  
    return { ok: true }
  })
  
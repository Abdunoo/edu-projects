import type { H3Event } from 'h3'
import { callNestWithBearer } from '~~/server/utils/nestClient'

export default defineEventHandler(async (event: H3Event) => {
  const raw = event.context.params?.path as string | string[] | undefined
  const segments = Array.isArray(raw) ? raw : (raw ? [raw] : [])
  const path = '/' + segments.join('/')

  const method = getMethod(event)
  const query = getQuery(event)

  const reqHeaders = getRequestHeaders(event)
  const headers: Record<string, string> = {}
  if (reqHeaders['content-type']) headers['content-type'] = String(reqHeaders['content-type'])

  const init: any = { method, headers }

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = await readBody(event)
  }

  const qs = new URLSearchParams(query as Record<string, any>).toString()
  const target = qs ? `${path}?${qs}` : path

  try {
    return await callNestWithBearer(event, target, init)
  } catch (e: any) {
    throw createError({
      statusCode: e?.status ?? e?.statusCode ?? 500,
      statusMessage: e?.statusText ?? e?.message ?? 'Proxy error',
      data: e?.data ?? e,
    })
  }
})

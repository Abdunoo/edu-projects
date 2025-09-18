import { callNestWithBearer } from "~~/server/utils/nestClient"

export default defineEventHandler(async (event) => {
    return callNestWithBearer(event, '/auth/me')
  })
import { clearEmailConfigCache } from '~/server/utils/email'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async () => {
  clearEmailConfigCache()
  return successResponse(null, '缓存已清除')
})

import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const filename = event.context.params?.filename
  
  if (!filename) {
    throw createError({
      statusCode: 400,
      statusMessage: '文件名缺失'
    })
  }
  
  const filePath = join(process.cwd(), 'public', 'uploads', filename)
  
  if (!existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: '文件不存在'
    })
  }
  
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const contentTypeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml'
  }
  
  setHeader(event, 'Content-Type', contentTypeMap[ext] || 'application/octet-stream')
  
  return sendStream(event, createReadStream(filePath))
})
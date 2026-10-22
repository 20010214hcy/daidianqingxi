import { join } from 'path'
import { randomUUID } from 'crypto'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import sharp from 'sharp'
import { errorResponse, successResponse } from '~/server/utils/response'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)

    if (!form || form.length === 0) {
      return errorResponse('没有文件上传', 400, event)
    }

    const filePart = form.find(p => p.filename && p.data)
    if (!filePart || !filePart.data || !filePart.filename) {
      return errorResponse('没有找到文件数据', 400, event)
    }

    if (filePart.data.length > MAX_FILE_SIZE) {
      return errorResponse('文件大小不能超过10MB', 413, event)
    }

    const ext = filePart.filename.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return errorResponse('只支持图片格式: jpg, jpeg, png, gif, webp', 400, event)
    }

    const buffer = typeof filePart.data === 'string'
      ? Buffer.from(filePart.data, 'base64')
      : Buffer.from(filePart.data)

    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true })
    }

    // GIF 保留原格式（可能含动画），其余转 WebP
    // 原样写盘前必须验证是真正的 GIF（否则可上传 HTML/JS 冒充图片当图床）
    if (ext === 'gif') {
      const magic = buffer.subarray(0, 6).toString('ascii')
      const meta = await sharp(buffer, { animated: true }).metadata().catch(() => null)
      if (!/^GIF8[79]a$/.test(magic) || !meta || meta.format !== 'gif') {
        return errorResponse('文件内容不是有效的图片', 400, event)
      }
      const name = `${randomUUID()}.gif`
      const filePath = join(UPLOAD_DIR, name)
      writeFileSync(filePath, buffer)
      return successResponse({ url: `/uploads/${name}`, fileName: name })
    }

    const fileName = `${randomUUID()}.webp`
    const filePath = join(UPLOAD_DIR, fileName)

    await sharp(buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath)

    return successResponse({ url: `/uploads/${fileName}`, fileName })
  } catch (error) {
    return errorResponse('上传失败', 500, event)
  }
})

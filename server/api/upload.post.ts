import { join } from 'path'
import { randomUUID } from 'crypto'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import sharp from 'sharp'
import { errorResponse, successResponse } from '~/server/utils/response'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico']

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)

    if (!form || form.length === 0) {
      return errorResponse('没有文件上传')
    }

    const filePart = form.find(p => p.filename && p.data)
    if (!filePart || !filePart.data || !filePart.filename) {
      return errorResponse('没有找到文件数据')
    }

    if (filePart.data.length > MAX_FILE_SIZE) {
      return errorResponse('文件大小不能超过10MB')
    }

    let ext = filePart.filename.split('.').pop()?.toLowerCase() || ''

    // 如果没有扩展名，根据 MIME 类型推断
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      const mimeType = filePart.type || ''
      if (mimeType.includes('png')) ext = 'png'
      else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg'
      else if (mimeType.includes('webp')) ext = 'webp'
      else if (mimeType.includes('gif')) ext = 'gif'
      else if (mimeType.includes('svg')) ext = 'svg'
      else if (mimeType.includes('bmp')) ext = 'png'  // bmp 转 png
      else ext = 'png'  // 默认当作 png
    }

    const buffer = typeof filePart.data === 'string'
      ? Buffer.from(filePart.data, 'base64')
      : Buffer.from(filePart.data)

    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true })
    }

    // SVG, GIF, ICO 直接保存原格式
    if (ext === 'svg' || ext === 'gif' || ext === 'ico') {
      const name = `${randomUUID()}.${ext}`
      const filePath = join(UPLOAD_DIR, name)
      writeFileSync(filePath, buffer)
      return successResponse({ url: `/uploads/${name}`, fileName: name })
    }

    // PNG 保留原格式
    if (ext === 'png') {
      const name = `${randomUUID()}.png`
      const filePath = join(UPLOAD_DIR, name)
      await sharp(buffer)
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .png({ quality: 80 })
        .toFile(filePath)
      return successResponse({ url: `/uploads/${name}`, fileName: name })
    }

    // JPG/JPEG/WEBP 转 webp 压缩
    const fileName = `${randomUUID()}.webp`
    const filePath = join(UPLOAD_DIR, fileName)

    await sharp(buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath)

    return successResponse({ url: `/uploads/${fileName}`, fileName })
  } catch (error: any) {
    console.error('上传失败详情:', error?.message || error)
    return errorResponse(`上传失败: ${error?.message || '未知错误'}`)
  }
})

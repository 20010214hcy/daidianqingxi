import { join, resolve } from 'path'
import { existsSync, unlinkSync } from 'fs'

const UPLOAD_DIR = resolve(process.cwd(), 'public', 'uploads')

/**
 * 删除上传的图片文件
 * @param url 图片 URL（如 /uploads/xxx.webp）
 */
export function deleteImageFile(url: string | null | undefined): void {
  if (!url) return

  try {
    let fileName = url
    if (fileName.startsWith('/uploads/')) {
      fileName = fileName.substring('/uploads/'.length)
    }
    if (fileName.includes('?')) {
      fileName = fileName.split('?')[0]
    }

    // 防止路径穿越
    if (fileName.includes('..') || fileName.includes('\0')) {
      return
    }

    const filePath = resolve(UPLOAD_DIR, fileName)
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return
    }

    if (existsSync(filePath)) {
      unlinkSync(filePath)
    }
  } catch {
    // ignore delete errors
  }
}

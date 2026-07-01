import { join, resolve } from 'path'
import { existsSync, unlinkSync } from 'fs'
import { errorResponse, successResponse } from '~/server/utils/response'

const UPLOAD_DIR = resolve(process.cwd(), 'public', 'uploads')

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { url } = body

    if (!url) {
      return errorResponse('请提供要删除的图片URL')
    }

    // 从 URL 中提取文件名
    let fileName = url
    if (fileName.startsWith('/uploads/')) {
      fileName = fileName.substring('/uploads/'.length)
    }
    if (fileName.includes('?')) {
      fileName = fileName.split('?')[0]
    }

    // 防止路径穿越：拒绝包含 .. 的路径
    if (fileName.includes('..') || fileName.includes('\0')) {
      return errorResponse('非法文件路径', 400)
    }

    const filePath = resolve(UPLOAD_DIR, fileName)

    // 二次验证：解析后的路径必须在 UPLOAD_DIR 内
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return errorResponse('非法文件路径', 400)
    }

    if (existsSync(filePath)) {
      unlinkSync(filePath)
      return successResponse(null, '图片删除成功')
    } else {
      return successResponse(null, '图片不存在')
    }
  } catch (error) {
    console.error('删除图片失败:', error)
    return errorResponse('删除图片失败')
  }
})

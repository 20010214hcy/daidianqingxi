import { prisma } from '~/server/utils/db'
import { successResponse, errorResponse } from '~/server/utils/response'
import { filterXss } from '~/server/utils/xss'

function readBodyNative(event) {
  return new Promise((resolve, reject) => {
    const chunks = []
    event.node.req.on('data', (chunk) => {
      chunks.push(chunk)
    })
    event.node.req.on('end', () => {
      const body = Buffer.concat(chunks).toString()
      try {
        resolve(body ? JSON.parse(body) : null)
      } catch (e) {
        resolve(null)
      }
    })
    event.node.req.on('error', reject)
  })
}

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBodyNative(event)
    
    if (!id) {
      return errorResponse('服务ID不能为空', 400)
    }
    
    if (!body) {
      return errorResponse('请求数据为空', 400)
    }
    
    const { 
      title, description, content, coverImage, icon, price,
      videoUrl, detailImage, advantages, features, specs,
      sortOrder, status, businessUnitId 
    } = body
    
    // 处理删除旧图片
    if (body.oldCoverImage && body.oldCoverImage !== coverImage) {
      try {
        const fs = await import('fs/promises')
        const path = await import('path')
        const oldPath = path.join(process.cwd(), 'public', body.oldCoverImage)
        await fs.unlink(oldPath)
      } catch (e) {
        // 图片删除失败不影响主流程
      }
    }
    
    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        content: filterXss(content),
        coverImage,
        icon,
        price,
        videoUrl: videoUrl || null,
        detailImage: detailImage || null,
        advantages: advantages ? JSON.parse(advantages) : null,
        features: features ? JSON.parse(features) : null,
        specs: specs ? JSON.parse(specs) : null,
        sortOrder: sortOrder || 0,
        status,
        businessUnitId: businessUnitId ? Number(businessUnitId) : null,
        updatedAt: new Date(),
      },
    })
    
    return successResponse(service, '服务更新成功')
  } catch (error) {
    console.error('更新服务失败:', error)
    return errorResponse('更新服务失败')
  }
})

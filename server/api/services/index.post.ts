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
    const body = await readBodyNative(event)
    
    if (!body) {
      return errorResponse('请求数据为空', 400)
    }
    
    const { 
      title, description, content, coverImage, icon, price, 
      videoUrl, detailImage, advantages, features, specs,
      sortOrder, status, authorId, businessUnitId 
    } = body
    
    if (!title || !content || !authorId) {
      return errorResponse('标题、内容和作者ID不能为空', 400)
    }
    
    const service = await prisma.service.create({
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
        status: status || 'published',
        authorId: Number(authorId),
        businessUnitId: businessUnitId ? Number(businessUnitId) : null,
        updatedAt: new Date(),
      },
    })
    
    return successResponse(service, '服务创建成功')
  } catch (error) {
    console.error('创建服务失败:', error)
    return errorResponse('创建服务失败')
  }
})

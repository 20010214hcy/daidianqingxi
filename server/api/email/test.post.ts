import { sendEmail, testEmailConfig } from '~/server/utils/email'
import { successResponse, errorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { to } = body

    if (!to) {
      return errorResponse('请输入测试邮箱地址')
    }

    // 先测试配置
    const configTest = await testEmailConfig()
    if (!configTest.success) {
      return errorResponse(configTest.message)
    }

    // 发送测试邮件
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Microsoft YaHei', Arial, sans-serif; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 30px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">邮件配置测试</h1>
    </div>
    <div style="padding: 30px;">
      <p style="color: #333; font-size: 16px;">恭喜！您的邮件配置已成功。</p>
      <p style="color: #666; font-size: 14px; line-height: 1.8;">
        这是一封测试邮件，说明您的SMTP配置正确，可以正常使用邮件回复功能。
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #94a3b8; font-size: 12px;">
        发送时间：${new Date().toLocaleString('zh-CN')}
      </p>
    </div>
  </div>
</body>
</html>
    `.trim()

    const sent = await sendEmail(to, '玺铭电力 - 邮件配置测试', html)

    if (sent) {
      return successResponse(null, '测试邮件发送成功')
    } else {
      return errorResponse('邮件发送失败，请检查配置')
    }
  } catch (error: any) {
    console.error('测试邮件发送失败:', error)
    return errorResponse(error.message || '发送失败')
  }
})

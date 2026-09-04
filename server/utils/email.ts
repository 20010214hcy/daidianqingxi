import nodemailer from 'nodemailer'
import { prisma } from './db'
import { decrypt } from './crypto'

// 邮件配置缓存
let cachedConfig: any = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// 获取邮件配置
async function getEmailConfig() {
  const now = Date.now()
  if (cachedConfig && now - cacheTime < CACHE_DURATION) {
    return cachedConfig
  }

  try {
    const setting = await prisma.sitesetting.findFirst()
    if (!setting || !setting.enableEmailReply || !setting.smtpHost) {
      return null
    }

    cachedConfig = {
      host: setting.smtpHost,
      port: setting.smtpPort || 465,
      secure: setting.smtpPort === 465, // 465端口使用SSL
      auth: {
        user: setting.smtpUser,
        pass: decrypt(setting.smtpPass || '') // 解密密码
      },
      from: setting.smtpFrom || setting.smtpUser
    }
    cacheTime = now
    return cachedConfig
  } catch (error) {
    console.error('获取邮件配置失败:', error)
    return null
  }
}

// 清除配置缓存（配置更新时调用）
export function clearEmailConfigCache() {
  cachedConfig = null
  cacheTime = 0
}

// 发送邮件
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const config = await getEmailConfig()
  if (!config) {
    console.log('邮件功能未配置或未启用')
    return false
  }

  try {
    const transporter = nodemailer.createTransport(config)

    await transporter.sendMail({
      from: `"玺铭电力科技" <${config.from}>`,
      to,
      subject,
      html
    })

    console.log('邮件发送成功:', to)
    return true
  } catch (error) {
    console.error('邮件发送失败:', error)
    return false
  }
}

// 生成回复邮件HTML
export function generateReplyEmailHtml(data: {
  name: string
  originalMessage: string
  replyContent: string
  companyName?: string
  phone?: string
  website?: string
}): string {
  const {
    name,
    originalMessage,
    replyContent,
    companyName = '河南玺铭电力科技有限公司',
    phone = '400-888-8888',
    website = 'https://ximingpower.com'
  } = data

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Microsoft YaHei', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- 头部 -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">${companyName}</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px;">留言回复</p>
            </td>
          </tr>

          <!-- 内容 -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; margin: 0 0 20px;">
                尊敬的 <strong>${name}</strong>：
              </p>
              <p style="color: #666666; font-size: 15px; line-height: 1.8; margin: 0 0 30px;">
                感谢您的留言！以下是我们的回复：
              </p>

              <!-- 原始留言 -->
              <div style="background-color: #f8fafc; border-left: 4px solid #e2e8f0; padding: 15px 20px; margin: 0 0 20px; border-radius: 0 4px 4px 0;">
                <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px;">您的留言：</p>
                <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">${originalMessage}</p>
              </div>

              <!-- 回复内容 -->
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px 20px; margin: 0 0 30px; border-radius: 0 4px 4px 0;">
                <p style="color: #1e40af; font-size: 13px; margin: 0 0 8px;">我们的回复：</p>
                <p style="color: #1e293b; font-size: 14px; line-height: 1.8; margin: 0;">${replyContent.replace(/\n/g, '<br>')}</p>
              </div>

              <p style="color: #666666; font-size: 14px; line-height: 1.8; margin: 0 0 20px;">
                如有其他问题，请随时联系我们：
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 8px;">
                📞 服务热线：<a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0;">
                🌐 官方网站：<a href="${website}" style="color: #2563eb; text-decoration: none;">${website}</a>
              </p>
            </td>
          </tr>

          <!-- 底部 -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${companyName} 版权所有
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// 测试邮件配置
export async function testEmailConfig(): Promise<{ success: boolean; message: string }> {
  const config = await getEmailConfig()
  if (!config) {
    return { success: false, message: '邮件功能未配置或未启用' }
  }

  try {
    const transporter = nodemailer.createTransport(config)
    await transporter.verify()
    return { success: true, message: '邮件配置测试成功' }
  } catch (error: any) {
    return { success: false, message: `邮件配置测试失败: ${error.message}` }
  }
}

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 32
const TAG_LENGTH = 16

// 从环境变量或 JWT_SECRET 派生加密密钥
function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, 32, { N: 1024, r: 8, p: 1 })
}

function getSecret(): string {
  return process.env.JWT_SECRET || 'fallback-secret-key-change-me'
}

/**
 * 加密文本
 * 格式: salt(32) + iv(16) + tag(16) + encrypted
 */
export function encrypt(text: string): string {
  const secret = getSecret()
  const salt = randomBytes(SALT_LENGTH)
  const key = deriveKey(secret, salt)
  const iv = randomBytes(IV_LENGTH)
  
  const cipher = createCipheriv(ALGORITHM, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const tag = cipher.getAuthTag()
  
  // 组合: salt + iv + tag + encrypted (全部用 hex)
  const result = salt.toString('hex') + iv.toString('hex') + tag.toString('hex') + encrypted
  return 'enc:' + result
}

/**
 * 解密文本
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText || !encryptedText.startsWith('enc:')) {
    // 未加密的旧数据，直接返回
    return encryptedText
  }
  
  const secret = getSecret()
  const data = encryptedText.slice(4) // 去掉 'enc:' 前缀
  
  const salt = Buffer.from(data.slice(0, SALT_LENGTH * 2), 'hex')
  const iv = Buffer.from(data.slice(SALT_LENGTH * 2, (SALT_LENGTH + IV_LENGTH) * 2), 'hex')
  const tag = Buffer.from(data.slice((SALT_LENGTH + IV_LENGTH) * 2, (SALT_LENGTH + IV_LENGTH + TAG_LENGTH) * 2), 'hex')
  const encrypted = data.slice((SALT_LENGTH + IV_LENGTH + TAG_LENGTH) * 2)
  
  const key = deriveKey(secret, salt)
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

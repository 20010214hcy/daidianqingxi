/**
 * 格式化日期
 * @param {string|Date} date - 日期字符串或 Date 对象
 * @param {string} format - 格式化模式，默认 'YYYY-MM-DD HH:mm'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm') {
  if (!date) return '-'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化价格
 * @param {number|string} price - 价格
 * @returns {string} 格式化后的价格字符串
 */
export function formatPrice(price) {
  if (price === null || price === undefined || price === '') return '面议'
  const num = Number(price)
  if (isNaN(num)) return '面议'
  return '¥' + num.toFixed(2)
}

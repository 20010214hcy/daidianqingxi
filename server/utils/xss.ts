import xss from 'xss'

/**
 * XSS 安全过滤工具
 * 用于过滤富文本内容中的恶意脚本
 */

// 自定义白名单配置（允许常用的富文本标签）
const customXssOptions = {
  whiteList: {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    p: ['style', 'class'],
    span: ['style', 'class'],
    br: [],
    hr: [],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'style', 'class'],
    ul: ['style', 'class'],
    ol: ['style', 'class'],
    li: ['style', 'class'],
    div: ['style', 'class'],
    table: ['style', 'class', 'border', 'cellpadding', 'cellspacing'],
    thead: [],
    tbody: [],
    tr: ['style', 'class'],
    th: ['style', 'class', 'colspan', 'rowspan'],
    td: ['style', 'class', 'colspan', 'rowspan'],
    strong: [],
    b: [],
    em: [],
    i: [],
    u: [],
    s: [],
    blockquote: [],
    code: [],
    pre: [],
  },
  css: {
    whiteList: {
      color: true,
      'background-color': true,
      'font-size': true,
      'font-weight': true,
      'text-align': true,
      'padding': true,
      'margin': true,
      'width': true,
      'height': true,
    },
  },
}

/**
 * 过滤富文本内容，防止 XSS 攻击
 * @param html 原始 HTML 内容
 * @returns 安全过滤后的 HTML 内容
 */
export function filterXss(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }
  return xss(html, customXssOptions)
}

/**
 * 过滤纯文本内容，去除所有 HTML 标签
 * 用于姓名、电话、留言等非富文本字段
 * @param text 原始文本
 * @returns 去除 HTML 标签后的纯文本
 */
export function filterText(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }
  return xss(text, { whiteList: {}, stripIgnoreTag: true })
}


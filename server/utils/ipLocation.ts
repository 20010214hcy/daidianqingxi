// IP 归属地查询：基于 ip2region 离线库（中国到城市级，无需外部 API）
// 返回「河南平顶山」样式的短归属地；结果按 IP 做进程内缓存
//
// 两个坑（2026-10-22 实测）：
// 1. 包按 __dirname/../../data 找库文件，Nitro 构建产物里没有该目录 →
//    必须显式传 db 绝对路径（项目根 data/ 下放了一份，见 .gitignore）。
// 2. 该包是 CJS，Nitro 打包后 `import IP2Region from 'ip2region'` 拿到的不一定是
//    构造函数（报 "x is not a constructor"）→ 用 createRequire 运行时加载并逐层解包 default。
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import IP2Region from 'ip2region'

type Searcher = { search?: (ip: string) => Record<string, unknown> | null }

let searcher: Searcher | null = null

/** 把 CJS/ESM 各种导出形态解开，拿到真正的类 */
function resolveCtor(): { new (o?: unknown): Searcher } | null {
  const unwrap = (v: any): any => {
    let cur = v
    for (let i = 0; i < 3 && cur && typeof cur !== 'function'; i += 1) cur = cur.default
    return typeof cur === 'function' ? cur : null
  }
  const fromImport = unwrap(IP2Region)
  if (fromImport) return fromImport
  try {
    const req = createRequire(import.meta.url)
    return unwrap(req('ip2region'))
  } catch {
    return null
  }
}

/** 依序寻找可用 db 文件：环境变量目录 → 项目根 data/ → 包自带 data/ */
function resolveDbPath(name: string): string | null {
  const candidates = [
    process.env.IP2REGION_DB_DIR ? join(process.env.IP2REGION_DB_DIR, name) : '',
    join(process.cwd(), 'data', name),
    join(process.cwd(), 'node_modules', 'ip2region', 'data', name),
  ].filter(Boolean)
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  return null
}

function getSearcher(): Searcher | null {
  if (searcher) return searcher
  try {
    const Ctor = resolveCtor()
    const ipv4db = resolveDbPath('ip2region.db')
    if (!Ctor || !ipv4db) return null
    const opts: Record<string, unknown> = { ipv4db }
    const ipv6db = resolveDbPath('ipv6wry.db')
    if (ipv6db) opts.ipv6db = ipv6db
    else opts.disableIpv6 = true
    searcher = new Ctor(opts)
    return searcher
  } catch (e: any) {
    console.error('[ipLocation] 搜索器初始化失败:', e?.message || e)
    searcher = null
    return null
  }
}

const cache = new Map<string, string>()
// 内网 / 回环地址不查库
const PRIVATE_RE =
  /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.0\.0\.0$|::1|f[cd][0-9a-f]{2}:)/i

const clean = (v: unknown) => (typeof v === 'string' && v && v !== '0' ? v : '')

/** 省/市名去掉行政区划后缀（河南省→河南、平顶山市→平顶山、广西壮族自治区→广西） */
const stripSuffix = (v: string) => v.replace(/省|自治区|壮族|回族|维吾尔|特别行政区/g, '')
const stripCitySuffix = (v: string) => v.replace(/市|地区|自治州|盟/g, '')

/**
 * 解析 IP 归属地
 * 中国 → 省市连写（河南平顶山 / 北京）；海外 → 国家名；内网 → 内网；失败 → 未知
 */
export function ipLocation(ip: string | null | undefined): string {
  if (!ip) return ''
  const hit = cache.get(ip)
  if (hit !== undefined) return hit

  let loc = ''
  try {
    if (PRIVATE_RE.test(ip)) {
      loc = '内网'
    } else {
      const s = getSearcher()
      const r: any = s?.search?.(ip)
      const country = clean(r?.country)
      if (country && country !== '中国') {
        loc = country
      } else if (country) {
        const prov = stripSuffix(clean(r?.province))
        const city = stripCitySuffix(clean(r?.city))
        loc = !city || prov === city ? prov || city : `${prov}${city}`
      }
    }
  } catch {
    loc = ''
  }

  if (!loc) loc = '未知'
  cache.set(ip, loc)
  return loc
}

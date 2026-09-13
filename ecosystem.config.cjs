const fs = require('fs')
const path = require('path')

function loadEnv() {
  const envPath = path.join(__dirname, '.env')
  if (!fs.existsSync(envPath)) {
    console.warn('[ecosystem] .env not found, secrets may be missing')
    return {}
  }
  const env = {}
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const envFile = loadEnv()

module.exports = {
  apps: [{
    name: 'daidianqingxi',
    script: '.output/server/index.mjs',
    instances: 4,
    exec_mode: 'cluster',
    max_memory_restart: '384M',
    env: {
      NODE_ENV: 'production',
      PORT: envFile.PORT || 3000,
      DATABASE_URL: envFile.DATABASE_URL || process.env.DATABASE_URL,
      JWT_SECRET: envFile.JWT_SECRET || process.env.JWT_SECRET,
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/home/ubuntu/.pm2/logs/daidianqingxi-error.log',
    out_file: '/home/ubuntu/.pm2/logs/daidianqingxi-out.log',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    restart_delay: 1000
  }]
}

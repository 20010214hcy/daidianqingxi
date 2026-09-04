module.exports = {
  apps: [{
    name: 'daidianqingxi',
    script: '.output/server/index.mjs',
    instances: 4,
    exec_mode: 'cluster',
    max_memory_restart: '384M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'mysql://root:UTdFst7kLKFfnDwMuWdR@127.0.0.1:3306/daidianqingxi',
      JWT_SECRET: '273c2efd29ed17da77d6d6fbd48979918d5b9298128214303ef198dfc7037b0b'
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

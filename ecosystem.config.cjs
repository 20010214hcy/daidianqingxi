module.exports = {
  apps: [{
    name: 'daidianqingxi',
    port: 3000,
    script: '.output/server/index.mjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'mysql://root:hcy021416@localhost:3306/daidianqingxi?schema=public',
      JWT_SECRET: '273c2efd29ed17da77d6d6fbd48979918d5b9298128214303ef198dfc7037b0b'
    }
  }]
}

const fs = require('fs');
const jwt = require('/var/www/daidianqingxi/node_modules/jsonwebtoken');
const env = fs.readFileSync('/var/www/daidianqingxi/.env', 'utf8');
const secret = env.match(/^JWT_SECRET=(.+)$/m)[1].trim();
const token = jwt.sign({ userId: 1, username: 'admin', role: 'superadmin' }, secret, { expiresIn: '1h' });
console.log(token);

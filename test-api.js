const jwt = require('jsonwebtoken');
const http = require('http');

// 生成一个有效的 token
const userId = '405b6d69-1086-48cd-972e-54a29d5c0bf6';
const JWT_SECRET = 'your-secret-key-change-in-production-123456';
const token = jwt.sign({ userId, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

console.log('Generated token:', token);

// 测试 API 端点
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/user/assessments',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('Response status:', res.statusCode);
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:', JSON.parse(data));
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
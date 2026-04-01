const bcrypt = require('bcryptjs');

const password = '111111';
const hashedPassword = bcrypt.hashSync(password, 10);
console.log('Hashed password for 111111:', hashedPassword);
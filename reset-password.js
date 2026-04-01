const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// 打开数据库连接
const db = new sqlite3.Database('./rating_sys.db');

const email = 'houwei2881@gmail.com';
const newPassword = '111111';
const hashedPassword = bcrypt.hashSync(newPassword, 10);

// 更新密码
db.run(
  'UPDATE users SET password = ? WHERE email = ?',
  [hashedPassword, email],
  function(err) {
    if (err) {
      console.error('Error updating password:', err);
    } else {
      console.log(`Password updated for ${email}`);
      console.log(`Rows affected: ${this.changes}`);
    }
    db.close();
  }
);
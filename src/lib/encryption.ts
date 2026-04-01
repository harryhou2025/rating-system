import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('加密失败');
  }
}

export function decrypt(encryptedText: string): string {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('无效的加密数据格式');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('解密失败');
  }
}

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email;
  }
  
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2 
    ? username.substring(0, 2) + '*'.repeat(username.length - 2)
    : username;
  
  return `${maskedUsername}@${domain}`;
}

export function maskName(name: string): string {
  if (!name || name.length <= 1) {
    return name;
  }
  
  return name.charAt(0) + '*'.repeat(name.length - 1);
}

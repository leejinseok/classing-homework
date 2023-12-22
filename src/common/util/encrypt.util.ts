import { createCipheriv, createDecipheriv } from 'crypto';

export class EncryptUtils {
  private static readonly algorithm = 'aes-256-cbc';
  private static readonly key = Buffer.from(
    'EeNHAzYQiRrWNH1wrqXh8pGl/UoUq57ymwVovG7itJ0=',
    'base64',
  );
  private static readonly iv = Buffer.from(
    '6NGr3uhK/bk5NbNV01aUZw==',
    'base64',
  );

  static async encrypt(text: string) {
    const cipher = createCipheriv(this.algorithm, this.key, this.iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex');
  }

  static async decrypt(encrypted: string) {
    const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}

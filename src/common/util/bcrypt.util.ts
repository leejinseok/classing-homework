import * as bcrypt from 'bcrypt';

export class BcryptUtils {
  private static readonly saltRounds = 10;

  static async hash(password: string): Promise<{ hash: string; salt: string }> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  static async hashWithSalt(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  static async compare(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }

  static async getSalt() {
    return await bcrypt.genSalt();
  }
}

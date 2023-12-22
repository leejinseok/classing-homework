import { BcryptUtils } from './bcrypt.util';

describe('PasswordUtility', () => {
  it('비밀번호 해싱', async () => {
    const password = 'user123';
    const { hash, salt } = await BcryptUtils.hash(password);
    const isMatched = await BcryptUtils.compare(password, hash);
  });
});

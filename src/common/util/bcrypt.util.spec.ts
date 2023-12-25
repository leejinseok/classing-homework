import { API_EXAMPLE } from 'src/api/config/constants';
import { BcryptUtils } from './bcrypt.util';

describe('PasswordUtility', () => {
  it('비밀번호 해싱', async () => {
    const password = API_EXAMPLE.PASSWORD;
    const { hash, salt } = await BcryptUtils.hash(password);
    const isMatched = await BcryptUtils.compare(password, hash);
  });
});

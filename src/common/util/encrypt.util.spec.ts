import { API_EXAMPLE } from '../../api/config/constants';
import { EncryptUtils } from './encrypt.util';

describe('EncryptUtil', () => {
  it('암복호화 테스트', async () => {
    const email = API_EXAMPLE.STUDENT_EMAIL;
    const encrypt = await EncryptUtils.encrypt(email);
    const decrypt = await EncryptUtils.decrypt(encrypt);
    expect(email).toEqual(decrypt);
  });
});

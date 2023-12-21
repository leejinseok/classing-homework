import { EncryptUtils } from './encrypt.util';

describe('EncryptUtil', () => {
  it('암복호화 테스트', async () => {
    const email = 'user123';
    const encrypt = await EncryptUtils.encrypt(email);
    console.log('encrypt', encrypt);
    const decrypt = await EncryptUtils.decrypt(encrypt);
    console.log('decrypt', decrypt);

    expect(email).toEqual(decrypt);
  });
});

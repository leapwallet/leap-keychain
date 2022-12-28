import { decrypt, encrypt } from '../src';

describe('encryption-utils', () => {

  test('encrypt-decrypt', () => {
    const originalMessage = 'Hello World';
    const cipher = encrypt(originalMessage, 'password');
    const plain = decrypt(cipher, 'password');
    expect(plain).toBe(originalMessage);
  })
})
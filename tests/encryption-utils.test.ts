import { decrypt, encrypt } from '../src';

describe('encryption-utils', () => {
  test('encrypt-decrypt-2', () => {
    const originalMessage = 'Hello World';
    const cipher = encrypt(originalMessage, 'password');
    const plain = decrypt(cipher, 'password');
    expect(plain).toBe(originalMessage);
  });

  test('test with non ascii characters', () => {
    const originalMessage = 'Hello World! 🐸';
    const cipher = encrypt(originalMessage, 'password');
    const plain = decrypt(cipher, 'password');
    expect(plain).toBe(originalMessage);
  });
});

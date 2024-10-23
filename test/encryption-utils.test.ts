import { decrypt, encrypt } from '../src';
import expect from 'expect.js';

describe('encryption-utils', () => {
  it('encrypt-decrypt-2', () => {
    const originalMessage = 'Hello World';
    const cipher = encrypt(originalMessage, 'password');
    const plain = decrypt(cipher, 'password');
    expect(plain).be(originalMessage);
  });

  it('test with non ascii characters', () => {
    const originalMessage = 'Hello World! 🐸';
    const cipher = encrypt(originalMessage, 'password');
    const plain = decrypt(cipher, 'password');
    expect(plain).be(originalMessage);
  });
});

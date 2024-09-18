//import CryptoJS from 'crypto-js';
import { cbc } from '@noble/ciphers/aes';
import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { Input } from '@noble/hashes/utils';
import { randomBytes } from '@noble/ciphers/webcrypto';
import { sha1 } from '@noble/hashes/sha1';
import { base64, hex } from '@scure/base';

const keySize = 256;

const new_iterations = 10_000;

// export const encrypt = (msg: string, pass: string, iterations?: number): string => {
//   const salt = CryptoJS.lib.WordArray.random(128 / 8);
//
//   const key = CryptoJS.PBKDF2(pass, salt, {
//     keySize: keySize / 32,
//     iterations: iterations ?? new_iterations,
//   });
//
//   const iv = CryptoJS.lib.WordArray.random(128 / 8);
//
//   const encrypted = CryptoJS.AES.encrypt(msg, key, {
//     iv: iv,
//     padding: CryptoJS.pad.Pkcs7,
//     mode: CryptoJS.mode.CBC,
//   });
//
//   return salt.toString() + iv.toString() + encrypted.toString();
// };
//
// export const decrypt = (transitmessage: string, pass: string, iterations?: number): string => {
//   const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
//   const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
//   const encrypted = transitmessage.substring(64);
//
//   const key = CryptoJS.PBKDF2(pass, salt, {
//     keySize: keySize / 32,
//     iterations: iterations ?? new_iterations,
//   });
//
//   return CryptoJS.AES.decrypt(encrypted, key, {
//     iv: iv,
//     padding: CryptoJS.pad.Pkcs7,
//     mode: CryptoJS.mode.CBC,
//   }).toString(CryptoJS.enc.Utf8);
// };

export const encrypt = (msg: string, pass: Input, iterations?: number) => {
  const salt = randomBytes(128 / 8);

  const key = pbkdf2(sha1, pass, salt, { c: iterations ?? new_iterations, dkLen: keySize / 8 });
  const iv = randomBytes(128 / 8);
  const stream = cbc(key, iv);
  const encoder = new TextEncoder();
  const encrypted = stream.encrypt(encoder.encode(msg));
  const saltString = hex.encode(salt);
  const ivString = hex.encode(iv);
  const encryptedString = base64.encode(encrypted);
  return saltString + ivString + encryptedString;
};

export const decrypt = (transitmessage: string, pass: Input, iterations?: number): string => {
  const salt = hex.decode(transitmessage.substring(0, 32));
  const iv = hex.decode(transitmessage.substring(32, 64));
  const encrypted = base64.decode(transitmessage.substring(64));

  const key = pbkdf2(sha1, pass, salt, { c: iterations ?? new_iterations, dkLen: keySize / 8 });
  const stream = cbc(key, iv);
  const decrypted = stream.decrypt(encrypted);
  return new TextDecoder().decode(decrypted);
};

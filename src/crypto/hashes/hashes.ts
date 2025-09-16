import Container, { Token } from 'typedi';

/**
 * RIPEMD-160 hash function type.
 * @param message - The message to hash (Uint8Array or string)
 * @returns The RIPEMD-160 hash as Uint8Array
 */
type ripemd160 = (message: Uint8Array | string) => Uint8Array;

/**
 * SHA-256 hash function type.
 * @param message - The message to hash (Uint8Array or string)
 * @returns The SHA-256 hash as Uint8Array
 */
type sha256 = (message: Uint8Array | string) => Uint8Array;

export const ripemd160Token = new Token<ripemd160>('ripemd160');
export const sha256Token = new Token<sha256>('sha256');

export const setripemd160 = (ripemd160: ripemd160) => {
  Container.set(ripemd160Token, ripemd160);
};

export const setsha256 = (sha256: sha256) => {
  Container.set(sha256Token, sha256);
};

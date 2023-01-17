import Container, { Token } from 'typedi';

export type IHDKey = {
  derive: (path: string) => IChildKey;
  publicKey: Uint8Array | null;
  privateKey: Uint8Array | null;
};

export type IChildKey = {
  publicKey: Uint8Array | null;
  privateKey: Uint8Array | null;
  sign: (hash: Uint8Array) => Uint8Array;
};

export interface IBip32 {
  derivePath(key: IHDKey, path: string): IChildKey;
  fromSeed(seed: Uint8Array): IHDKey;
  sign(key: IChildKey, hash: Uint8Array): Uint8Array;
}

export const bip32Token = new Token<IBip32>('bip32');

export function setBip32(bip32: IBip32) {
  Container.set(bip32Token, bip32);
}

export function getBip32() {
  return Container.get(bip32Token);
}

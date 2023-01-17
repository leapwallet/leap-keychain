import Container, { Token } from 'typedi';

export interface IBip39 {
  generateMnemonic(strength: number): string;
  mnemonicToSeed(mnemonic: string): Promise<Uint8Array>;
  validateMnemonic(mnemonic: string): boolean;
  mnemonicToSeedSync(mnemonic: string): Uint8Array;
}

export const bip39Token = new Token<IBip39>('bip39');

export function setBip39(bip39: IBip39) {
  Container.set(bip39Token, bip39);
}

export function getBip39() {
  return Container.get(bip39Token);
}

import * as bip39 from '@scure/bip39';
import { wordlist as englishWl } from '@scure/bip39/wordlists/english';
import { hex } from '@scure/base';

export namespace Bip39 {
  export function generateMnemonic(strength: number): string {
    return bip39.generateMnemonic(englishWl, strength);
  }
  export function mnemonicToSeed(mnemonic: string): Promise<Uint8Array> {
    return bip39.mnemonicToSeed(mnemonic);
  }
  export function validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic, englishWl);
  }
  export function mnemonicToSeedSync(mnemonic: string): Uint8Array {
    return bip39.mnemonicToSeedSync(mnemonic);
  }
  export function mnemonicToEntropy(mnemonic: string): string {
    const entropy = bip39.mnemonicToEntropy(mnemonic, englishWl);
    return hex.encode(entropy);
  }
}

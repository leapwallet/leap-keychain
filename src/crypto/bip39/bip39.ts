import * as bip39 from 'bip39';

export namespace Bip39 {
  export function generateMnemonic(strength: number): string {
    return bip39.generateMnemonic(strength);
  }
  export function mnemonicToSeed(mnemonic: string): Promise<Uint8Array> {
    return bip39.mnemonicToSeed(mnemonic);
  }
  export function validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
  }
  export function mnemonicToSeedSync(mnemonic: string): Uint8Array {
    return bip39.mnemonicToSeedSync(mnemonic);
  }
  export function mnemonicToEntropy(mnemonic: string): string {
    return bip39.mnemonicToEntropy(mnemonic);
  }
}

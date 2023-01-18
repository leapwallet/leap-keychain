import { HDKey } from '@scure/bip32';
import { IChildKey, IHDKey } from './hdwallet-token';

export namespace Bip32 {
  export function derivePath(key: IHDKey, path: string) {
    const childKey = key.derive(path);
    return {
      publicKey: childKey.publicKey,
      privateKey: childKey.privateKey,
      sign: (hash: Uint8Array) => Bip32.sign(childKey, hash),
    };
  }
  export function fromSeed(seed: Uint8Array): IHDKey {
    const key = HDKey.fromMasterSeed(seed);
    return {
      derive: (path) => key.derive(path),
      publicKey: key.publicKey,
      privateKey: key.privateKey,
    };
  }
  export function sign(key: IChildKey, message: Uint8Array) {
    return key.sign(message);
  }
}

import * as _Secp256k1 from '@noble/secp256k1';
import Container, { Token } from 'typedi';

export namespace Secp256k1 {
  export function getPublicKey(privateKey: Uint8Array, compressed: boolean): Uint8Array {
    return _Secp256k1.getPublicKey(privateKey, compressed);
  }
  export async function sign(
    message: Uint8Array,
    privateKey: Uint8Array,
    options?: { canonical: boolean; extraEntropy?: true },
  ): Promise<Uint8Array> {
    const signature = await _Secp256k1.signAsync(message, privateKey, {
      extraEntropy: options?.extraEntropy,
      lowS: true,
    });

    return signature.toBytes();
  }

  export function publicKeyConvert(publicKey: Uint8Array, compressed: boolean): Uint8Array {
    const pubKeyPoint = _Secp256k1.Point.fromHex(publicKey);
    return pubKeyPoint.toRawBytes(compressed);
  }
}

export const secp256k1Token = new Token<typeof Secp256k1>('secp256k1');
export const setSecp256k1 = (secp256k1: typeof Secp256k1) => {
  Container.set(secp256k1Token, secp256k1);
};

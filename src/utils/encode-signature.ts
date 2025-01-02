import * as base64js from 'base64-js';
import { Pubkey, StdSignature } from '../types/signature';

export function encodeSecp256k1Signature(pubkey: Uint8Array, signature: Uint8Array): StdSignature {
  if (signature.length !== 64) {
    throw new Error(
      'Signature must be 64 bytes long. Cosmos SDK uses a 2x32 byte fixed length encoding for the secp256k1 signature integers r and s.',
    );
  }

  return {
    pub_key: encodeSecp256k1Pubkey(pubkey),
    signature: base64js.fromByteArray(signature),
  };
}

export function encodeSecp256k1Pubkey(pubkey: Uint8Array): Pubkey {
  if (pubkey.length !== 33 || (pubkey[0] !== 0x02 && pubkey[0] !== 0x03)) {
    throw new Error('Public key must be compressed secp256k1, i.e. 33 bytes starting with 0x02 or 0x03');
  }
  return {
    type: 'tendermint/PubKeySecp256k1',
    value: base64js.fromByteArray(pubkey),
  };
}

export function compressSignature(recoveryParam: number, signature: Uint8Array) {
  if (!(recoveryParam === 0 || recoveryParam === 1 || recoveryParam === 2 || recoveryParam === 3)) {
    throw new Error('recoveryParam must be equal to 0, 1, 2, or 3');
  }

  let headerByte = recoveryParam + 27 + 4;
  return Buffer.concat([Uint8Array.of(headerByte), Uint8Array.from(signature)]).toString('base64');
}

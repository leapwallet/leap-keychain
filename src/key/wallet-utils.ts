import Container from 'typedi';
import { secp256k1Token } from '../crypto/ecc/secp256k1';
import { EthWallet } from './eth-wallet';
import { generateWallet, Wallet } from './wallet';
import * as base64js from 'base64-js';

export function generateWalletFromMnemonic(mnemonic: string, hdPath: string, addressPrefix: string) {
  const hdPathParams = hdPath.split('/');
  const coinType = hdPathParams[2];
  if (coinType?.replace("'", '') === '60') {
    return EthWallet.generateWalletFromMnemonic(mnemonic, { paths: [hdPath], addressPrefix });
  }
  return generateWallet(mnemonic, { paths: [hdPath], addressPrefix });
}

export async function generateWalletsFromMnemonic(mnemonic: string, paths: string[], prefix: string): Promise<Wallet> {
  const coinTypes = paths.map((hdPath) => {
    const pathParams = hdPath.split('/');
    return pathParams[2]?.replace("'", '');
  });

  const refCoinType = coinTypes[0];
  const isValid = coinTypes.every((coinType) => coinType === refCoinType);
  if (!isValid) {
    throw new Error('All paths must have the same coin type');
  }

  return new Promise((resolve) => resolve(generateWallet(mnemonic, { paths, addressPrefix: prefix })));
}

export function compressedPublicKey(publicKey: Uint8Array) {
  const secp256k1 = Container.get(secp256k1Token);
  return base64js.fromByteArray(secp256k1.publicKeyConvert(publicKey, true));
}

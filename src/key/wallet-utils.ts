import Container from 'typedi';
import { secp256k1Token } from '../crypto/ecc/secp256k1';
import { EthWallet } from './eth-wallet';
import { Wallet } from './wallet';
import * as base64js from 'base64-js';
import { bip39Token } from '../crypto/bip39/bip39-token';

/***
 * Generate a wallet from a mnemonic
 * @param mnemonic
 * @param options {
 *  hdPath: string,
 *  addressPrefix: string,
 *  ethWallet: boolean, - if true, it generates an ethereum wallet regardless of cointype
 *  pubKeyBech32Address: boolean - if true, it generates a bech32 address from public key instead of ethereum address.
 * }
 */
export function generateWalletFromMnemonic(
  mnemonic: string,
  {
    hdPath,
    addressPrefix,
    ethWallet,
    pubKeyBech32Address,
  }: {
    hdPath: string;
    addressPrefix: string;
    ethWallet: boolean;
    pubKeyBech32Address?: boolean;
  },
) {
  const bip39 = Container.get(bip39Token);
  bip39.mnemonicToEntropy(mnemonic);
  const hdPathParams = hdPath.split('/');
  const coinType = hdPathParams[2];
  if (coinType?.replace("'", '') === '60' || ethWallet) {
    return EthWallet.generateWalletFromMnemonic(mnemonic, { paths: [hdPath], addressPrefix, pubKeyBech32Address });
  }
  return Wallet.generateWallet(mnemonic, { paths: [hdPath], addressPrefix });
}

export function generateWalletsFromMnemonic(mnemonic: string, paths: string[], prefix: string): Wallet | EthWallet {
  const bip39 = Container.get(bip39Token);
  bip39.mnemonicToEntropy(mnemonic);
  const coinTypes = paths.map((hdPath) => {
    const pathParams = hdPath.split('/');
    return pathParams[2]?.replace("'", '');
  });

  const refCoinType = coinTypes[0];
  const isValid = coinTypes.every((coinType) => coinType === refCoinType);
  if (!isValid) {
    throw new Error('All paths must have the same coin type');
  }
  if (refCoinType === '60') {
    return EthWallet.generateWalletFromMnemonic(mnemonic, { paths, addressPrefix: prefix });
  }

  return Wallet.generateWallet(mnemonic, { paths, addressPrefix: prefix });
}

export function compressedPublicKey(publicKey: Uint8Array) {
  const secp256k1 = Container.get(secp256k1Token);
  return base64js.fromByteArray(secp256k1.publicKeyConvert(publicKey, true));
}

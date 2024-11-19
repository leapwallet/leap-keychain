import Container from 'typedi';
import { secp256k1Token } from '../crypto/ecc/secp256k1';
import { EthWallet } from './eth-wallet';
import { Wallet } from './wallet';
import * as base64js from 'base64-js';
import { bip39Token } from '../crypto/bip39/bip39-token';
import { BtcWalletHD } from './btc-wallet';
import { NETWORK } from '@scure/btc-signer';

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
    btcNetwork,
  }: {
    hdPath: string;
    addressPrefix: string;
    ethWallet: boolean;
    pubKeyBech32Address?: boolean;
    btcNetwork?: typeof NETWORK;
  },
) {
  const bip39 = Container.get(bip39Token);
  bip39.mnemonicToEntropy(mnemonic);
  const hdPathParams = hdPath.split('/');
  const coinType = hdPathParams[2];
  // force eth wallet generation
  if (ethWallet) {
    return EthWallet.generateWalletFromMnemonic(mnemonic, { paths: [hdPath], addressPrefix, pubKeyBech32Address });
  }

  switch (coinType) {
    case "60'":
      return EthWallet.generateWalletFromMnemonic(mnemonic, { paths: [hdPath], addressPrefix, pubKeyBech32Address });
    case "0'": {
      if (!btcNetwork) throw new Error('Cannot create btc wallet. Please provide network');
      return BtcWalletHD.generateWalletFromMnemonic(mnemonic, { paths: [hdPath], addressPrefix, network: btcNetwork });
    }
    default:
      return Wallet.generateWallet(mnemonic, { paths: [hdPath], addressPrefix });
  }
}

export function generateWalletsFromMnemonic(
  mnemonic: string,
  paths: string[],
  prefix: string,
  btcNetwork?: typeof NETWORK,
): Wallet | EthWallet | BtcWalletHD {
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

  switch (refCoinType) {
    case '60':
      return EthWallet.generateWalletFromMnemonic(mnemonic, { paths, addressPrefix: prefix });
    case '0': {
      if (!btcNetwork) throw new Error('Cannot create btc wallet. Please provide network');
      return BtcWalletHD.generateWalletFromMnemonic(mnemonic, { paths, addressPrefix: prefix, network: btcNetwork });
    }
    default:
      return Wallet.generateWallet(mnemonic, { paths, addressPrefix: prefix });
  }
}

export function compressedPublicKey(publicKey: Uint8Array) {
  const secp256k1 = Container.get(secp256k1Token);
  return base64js.fromByteArray(secp256k1.publicKeyConvert(publicKey, true));
}

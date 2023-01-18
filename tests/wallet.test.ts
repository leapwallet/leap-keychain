import Container from 'typedi';
import { Bip32 } from '../src/crypto/bip32/hd-wallet';
import { bip32Token } from '../src/crypto/bip32/hdwallet-token';
import { Bip39 } from '../src/crypto/bip39/bip39';
import { setBip39 } from '../src/crypto/bip39/bip39-token';
import { ripemd160Token, sha256Token } from '../src/crypto/hashes/hashes';
import { generateWallet } from '../src/key/wallet';
import { chainInfos, mnemonic, referenceWallets } from './mockdata';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';

beforeEach(() => {
  setBip39(Bip39);
  Container.set(bip32Token, Bip32);
  Container.set(sha256Token, sha256);
  Container.set(ripemd160Token, ripemd160);
});

describe('generateMnemonic', () => {
  test('generates a mnemonic', () => {
    const chainData = Object.entries(chainInfos).filter(([, chainInfo]) => chainInfo.coinType !== 60);

    for (const [key, chainInfo] of chainData) {
      const path = `m/44'/${chainInfo.coinType}'/0'/0/0`;
      const wallet = generateWallet(mnemonic, {
        addressPrefix: chainInfo.addressPrefix,
        paths: [path],
      });
      const accounts = wallet.getAccounts();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(accounts[0]?.address).toBe(referenceWallets.ref1.addresses[key]);
    }
  });
});

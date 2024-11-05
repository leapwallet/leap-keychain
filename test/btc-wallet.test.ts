import { ripemd160 } from '@noble/hashes/ripemd160';
import { sha256 } from '@noble/hashes/sha256';
import Container from 'typedi';
import { Bip32 } from '../src/crypto/bip32/hd-wallet';
import { bip32Token } from '../src/crypto/bip32/hdwallet-token';
import { Bip39 } from '../src/crypto/bip39/bip39';
import { setBip39 } from '../src/crypto/bip39/bip39-token';
import { ripemd160Token, sha256Token } from '../src/crypto/hashes/hashes';
import { BtcWallet } from '../src/key/btc-wallet';
import expect from 'expect.js';
import { mnemonic } from './mockdata';
import { NETWORK, TEST_NETWORK } from '@scure/btc-signer';

beforeEach(() => {
  setBip39(Bip39);
  Container.set(bip32Token, Bip32);
  Container.set(sha256Token, sha256);
  Container.set(ripemd160Token, ripemd160);
});

describe('generate btc wallet', () => {
  it('generates correct btc wallet', () => {
    const wallet = BtcWallet.generateWalletFromMnemonic(mnemonic, {
      addressPrefix: 'bc1q',
      paths: ["m/84'/0'/0'/0/0"],
      network: NETWORK,
    });
    const accounts = wallet.getAccountsWithPrivKey();

    const expectedAccount = 'bc1qd5xpfp9zp8q696pu3sz7ej2wrk2wn634dlnhfa';
    if (accounts[0]) {
      expect(accounts[0].address).to.be(expectedAccount);
    }
  });
  it('generates correct signet wallet', () => {
    const wallet = BtcWallet.generateWalletFromMnemonic(mnemonic, {
      addressPrefix: 'bc1q',
      paths: ["m/84'/0'/0'/0/0"],
      network: TEST_NETWORK,
    });
    const accounts = wallet.getAccountsWithPrivKey();

    const expectedAccount = 'tb1qd5xpfp9zp8q696pu3sz7ej2wrk2wn6348egyjw';
    if (accounts[0]) {
      expect(accounts[0].address).to.be(expectedAccount);
    }
  });
});

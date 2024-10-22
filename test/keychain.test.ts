import { KeyChain, WALLETTYPE } from '../src';
import { mnemonic, chainInfos, privateKey, referenceWallets } from './mockdata';
import { initStorage } from '../src/storage/storage-layer';
import { setBip39 } from '../src/crypto/bip39/bip39-token';
import { Bip39 } from '../src/crypto/bip39/bip39';
import Container from 'typedi';
import { bip32Token } from '../src/crypto/bip32/hdwallet-token';
import { ripemd160Token, sha256Token } from '../src/crypto/hashes/hashes';
import { Bip32 } from '../src/crypto/bip32/hd-wallet';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { Secp256k1, secp256k1Token } from '../src/crypto/ecc/secp256k1';
import expect from 'expect.js';

const { ref1, ref2 } = referenceWallets;

let storageObj: any = {};
const chainInfoslist = Object.entries(chainInfos).map(([key, chainInfo]) => {
  return {
    ...chainInfo,
    key,
    coinType: chainInfo.coinType.toString(),
  };
});

function setStorage() {
  initStorage({
    set: (key, value) => {
      storageObj[key] = value;
      return Promise.resolve();
    },
    get: (key) => {
      return Promise.resolve(storageObj[key]);
    },
    remove: (key) => {
      storageObj[key] = undefined;
      return Promise.resolve();
    },
  });
}

function clearStorage() {
  storageObj = {};
}

beforeEach(() => {
  setStorage();

  setBip39(Bip39);
  Container.set(bip32Token, Bip32);
  Container.set(sha256Token, sha256);
  Container.set(ripemd160Token, ripemd160);
  Container.set(secp256k1Token, Secp256k1);
}, 0);

afterEach(() => {
  clearStorage();
}, 0);

describe('keychain', () => {
  it('createWalletFromMnemonic', async () => {
    const _key = await KeyChain.createWalletUsingMnemonic({
      name: 'testwallet',
      mnemonic: mnemonic,
      password: 'password',
      addressIndex: 0,
      colorIndex: 0,
      chainInfos: chainInfoslist,
      type: 'create',
    });

    const key = storageObj['keystore'][_key.id];

    expect(key.addresses).to.eql(ref1.addresses);
    expect(key.pubKeys).to.eql(ref1.pubKeys);
    expect(key.name).to.eql(ref1.name);
    expect(key.addressIndex).to.eql(ref1.addressIndex);
    expect(key.colorIndex).to.eql(ref1.colorIndex);
    expect(key.walletType).to.eql(ref1.walletType);
  });

  it('createWalletFromPrivateKey', async () => {
    const _key = await KeyChain.importNewWallet(privateKey, 'password', chainInfoslist, 0, 'privatekeywallet');
    const key = storageObj['keystore'][_key.id];

    expect(key.addresses['cosmos']).to.eql(ref1.addresses.cosmos);
    expect(key.pubKeys['cosmos']).to.eql(ref1.pubKeys.cosmos);
    expect(key.walletType).to.eql(WALLETTYPE.PRIVATE_KEY);
  });

  it('createWalletFromExistingMnemonic', async () => {
    await KeyChain.createWalletUsingMnemonic({
      name: 'testwallet',
      mnemonic: mnemonic,
      password: 'password',
      addressIndex: 0,
      colorIndex: 0,
      chainInfos: chainInfoslist,
      type: 'create',
    });

    const _key = await KeyChain.createNewWalletAccount('testwallet', 'password', 1, chainInfoslist);

    const key = storageObj['keystore'][_key.id];
    expect(key.addresses).to.eql(ref2.addresses);
    expect(key.addressIndex).to.eql(1);
    expect(key.pubKeys).to.eql(ref2.pubKeys);
  });

  it('calling keychain multiple times should not override the keychain', async () => {
    const key = await KeyChain.createWalletUsingMnemonic({
      name: 'testwallet',
      mnemonic: mnemonic,
      password: 'password',
      addressIndex: 0,
      colorIndex: 0,
      chainInfos: chainInfoslist,
      type: 'create',
    });

    await KeyChain.encrypt('password');
    await KeyChain.encrypt('password');

    await KeyChain.decrypt('password');

    expect(storageObj['keystore'][key.id].addresses).to.eql(ref1.addresses);
  });
});

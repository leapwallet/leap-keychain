import Container from 'typedi';
import { Bip32 } from '../src/crypto/bip32/hd-wallet';
import { bip32Token } from '../src/crypto/bip32/hdwallet-token';
import { Bip39 } from '../src/crypto/bip39/bip39';
import { setBip39 } from '../src/crypto/bip39/bip39-token';
import { ripemd160Token, sha256Token } from '../src/crypto/hashes/hashes';
import { Wallet, PvtKeyWallet } from '../src/key/wallet';
import { generateWalletFromMnemonic, generateWalletsFromMnemonic } from '../src/key/wallet-utils';
import { EthWallet } from '../src/key/eth-wallet';
import { chainInfos, ethSignTestData, mnemonic, referenceWallets } from './mockdata';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import expect from 'expect.js';
import { hex } from '@scure/base';

beforeEach(() => {
  setBip39(Bip39);
  Container.set(bip32Token, Bip32);
  Container.set(sha256Token, sha256);
  Container.set(ripemd160Token, ripemd160);
});

describe('generateMnemonic', () => {
  it('generates wallet', () => {
    const chainData = Object.entries(chainInfos).filter(([, chainInfo]) => chainInfo.coinType !== 60);

    for (const [key, chainInfo] of chainData) {
      const path = `m/44'/${chainInfo.coinType}'/0'/0/0`;
      const wallet = Wallet.generateWallet(mnemonic, {
        addressPrefix: chainInfo.addressPrefix,
        paths: [path],
      });
      const accounts = wallet.getAccounts();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(accounts[0]?.address).to.be(referenceWallets.ref1.addresses[key]);
    }
  });

  it('generates eth wallet', () => {
    const chainData = Object.entries(chainInfos).filter(([, chainInfo]) => chainInfo.coinType === 60);
    for (const [key, chainInfo] of chainData) {
      const path = `m/44'/${chainInfo.coinType}'/0'/0/0`;
      const wallet = EthWallet.generateWalletFromMnemonic(mnemonic, {
        addressPrefix: chainInfo.addressPrefix,
        paths: [path],
      });
      const accounts = wallet.getAccounts();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(accounts[0]?.address).to.be(referenceWallets.ref1.addresses[key]);
      if (accounts[0]) {
        const signature = wallet.sign(accounts[0].address, hex.decode(ethSignTestData.input));
        expect(signature.compact).equal(ethSignTestData.output.compact);
      }
    }
  });

  it('Wallet throws error if mnemonic is invalid', () => {
    expect(() => Wallet.generateWallet('', { paths: ["m/44'/60'/0'/0/0"], addressPrefix: 'cosmos' })).throwError((e) =>
      expect(e.message).equal('Invalid mnemonic'),
    );
  });

  it('PvtkeyWallet throws error if pvtKey is invalid', () => {
    expect(() => PvtKeyWallet.generateWallet('', 'cosmos')).throwError((e) => {
      expect(e.message).to.equal('Invalid private key');
    });
  });

  it('Ethwallet throws error if mnemonic is invalid', () => {
    expect(() =>
      EthWallet.generateWalletFromMnemonic('', { paths: ["m/44'/60'/0'/0/0"], addressPrefix: 'cosmos' }),
    ).throwError((e) => expect(e.message).equal('Invalid mnemonic'));
  });

  it('Ethwallet throws error if pvtKey is invalid', () => {
    expect(() =>
      EthWallet.generateWalletFromPvtKey('', { paths: ["m/44'/118'/0'/0/0"], addressPrefix: 'cosmos' }),
    ).throwError((e) => {
      expect(e.message).to.contain('Invalid private key');
    });
  });
  it('generateWalletFromMnemonic', () => {
    const wallet = generateWalletFromMnemonic(mnemonic, {
      hdPath: "m/44'/118'/0'/0/1",
      addressPrefix: 'cosmos',
      ethWallet: false,
    });
    const accounts = wallet.getAccounts();
    expect(accounts[0]?.address).to.be(referenceWallets.ref2.addresses.cosmos);
  });
  it('generateWalletFromMnemonic for cointype=60', () => {
    const wallet = generateWalletFromMnemonic(mnemonic, {
      hdPath: "m/44'/60'/0'/0/1",
      addressPrefix: 'evmos',
      ethWallet: false,
    });
    const accounts = wallet.getAccounts();
    expect(accounts[0]?.address).to.be(referenceWallets.ref2.addresses.evmos);
  });
  it('generateWalletsFromMnemonic', async () => {
    const wallet = generateWalletsFromMnemonic(mnemonic, ["m/44'/118'/0'/0/0", "m/44'/118'/0'/0/1"], 'cosmos');
    const accounts = wallet.getAccounts();
    expect(accounts[0]?.address).to.be(referenceWallets.ref1.addresses.cosmos);
    expect(accounts[1]?.address).to.be(referenceWallets.ref2.addresses.cosmos);
  });
  it('generateWalletsFromMnemonic for cointype=60', async () => {
    const wallet = generateWalletsFromMnemonic(mnemonic, ["m/44'/60'/0'/0/0", "m/44'/60'/0'/0/1"], 'evmos');
    const accounts = wallet.getAccounts();
    expect(accounts[0]?.address).to.be(referenceWallets.ref1.addresses.evmos);
    expect(accounts[1]?.address).to.be(referenceWallets.ref2.addresses.evmos);
  });
  it('generateWalletFromMnemonic throws error if mnemonic is invalid', () => {
    expect(() =>
      generateWalletFromMnemonic('', { hdPath: "m/44'/118'/0'/0/0", addressPrefix: 'cosmos', ethWallet: false }),
    ).throwError((e) => expect(e.message).equal('Invalid mnemonic'));
  });
  it('generateWalletsFromMnemonic throws error if mnemonic is invalid', () => {
    expect(() => generateWalletsFromMnemonic('', ["m/44'/118'/0'/0/0"], 'cosmos')).throwError((e) =>
      expect(e.message).equal('Invalid mnemonic'),
    );
  });
});

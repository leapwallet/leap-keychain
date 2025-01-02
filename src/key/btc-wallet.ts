import { getBip32, IHDKey } from '../crypto/bip32/hdwallet-token';
import { getBip39 } from '../crypto/bip39/bip39-token';
import { WalletOptions } from '../types/wallet';
import { p2wpkh, Transaction, NETWORK } from '@scure/btc-signer';
import { base64, hex } from '@scure/base';
import Container from 'typedi';
import { secp256k1Token } from '../crypto/ecc/secp256k1';
import { P2Ret } from '@scure/btc-signer/payment';
import { signSync } from '@noble/secp256k1';
export type BTCWalletOptions = WalletOptions & { network: typeof NETWORK };

export abstract class BtcWallet {
  abstract getAccountsWithPrivKey(): Array<{
    algo: string;
    address: string;
    addressInfo: P2Ret;
    pubkey: Uint8Array;
    privateKey: Uint8Array;
  }>;
  getAccounts() {
    const accounts = this.getAccountsWithPrivKey();
    return accounts.map((account) => {
      return {
        algo: 'secp256k1',
        address: account.address,
        pubkey: account.pubkey,
      };
    });
  }

  signPsbt(address: string, psbt: string) {
    const psbtBytes = base64.decode(psbt);
    const tx = Transaction.fromPSBT(psbtBytes);
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === address);
    if (!account) throw new Error(`No account found for ${address}`);
    if (!account.privateKey) throw new Error('Private key not found');
    return {
      tx,
      signTx: () => {
        if (!account.privateKey) throw new Error('Private key not found');
        tx.sign(account.privateKey);
      },
    };
  }

  signIdx(address: string, tx: Transaction, idx: number) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === address);
    if (!account) throw new Error(`No account found for ${address}`);
    if (!account.privateKey) throw new Error('Private key not found');
    tx.signIdx(account.privateKey, idx);
  }

  signECDSA(address: string, hash: Uint8Array) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === address);
    if (!account) throw new Error(`No account found for ${address}`);
    const [signature, recoveryParam] = signSync(hash, account.privateKey, {
      canonical: true,
      recovered: true,
      der: false,
    });
    return {
      signature,
      recoveryParam,
    };
  }
}

export class BtcWalletHD extends BtcWallet {
  constructor(private hdKey: IHDKey, private options: BTCWalletOptions) {
    super();
  }

  static generateWalletFromMnemonic(mnemonic: string, options: BTCWalletOptions) {
    const bip39 = getBip39();
    const bip32 = getBip32();
    bip39.mnemonicToEntropy(mnemonic);
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdKey = bip32.fromSeed(seed);
    return new BtcWalletHD(hdKey, options);
  }

  getAccountsWithPrivKey(): Array<{
    algo: string;
    address: string;
    addressInfo: P2Ret;
    pubkey: Uint8Array;
    privateKey: Uint8Array;
  }> {
    const accountsWithPubKey = [];
    for (let path of this.options.paths) {
      const childKey = this.hdKey.derive(path);
      if (!childKey.privateKey) throw new Error(`Could not generate private key for path ${path}`);
      if (!childKey.publicKey) throw new Error(`Could not generate public key for path ${path}`);
      const addrData = p2wpkh(childKey.publicKey, this.options.network);

      if (!addrData.address) throw new Error(`Could not generate address for path ${path}`);
      accountsWithPubKey.push({
        algo: 'secp256k1',
        address: addrData.address,
        addressInfo: addrData,
        pubkey: childKey.publicKey,
        privateKey: childKey.privateKey,
      });
    }
    return accountsWithPubKey;
  }
}

export class BtcWalletPk extends BtcWallet {
  constructor(private privateKey: string, private options: BTCWalletOptions) {
    super();
  }

  getAccountsWithPrivKey(): {
    algo: string;
    address: string;
    addressInfo: P2Ret;
    pubkey: Uint8Array;
    privateKey: Uint8Array;
  }[] {
    const pkHex = this.privateKey.replace('0x', '');
    const secp256k1 = Container.get(secp256k1Token);
    const pubKey = secp256k1.getPublicKey(hex.decode(pkHex), true);
    if (!pubKey) throw new Error('Could not generate public key');
    const addrData = p2wpkh(pubKey, this.options.network);
    if (!addrData.address) throw new Error('Could not generate address');
    return [
      {
        algo: 'secp256k1',
        address: addrData.address,
        addressInfo: addrData,
        pubkey: pubKey,
        privateKey: hex.decode(pkHex),
      },
    ];
  }
}

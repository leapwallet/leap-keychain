import { getBip32, IChildKey, IHDKey } from '../crypto/bip32/hdwallet-token';
import { getBip39 } from '../crypto/bip39/bip39-token';
import { WalletOptions } from '../types/wallet';
import { p2wpkh, Transaction, NETWORK } from '@scure/btc-signer';
import { base64 } from '@scure/base';
import { HDKey } from '@scure/bip32';
export type BTCWalletOptions = WalletOptions & { network: typeof NETWORK };

export class BtcWallet {
  constructor(private hdKey: IHDKey, private options: BTCWalletOptions) {}

  static generateWalletFromPrivKey(privateKey: string, options: BTCWalletOptions) {
    const hdKey = HDKey.fromJSON({ xpriv: privateKey });
    return new BtcWallet(hdKey, options);
  }

  static generateWalletFromMnemonic(mnemonic: string, options: BTCWalletOptions) {
    const bip39 = getBip39();
    const bip32 = getBip32();
    bip39.mnemonicToEntropy(mnemonic);
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdKey = bip32.fromSeed(seed);
    return new BtcWallet(hdKey, options);
  }

  getAccountsWithPrivKey(): Array<{ algo: string; address: string; pubkey: Uint8Array; childKey: IChildKey }> {
    const accountsWithPubKey = [];
    for (let path of this.options.paths) {
      const childKey = this.hdKey.derive(path);

      if (!childKey.publicKey) throw new Error(`Could not generate public key for path ${path}`);
      const addrData = p2wpkh(childKey.publicKey, this.options.network);
      if (!addrData.address) throw new Error(`Could not generate address for path ${path}`);
      accountsWithPubKey.push({
        algo: 'secp256k1',
        address: addrData.address,
        p2ret: addrData,
        pubkey: childKey.publicKey,
        childKey: childKey,
      });
    }

    return accountsWithPubKey;
  }

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
    if (!account.childKey.privateKey) throw new Error('Private key not found');
    return {
      tx,
      signTx: () => {
        if (!account.childKey.privateKey) throw new Error('Private key not found');
        tx.sign(account.childKey.privateKey);
      },
    };
  }

  signIdx(address: string, tx: Transaction, idx: number) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === address);
    if (!account) throw new Error(`No account found for ${address}`);
    if (!account.childKey.privateKey) throw new Error('Private key not found');
    tx.signIdx(account.childKey.privateKey, idx);
  }
}

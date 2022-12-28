import { WalletOptions } from '../types/wallet';
import { Wallet } from '@ethersproject/wallet';
import { Address as EthereumUtilsAddress } from 'ethereumjs-util/dist/address';
import { bech32 } from 'bech32';
import { keccak256 } from 'ethereumjs-util';
import * as bytes from '@ethersproject/bytes';
import { fromHex } from '../utils/encoding';
import { StdSignDoc } from '../types/tx';
import { sha256 } from '@noble/hashes/sha256';
import { serializeStdSignDoc } from '../utils/serialize-signdoc';
import { encodeSecp256k1Signature } from '../utils/encode-signature';

export class EthWallet {
  private readonly mnemonic: string;
  private readonly options: WalletOptions;
  private readonly walletType: 'mnemonic' | 'pvtKey';
  private readonly pvtKey: string;

  protected constructor(mnemonic: string, pvtKey: string, walletType: 'mnemonic' | 'pvtKey', options: WalletOptions) {
    this.mnemonic = mnemonic;
    this.options = options;
    this.walletType = walletType;
    this.pvtKey = pvtKey;
  }

  static generateWalletFromMnemonic(mnemonic: string, options: WalletOptions) {
    return new EthWallet(mnemonic, '', 'mnemonic', options);
  }

  static generateWalletFromPvtKey(pvtKey: string, options: WalletOptions) {
    return new EthWallet('', pvtKey.replace('0x', ''), 'pvtKey', options);
  }

  getAccounts() {
    const accountsWithPrivKey = this.getAccountsWithPrivKey();
    return accountsWithPrivKey.map((account) => {
      return {
        algo: account.algo,
        address: account.address,
        pubkey: account.pubkey,
      };
    });
  }

  private getAccountsWithPrivKey() {
    return this.options.paths.map((path) => {
      const ethWallet =
        this.walletType === 'mnemonic' ? Wallet.fromMnemonic(this.mnemonic, path) : new Wallet(this.pvtKey);
      const address = ethWallet.address.toString();
      const addressBuffer = EthereumUtilsAddress.fromString(address).toBuffer();
      const bech32Address = bech32.encode(this.options.addressPrefix, bech32.toWords(addressBuffer));
      return {
        algo: 'ethsecp256k1',
        address: bech32Address,
        ethWallet: ethWallet,
        pubkey: fromHex(ethWallet._signingKey().compressedPublicKey.replace('0x', '')),
      };
    });
  }

  private static signMessage(wallet: Wallet, hash: Uint8Array) {
    const signature = wallet._signingKey().signDigest(keccak256(Buffer.from(hash)));
    const splitSignature = bytes.splitSignature(signature);
    return bytes.arrayify(bytes.concat([splitSignature.r, splitSignature.s]));
  }

  async sign(signerAddress: string, signBytes: string) {
    const accounts = await this.getAccountsWithPrivKey();
    const account = accounts.find(({ address }) => address === signerAddress);
    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }
    const { ethWallet } = account;
    const signature = await ethWallet._signingKey().signDigest(signBytes);
    const splitSignature = bytes.splitSignature(signature);
    return bytes.arrayify(bytes.concat([splitSignature.r, splitSignature.s]));
  }

  public signAmino(signerAddress: string, signDoc: StdSignDoc) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === signerAddress);
    if (!account) {
      throw new Error('Signer address does not match wallet address');
    }
    const hash = sha256(serializeStdSignDoc(signDoc));
    const signature = EthWallet.signMessage(account.ethWallet, hash);
    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubkey, signature),
    };
  }

  public signDirect(signerAddress: string, signDoc: StdSignDoc) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === signerAddress);
    if (!account) {
      throw new Error('Signer address does not match wallet address');
    }

    const hash = sha256(serializeStdSignDoc(signDoc));
    const signature = EthWallet.signMessage(account.ethWallet, hash);
    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubkey, signature),
    };
  }
}

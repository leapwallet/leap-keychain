import { WalletOptions } from '../types/wallet';
import { Wallet } from '@ethersproject/wallet';
import { Address as EthereumUtilsAddress } from 'ethereumjs-util/dist/address';
import { bech32 } from 'bech32';
import { keccak256 } from 'ethereumjs-util';
import * as bytes from '@ethersproject/bytes';
import { fromHex } from '../utils/encoding';
import { StdSignDoc } from '../types/tx';
import { serializeSignDoc, serializeStdSignDoc } from '../utils/serialize-signdoc';
import { encodeSecp256k1Signature } from '../utils/encode-signature';
import { HDNode } from '@ethersproject/hdnode';
import { bip39Token, getBip39 } from '../crypto/bip39/bip39-token';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { TransactionRequest, Provider } from '@ethersproject/abstract-provider';
import Container from 'typedi';
import { pubkeyToAddress } from './wallet';
import { hex } from '@scure/base';

export class EthWallet {
  private constructor(
    private mnemonic: string,
    private pvtKey: string,
    private walletType: 'mnemonic' | 'pvtKey',
    private options: WalletOptions,
    private provider?: Provider,
  ) {}

  /**
   * Generates a wallet from a mnemonic. Returns an EthWallet object.
   * @param mnemonic The mnemonic to generate a wallet from
   * @param options WalletOptions object
   */
  static generateWalletFromMnemonic(mnemonic: string, options: WalletOptions) {
    const bip39 = Container.get(bip39Token);
    bip39.mnemonicToEntropy(mnemonic);
    return new EthWallet(mnemonic, '', 'mnemonic', options);
  }

  setProvider(provider: Provider) {
    this.provider = provider;
  }

  /**
   * Generates a wallet from a private key.
   * @param {string} pvtKey - The private key to generate the wallet from.
   * @param {WalletOptions} options - The options for the wallet.
   * @returns {EthWallet} A wallet object.
   */
  static generateWalletFromPvtKey(pvtKey: string, options: WalletOptions) {
    try {
      new Wallet(pvtKey);
    } catch (e: any) {
      throw new Error(`Invalid private key ${e.message}`);
    }
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
    const bip39 = getBip39();
    const seed = bip39.mnemonicToSeedSync(this.mnemonic);
    return this.options.paths.map((path) => {
      const hdWallet =
        this.walletType === 'mnemonic' ? HDNode.fromSeed(seed).derivePath(path) : new Wallet(this.pvtKey);

      const ethAddr = EthereumUtilsAddress.fromString(hdWallet.address).toBuffer();

      const ethWallet = new Wallet(hdWallet.privateKey, this.provider);
      const pubkey = fromHex(ethWallet._signingKey().compressedPublicKey.replace('0x', ''));

      const bech32Address = this.options.pubKeyBech32Address
        ? pubkeyToAddress(this.options.addressPrefix, pubkey)
        : bech32.encode(this.options.addressPrefix, bech32.toWords(ethAddr));
      return {
        algo: 'ethsecp256k1',
        address: bech32Address,
        ethWallet: ethWallet,
        hexAddress: `0x${hex.encode(ethAddr)}`,
        pubkey,
      };
    });
  }

  public getAccountWithHexAddress() {
    const accounts = this.getAccountsWithPrivKey();
    return accounts.map((account) => {
      return {
        algo: account.algo,
        address: account.hexAddress,
        pubkey: account.pubkey,
        bech32Address: account.address,
      };
    });
  }

  public sign(signerAddress: string, signBytes: string | Uint8Array) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find(({ address }) => address === signerAddress);
    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }
    const { ethWallet } = account;
    return ethWallet._signingKey().signDigest(signBytes);
  }

  public async sendTransaction(transaction: TransactionRequest) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts[0];
    if (!account) throw new Error('Account not found');
    // if (account === undefined) {
    //   throw new Error(`Address ${signerAddress} not found in wallet`);
    // }
    const { ethWallet } = account;
    return await ethWallet.sendTransaction(transaction);
  }

  signMessage(signerAddress: string, message: Uint8Array) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find(({ address }) => address === signerAddress);
    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }
    const { ethWallet } = account;
    return ethWallet.signMessage(message);
  }

  async signTransaction(signerAddress: string, transaction: any) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find(({ address }) => address === signerAddress);
    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }
    const { ethWallet } = account;
    return ethWallet.signTransaction(transaction);
  }

  public signAmino(signerAddress: string, signDoc: StdSignDoc) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === signerAddress);
    if (!account) {
      throw new Error('Signer address does not match wallet address');
    }
    const hash = serializeStdSignDoc(signDoc);
    const rawSignature = this.sign(signerAddress, keccak256(Buffer.from(hash)));
    const splitSignature = bytes.splitSignature(rawSignature);
    const signature = bytes.arrayify(bytes.concat([splitSignature.r, splitSignature.s]));

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubkey, signature),
    };
  }

  public async signDirect(signerAddress: string, signDoc: SignDoc) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find(({ address }) => address === signerAddress);
    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }

    const hash = serializeSignDoc(signDoc);

    const rawSignature = this.sign(signerAddress, keccak256(Buffer.from(hash)));
    const splitSignature = bytes.splitSignature(rawSignature);
    const signature = bytes.arrayify(bytes.concat([splitSignature.r, splitSignature.s]));

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubkey, signature),
    };
  }
}

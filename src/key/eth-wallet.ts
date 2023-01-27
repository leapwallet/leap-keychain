import { WalletOptions } from '../types/wallet';
import { Wallet } from '@ethersproject/wallet';
import { Address as EthereumUtilsAddress } from 'ethereumjs-util/dist/address';
import { bech32 } from 'bech32';
import { keccak256 } from 'ethereumjs-util';
import * as bytes from '@ethersproject/bytes';
import { fromHex } from '../utils/encoding';
import { StdSignDoc } from '../types/tx';
import { sha256 } from '@noble/hashes/sha256';
import { serializeSignDoc, serializeStdSignDoc } from '../utils/serialize-signdoc';
import { encodeSecp256k1Signature } from '../utils/encode-signature';
import { HDNode } from '@ethersproject/hdnode';
import { getBip39 } from '../crypto/bip39/bip39-token';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export class EthWallet {
  protected constructor(
    private mnemonic: string,
    private pvtKey: string,
    private walletType: 'mnemonic' | 'pvtKey',
    private options: WalletOptions,
  ) {}

  /**
   * Generates a wallet from a mnemonic. Returns an EthWallet object.
   * @param mnemonic The mnemonic to generate a wallet from
   * @param options WalletOptions object
   */
  static generateWalletFromMnemonic(mnemonic: string, options: WalletOptions) {
    return new EthWallet(mnemonic, '', 'mnemonic', options);
  }

  /**
   * Generates a wallet from a private key.
   * @param {string} pvtKey - The private key to generate the wallet from.
   * @param {WalletOptions} options - The options for the wallet.
   * @returns {EthWallet} A wallet object.
   */
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
    const bip39 = getBip39();
    const seed = bip39.mnemonicToSeedSync(this.mnemonic);
    return this.options.paths.map((path) => {
      const hdWallet =
        this.walletType === 'mnemonic' ? HDNode.fromSeed(seed).derivePath(path) : new Wallet(this.pvtKey);

      const ethAddr = EthereumUtilsAddress.fromString(hdWallet.address).toBuffer();
      const bech32Address = bech32.encode(this.options.addressPrefix, bech32.toWords(ethAddr));
      const ethWallet = new Wallet(hdWallet.privateKey);
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

  sign(signerAddress: string, signBytes: string | Uint8Array) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find(({ address }) => address === signerAddress);
    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }
    const { ethWallet } = account;
    const signature = ethWallet._signingKey().signDigest(signBytes);
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

  public async signDirect(signerAddress: string, signDoc: SignDoc) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find(({ address }) => address === signerAddress);
    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }

    const hash = serializeSignDoc(signDoc);

    const signature = this.sign(signerAddress, keccak256(Buffer.from(hash)));
    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubkey, signature),
    };
  }
}

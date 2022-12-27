import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import { bech32 } from 'bech32';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { sha256 } from '@noble/hashes/sha256';
import { serializeSignDoc, serializeStdSignDoc } from './utils/serialize-signdoc';
import { StdSignDoc } from './types/tx';
import { encodeSecp256k1Signature } from './utils/encode-signature';
import { WalletOptions } from './types/wallet';
import * as secp256k1 from '@noble/secp256k1';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export function pubkeyToAddress(prefix: string, publicKey: Uint8Array) {
  return bech32.encode(prefix, bech32.toWords(ripemd160(sha256(publicKey))));
}

export class Wallet {
  constructor(private wallet: HDKey, private options: WalletOptions) {}

  static generateWallet(mnemonic: string, options: WalletOptions) {
    if (mnemonic === '') {
      mnemonic = bip39.generateMnemonic(256 /* 24 words */);
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const node = HDKey.fromMasterSeed(seed);
    return new Wallet(node, options);
  }

  public async signAmino(signerAddress: string, signDoc: StdSignDoc) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === signerAddress);
    if (!account) {
      throw new Error('Signer address does not match wallet address');
    }
    if (!account.pubKey) {
      throw new Error('Unable to derive keypair');
    }

    const hash = sha256(serializeStdSignDoc(signDoc));
    const signature = account.childKey.sign(hash);

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubKey, signature),
    };
  }

  async signDirect(signerAddress: string, signDoc: SignDoc) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === signerAddress);
    if (!account) {
      throw new Error('Signer address does not match wallet address');
    }
    if (!account.pubKey || !account.childKey.privateKey) {
      throw new Error('Unable to derive keypair');
    }

    const hash = sha256(serializeSignDoc(signDoc));

    const signature = await secp256k1.sign(hash, account.childKey.privateKey, {
      extraEntropy: true,
      der: false,
    });

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubKey, signature),
    };
  }

  getAccounts() {
    return this.getAccountsWithPrivKey().map((account) => {
      return {
        algo: 'secp256k1',
        address: account.address,
        pubkey: account.pubKey,
      };
    });
  }

  getAccountsWithPrivKey() {
    const childKeys = this.options.paths.map((path) => {
      return this.wallet.derive(path);
    });

    return childKeys.map((childKey) => {
      const publicKey = childKey.publicKey;
      const address = pubkeyToAddress(this.options.addressPrefix, publicKey!);
      return {
        algo: 'secp256k1',
        address,
        pubKey: publicKey,
        childKey: childKey,
      };
    });
  }
}

import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import { bech32 } from 'bech32';
import { serializeSignDoc, serializeStdSignDoc } from '../utils/serialize-signdoc';
import { StdSignDoc } from '../types/tx';
import { encodeSecp256k1Signature } from '../utils/encode-signature';
import { WalletOptions } from '../types/wallet';
import * as secp256k1 from '@noble/secp256k1';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { sha256 } from '@noble/hashes/sha256';

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

  static generateWalletFromPrivKey(privKey: string, options: WalletOptions) {
    const node = HDKey.fromExtendedKey(privKey);
    return new Wallet(node, options);
  }

  public async signAmino(signerAddress: string, signDoc: StdSignDoc) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === signerAddress);
    if (!account) {
      throw new Error('Signer address does not match wallet address');
    }
    if (!account.pubkey) {
      throw new Error('Unable to derive keypair');
    }

    const hash = sha256(serializeStdSignDoc(signDoc));
    const signature = account.childKey.sign(hash);

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubkey, signature),
    };
  }

  async signDirect(signerAddress: string, signDoc: SignDoc) {
    const accounts = this.getAccountsWithPrivKey();
    const account = accounts.find((account) => account.address === signerAddress);
    if (!account) {
      throw new Error('Signer address does not match wallet address');
    }
    if (!account.pubkey || !account.childKey.privateKey) {
      throw new Error('Unable to derive keypair');
    }

    const hash = sha256(serializeSignDoc(signDoc));

    const signature = await secp256k1.sign(hash, account.childKey.privateKey, {
      extraEntropy: true,
      der: false,
    });

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubkey, signature),
    };
  }

  getAccounts() {
    return this.getAccountsWithPrivKey().map((account) => {
      return {
        algo: 'secp256k1',
        address: account.address,
        pubkey: account.pubkey,
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
        pubkey: publicKey,
        childKey: childKey,
      };
    });
  }
}

export class PvtKeyWallet {
  constructor(private privateKey: Uint8Array, private publicKey: Uint8Array, private address: string) {}

  static generateWallet(privateKey: string, addressPrefix: string) {
    const sanitizedPvtKey = privateKey.replace('0x', '');
    const pvtKeyBytes = Buffer.from(sanitizedPvtKey, 'hex');

    const publicKey = secp256k1.getPublicKey(pvtKeyBytes, true);
    const address = pubkeyToAddress(addressPrefix, publicKey!);
    return new PvtKeyWallet(pvtKeyBytes, publicKey, address);
  }

  getAccounts() {
    return [
      {
        algo: 'secp256k1',
        address: this.address,
        pubkey: this.publicKey,
      },
    ];
  }

  public async signAmino(signerAddress: string, signDoc: StdSignDoc) {
    const accounts = this.getAccounts();
    const account = accounts.find((account) => account.address === signerAddress);
    if (!account) {
      throw new Error('Signer address does not match wallet address');
    }
    if (!account.pubkey) {
      throw new Error('Unable to derive keypair');
    }

    const hash = sha256(serializeStdSignDoc(signDoc));
    const signature = await secp256k1.sign(hash, this.privateKey, {
      extraEntropy: true,
      der: false,
    })

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubkey, signature),
    };
  }

  async signDirect(signerAddress: string, signDoc: SignDoc) {
    const accounts = this.getAccounts();
    const account = accounts.find((account) => account.address === signerAddress);
    if (!account) {
      throw new Error('Signer address does not match wallet address');
    }

    const hash = sha256(serializeSignDoc(signDoc));

    const signature = await secp256k1.sign(hash, this.privateKey, {
      extraEntropy: true,
      der: false,
    });

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(account.pubkey, signature),
    };
  }
}

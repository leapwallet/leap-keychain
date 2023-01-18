import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import Container from 'typedi';
import { Bip32 } from '../crypto/bip32/hd-wallet';
import { bip32Token } from '../crypto/bip32/hdwallet-token';
import { Bip39 } from '../crypto/bip39/bip39';
import { setBip39 } from '../crypto/bip39/bip39-token';
import { Secp256k1, secp256k1Token } from '../crypto/ecc/secp256k1';
import { ripemd160Token, sha256Token } from '../crypto/hashes/hashes';

export function initCrypto() {
  setBip39(Bip39);
  Container.set(bip32Token, Bip32);
  Container.set(sha256Token, sha256);
  Container.set(ripemd160Token, ripemd160);
  Container.set(secp256k1Token, Secp256k1);
}

import { EthWallet } from '../key/eth-wallet';
import getHDPath, { getFullHDPath, isBtcCoinType } from '../utils/get-hdpath';
import { PvtKeyWallet } from '../key/wallet';

import { Container } from 'typedi';
import { decrypt, encrypt } from '../encryption-utils/encryption-utils';
import { storageToken } from '../storage/storage-layer';
import { v4 as uuidv4 } from 'uuid';
import { correctMnemonic } from '../utils/correct-mnemonic';
import { ChainInfo, CreateWalletParams, Key, Keystore, WALLETTYPE } from '../types/keychain';
import {
  compressedPublicKey,
  generateWalletFromMnemonic,
  generateWalletFromPrivateKey,
  generateWalletsFromMnemonic,
} from '../key/wallet-utils';
import { convertAddress } from '../utils/bech32-address-converter';
import { Input } from '@noble/ciphers/utils';
import { BtcWalletPk } from '../key/btc-wallet';
import { NETWORK } from '@scure/btc-signer';

export const KEYCHAIN = 'keystore';
export const ENCRYPTED_KEYCHAIN = 'encrypted-keystore';
export const ACTIVE_WALLET = 'active-wallet';
export const ENCRYPTED_ACTIVE_WALLET = 'encrypted-active-wallet';

export class KeyChain {
  public static async createWalletUsingMnemonic<T extends string>({
    name,
    mnemonic,
    password,
    addressIndex,
    colorIndex,
    chainInfos,
    type,
  }: CreateWalletParams): Promise<Key<T>> {
    const allWallets = (await KeyChain.getAllWallets()) ?? {};
    const walletsData = Object.values(allWallets)?.filter((wallet) =>
      [WALLETTYPE.SEED_PHRASE, WALLETTYPE.SEED_PHRASE_IMPORTED].includes(wallet.walletType),
    );

    const { addresses, pubKeys } = await KeyChain.getAddresses(mnemonic, addressIndex, chainInfos);
    const walletId = uuidv4();

    if (Object.values(addresses).some((address) => KeyChain.isWalletAlreadyPresent(address, walletsData))) {
      throw new Error('Wallet already present');
    }

    const wallet: Key<T> = {
      addressIndex: addressIndex,
      name: name,
      cipher: encrypt(mnemonic, password),
      addresses,
      pubKeys,
      walletType: type === 'create' ? WALLETTYPE.SEED_PHRASE : WALLETTYPE.SEED_PHRASE_IMPORTED,
      id: walletId,
      colorIndex: colorIndex,
      createdAt: Date.now(),
    };

    await KeyChain.updateKeyChain<T>({
      [walletId]: wallet,
    });

    return wallet;
  }

  public static async createNewWalletAccount<T extends string>(
    name: string,
    password: Input,
    colorIndex: number,
    chainInfos: ChainInfo[],
  ): Promise<Key<T>> {
    const wallets = await KeyChain.getAllWallets();
    const walletsData = Object.values(wallets);
    const lastIndex = walletsData
      .filter((wallet) => wallet.walletType === WALLETTYPE.SEED_PHRASE)
      .reduce((prevVal, currentValue) => {
        if (prevVal > currentValue.addressIndex) {
          return prevVal;
        }
        return currentValue.addressIndex;
      }, 0);

    const addressIndex = lastIndex + 1;
    const primaryWallet = walletsData.find((wallet) => wallet.walletType === WALLETTYPE.SEED_PHRASE);
    if (!primaryWallet) {
      throw new Error('No primary wallet found');
    }
    const cipher = primaryWallet.cipher;

    const mnemonic = decrypt(cipher, password);
    const { addresses, pubKeys } = await KeyChain.getAddresses(mnemonic, addressIndex, chainInfos);
    const walletId = uuidv4();
    const wallet = {
      addressIndex,
      name,
      addresses,
      pubKeys,
      cipher,
      walletType: WALLETTYPE.SEED_PHRASE,
      id: walletId,
      colorIndex: colorIndex ?? addressIndex,
      createdAt: Date.now(),
    } as Key<T>;

    const keystoreEntry: { [id: string]: Key<T> } = {
      [walletId]: wallet,
    };
    await KeyChain.updateKeyChain(keystoreEntry);
    return wallet;
  }

  public static async importNewWallet<T extends string>(
    privateKey: string,
    password: Input,
    chainInfos: ChainInfo[],
    addressIndex?: number,
    name?: string,
  ): Promise<Key<T>> {
    const addresses: Record<string, string> = {};
    const pubKeys: Record<string, string> = {};
    for (const chainInfo of chainInfos) {
      if (chainInfo.customKeygenfn) {
        const key = await chainInfo.customKeygenfn(privateKey, getFullHDPath('44', chainInfo.coinType), 'privateKey');
        addresses[chainInfo.key] = key.address;
        pubKeys[chainInfo.key] = key.pubkey;
        continue;
      }
      const prefix = chainInfo.addressPrefix;
      const purpose = chainInfo.useBip84 ? '84' : '44';
      const hdPath = getFullHDPath(purpose, chainInfo.coinType);
      let wallet = generateWalletFromPrivateKey(privateKey, hdPath, prefix, chainInfo.btcNetwork);
      const [account] = wallet.getAccounts();
      if (account && account.address && account.pubkey) {
        addresses[chainInfo.key] = account.address;
        pubKeys[chainInfo.key] = compressedPublicKey(account.pubkey);
      }
    }

    const allWallets = await KeyChain.getAllWallets();
    const walletsData = Object.values(allWallets ?? {});
    const lastIndex = walletsData.length;

    if (Object.values(addresses).some((address) => KeyChain.isWalletAlreadyPresent(address, walletsData))) {
      throw new Error('Wallet already present');
    }

    const walletId = uuidv4();
    const wallet = {
      [walletId]: {
        // address index is not relevant in case of wallets imported using private key.
        addressIndex: addressIndex ?? lastIndex + 1,
        name: name ?? `Wallet ${lastIndex + 1}`,
        addresses,
        pubKeys,
        cipher: encrypt(privateKey, password),
        walletType: WALLETTYPE.PRIVATE_KEY,
        id: walletId,
        colorIndex: lastIndex,
        createdAt: Date.now(),
      },
    };

    await KeyChain.updateKeyChain(wallet);
    return wallet[walletId]!;
  }

  public static async EditWallet<T extends string>({
    walletId,
    name,
    colorIndex,
  }: {
    walletId: string;
    name: string;
    colorIndex: number;
  }) {
    const storage = Container.get(storageToken);

    const keyStore = (await storage.get(KEYCHAIN)) as unknown as Keystore<T>;
    const wallet = keyStore[walletId];
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    const otherWallet = Object.values(keyStore).find((v) => v.name === name && v.id !== wallet.id);
    if (otherWallet) {
      throw new Error('Wallet name already exists');
    }

    wallet.name = name;
    wallet.colorIndex = colorIndex;

    const wallets: { [id: string]: Key<T> } = {
      [walletId]: wallet,
    };
    await KeyChain.updateKeyChain(wallets);
  }

  public static async getWalletsFromMnemonic(
    mnemonic: string,
    count: number,
    coinType: string,
    addressPrefix: string,
  ): Promise<{ address: string; index: number; pubkey: Uint8Array | null }[]> {
    const correctedMnemonic = correctMnemonic(mnemonic);
    const holder = new Array(count).fill(0);
    const hdPaths = holder.map((_, v) => getHDPath(coinType, v.toString()));

    const generatedWallet = await generateWalletsFromMnemonic(correctedMnemonic, hdPaths, addressPrefix);
    const accounts = generatedWallet
      .getAccounts()
      .map((account, index) => ({ address: account.address, pubkey: account.pubkey, index }));

    return accounts.sort((a, b) => a.index - b.index);
  }

  public static async getAllWallets<T extends string>() {
    const storage = Container.get(storageToken);
    return (await storage.get(KEYCHAIN)) as unknown as Keystore<T>;
  }

  public static async getSigner<T extends string>(
    walletId: string,
    password: Input,
    {
      addressPrefix,
      coinType,
      ethWallet,
      pubKeyBech32Address,
      btcNetwork,
    }: {
      addressPrefix: string;
      coinType: string;
      ethWallet?: boolean;
      pubKeyBech32Address?: boolean;
      btcNetwork?: typeof NETWORK;
    },
  ) {
    const storage = Container.get(storageToken);
    const keychain = (await storage.get(KEYCHAIN)) as unknown as Keystore<T>;
    const walletData = keychain[walletId];
    if (!walletData) throw new Error('Wallet not found');
    const secret = decrypt(walletData.cipher, password);
    if (
      walletData.walletType !== WALLETTYPE.PRIVATE_KEY &&
      walletData.walletType !== WALLETTYPE.SEED_PHRASE &&
      walletData.walletType !== WALLETTYPE.SEED_PHRASE_IMPORTED
    ) {
      throw new Error('Wallet type not supported');
    }
    if (walletData.walletType === WALLETTYPE.PRIVATE_KEY) {
      if (coinType === '60' || ethWallet) {
        const hdPath = getHDPath(coinType, walletData.addressIndex.toString());
        return EthWallet.generateWalletFromPvtKey(secret, { paths: [hdPath], addressPrefix, pubKeyBech32Address });
      } else if (isBtcCoinType(coinType)) {
        if (!btcNetwork) throw new Error('Cannot create btc wallet. Please provide network');
        return new BtcWalletPk(secret, {
          paths: [getHDPath(coinType, walletData.addressIndex.toString())],
          addressPrefix,
          network: btcNetwork,
        });
      }
      return PvtKeyWallet.generateWallet(secret, addressPrefix);
    } else {
      const purpose = isBtcCoinType(coinType) ? '84' : '44';
      const hdPath = getFullHDPath(purpose, coinType, walletData.addressIndex.toString());
      return generateWalletFromMnemonic(secret, {
        hdPath,
        addressPrefix,
        ethWallet: !!ethWallet,
        pubKeyBech32Address,
        btcNetwork,
      });
    }
  }

  public static async removeWallets<T extends string>(keyIds: string[]) {
    const storage = Container.get(storageToken);
    const keychain = (await storage.get(KEYCHAIN)) as unknown as Keystore<T>;
    keyIds.forEach((keyId) => {
      delete keychain[keyId];
    });
    storage.set(KEYCHAIN, keychain);
  }

  public static async encrypt<T extends string>(password: Input) {
    const storage = Container.get(storageToken);
    const keychain = (await storage.get(KEYCHAIN)) as unknown as Keystore<T>;
    const activeWallet = (await storage.get(ACTIVE_WALLET)) as unknown as Key<T>;
    if (keychain && activeWallet) {
      const keychainJSON = JSON.stringify(keychain);
      const activeWalletJSON = JSON.stringify(activeWallet);

      const encryptedKeychain = encrypt(keychainJSON, password);
      const encryptedActiveWallet = encrypt(activeWalletJSON, password);

      storage.set(ENCRYPTED_KEYCHAIN, encryptedKeychain);
      storage.set(ENCRYPTED_ACTIVE_WALLET, encryptedActiveWallet);

      storage.remove(KEYCHAIN);
      storage.remove(ACTIVE_WALLET);
    }
  }

  public static async decrypt(password: Input) {
    const storage = Container.get(storageToken);
    const encryptedKeychain = (await storage.get(ENCRYPTED_KEYCHAIN)) as unknown as string;
    const encryptedActiveWallet = (await storage.get(ENCRYPTED_ACTIVE_WALLET)) as unknown as string;
    if (encryptedKeychain) {
      const keychain = JSON.parse(decrypt(encryptedKeychain, password));
      storage.set(KEYCHAIN, keychain);
    }
    if (encryptedActiveWallet) {
      const activeWallet = JSON.parse(decrypt(encryptedActiveWallet, password));
      storage.set(ACTIVE_WALLET, activeWallet);
    }
  }

  private static async getAddresses(mnemonic: string, addressIndex: number, chainInfos: Array<ChainInfo>) {
    try {
      const chainsData = chainInfos;
      const addresses: Record<string, string> = {};
      const pubKeys: Record<string, string> = {};
      const coinTypeKeys: Record<string, { address: string; pubkey: string }> = {};

      for (const chainInfo of chainsData) {
        const purpose = chainInfo.useBip84 ? '84' : '44';
        if (chainInfo.customKeygenfn) {
          const key = await chainInfo.customKeygenfn(
            mnemonic,
            getFullHDPath(purpose, chainInfo.coinType, addressIndex.toString()),
            'seedPhrase',
          );
          addresses[chainInfo.key] = key.address;
          pubKeys[chainInfo.key] = key.pubkey;
          continue;
        }
        const coinTypeKey = coinTypeKeys[chainInfo.coinType];
        if (coinTypeKey && !chainInfo.useBip84) {
          addresses[chainInfo.key] = convertAddress(coinTypeKey.address, chainInfo.addressPrefix);
          pubKeys[chainInfo.key] = coinTypeKey.pubkey;
          continue;
        }
        const wallet = generateWalletFromMnemonic(mnemonic, {
          hdPath: getFullHDPath(purpose, chainInfo.coinType, addressIndex.toString()),
          addressPrefix: chainInfo.addressPrefix,
          ethWallet: false,
          btcNetwork: chainInfo.btcNetwork,
        });

        const [account] = wallet.getAccounts();
        if (account?.address && account?.pubkey) {
          coinTypeKeys[chainInfo.coinType] = { address: account.address, pubkey: compressedPublicKey(account.pubkey) };
          addresses[chainInfo.key] = account.address;
          pubKeys[chainInfo.key] = compressedPublicKey(account.pubkey);
        }
      }
      return { addresses, pubKeys };
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  static async AddEntry<T extends string>(walletId: string, entry: { key: T; address: string; pubkey: string }) {
    const storage = Container.get(storageToken);
    const keystore: Keystore<T> = await storage.get(KEYCHAIN);
    const wallet = keystore[walletId];
    const activeWallet: Key<T> = await storage.get(ACTIVE_WALLET);
    if (!wallet) throw new Error('Wallet not found');
    wallet.addresses[entry.key] = entry.address;
    if (wallet.pubKeys) {
      wallet.pubKeys[entry.key] = entry.pubkey;
    }
    if (activeWallet && activeWallet.id === walletId) {
      activeWallet.addresses[entry.key] = entry.address;
      if (activeWallet.pubKeys) {
        activeWallet.pubKeys[entry.key] = entry.pubkey;
      }
      await storage.set(ACTIVE_WALLET, activeWallet);
    }
    keystore[walletId] = wallet;
    await storage.set(KEYCHAIN, keystore);
  }

  private static isWalletAlreadyPresent<T extends string>(address: string, wallets: Key<T>[]) {
    return wallets.find((wallet) => Object.values(wallet.addresses).includes(address)) !== undefined;
  }

  private static async updateKeyChain<T extends string>(newWallets: Record<string, Key<T>>) {
    const storage = Container.get(storageToken);
    const keystore: Keystore<T>[] = await storage.get(KEYCHAIN);
    const newKeystore = { ...keystore, ...newWallets };
    const entries = Object.keys(newWallets);
    const lastEntry = entries.pop() ?? '';
    await storage.set(KEYCHAIN, newKeystore);
    await storage.set(ACTIVE_WALLET, newWallets[lastEntry]);
  }
}

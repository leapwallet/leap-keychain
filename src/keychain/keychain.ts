import { EthWallet } from '../key/eth-wallet';
import getHDPath from '../utils/get-hdpath';
import { PvtKeyWallet, Wallet } from '../key/wallet';
import * as secp256k1 from 'secp256k1';
import * as base64js from 'base64-js';
import { Container } from 'typedi';
import { decrypt, encrypt } from '../encryption-utils/encryption-utils';
import { storageToken } from '../storage/storagelayer';
import { v4 as uuidv4 } from 'uuid';
import { correctMnemonic } from '../utils/correct-mnemonic';
import { ChainInfo, CreateWalletParams, Key, Keystore, WALLETTYPE } from '../types/keychain';

const KEYCHAIN = 'keystore';
const ACTIVE_WALLET = 'active-wallet';

//TODO: move to wallet utils
function generateWalletFromMnemonic(mnemonic: string, hdPath: string, addressPrefix: string) {
  const hdPathParams = hdPath.split('/');
  const coinType = hdPathParams[2];
  if (coinType?.replace("'", '') === '60') {
    return EthWallet.generateWalletFromMnemonic(mnemonic, { paths: [hdPath], addressPrefix });
  }
  return Wallet.generateWallet(mnemonic, { paths: [hdPath], addressPrefix });
}

//TODO: move to wallet utils
export async function generateWalletsFromMnemonic(mnemonic: string, paths: string[], prefix: string): Promise<Wallet> {
  const coinTypes = paths.map((hdPath) => {
    const pathParams = hdPath.split('/');
    return pathParams[2]?.replace("'", '');
  });

  const refCoinType = coinTypes[0];
  const isValid = coinTypes.every((coinType) => coinType === refCoinType);
  if (!isValid) {
    throw new Error('All paths must have the same coin type');
  }

  return new Promise((resolve) => resolve(Wallet.generateWallet(mnemonic, { paths, addressPrefix: prefix })));
}

//TODO: move to utils
function compressPubicKey(publicKey: Uint8Array) {
  return base64js.fromByteArray(secp256k1.publicKeyConvert(publicKey, true));
}

export class KeyChain {
  public static async createWalletUsingMnemonic<T extends string>({
    name,
    mnemonic,
    password,
    addressIndex,
    colorIndex,
    chainInfos,
  }: CreateWalletParams): Promise<Key<T>> {
    const allWallets = (await KeyChain.getAllWallets()) ?? {};
    const walletsData = Object.values(allWallets);

    const { addresses, pubKeys } = await KeyChain.getAddresses(mnemonic, addressIndex, chainInfos);
    const walletId = uuidv4();

    if (KeyChain.isWalletAlreadyPresent(Object.values(addresses)[0] ?? '', walletsData)) {
      throw new Error('Wallet already present');
    }

    const wallet: Key<T> = {
      addressIndex: addressIndex,
      name: name,
      cipher: encrypt(mnemonic, password),
      addresses,
      pubKeys,
      walletType: WALLETTYPE.SEED_PHRASE,
      id: walletId,
      colorIndex: colorIndex,
    };

    await KeyChain.updateKeyChain<T>({
      [walletId]: wallet,
    });

    // const store = await storage.get(PRIMARY_WALLET_ADDRESS);

    // if (!store[PRIMARY_WALLET_ADDRESS]) {
    //   await browser.storage.local.set({ [PRIMARY_WALLET_ADDRESS]: addresses['cosmos'] });
    // }

    return wallet;
  }

  public static async createNewWalletAccount<T extends string>(
    name: string,
    password: string,
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
    } as Key<T>;

    const keystoreEntry: { [id: string]: Key<T> } = {
      [walletId]: wallet,
    };
    await KeyChain.updateKeyChain(keystoreEntry);
    return wallet;
  }

  public static async importNewWallet<T extends string>(
    privateKey: string,
    password: string,
    chainInfos: ChainInfo[],
    addressIndex?: number,
    name?: string,
  ): Promise<Key<T>> {
    const addresses: Record<string, string> = {};
    const pubKeys: Record<string, string> = {};
    for (const chainInfo of chainInfos) {
      const wallet =
        chainInfo.coinType === '60'
          ? EthWallet.generateWalletFromPvtKey(privateKey, {
              paths: [getHDPath('60', '0')],
              addressPrefix: chainInfo.addressPrefix,
            })
          : await PvtKeyWallet.generateWallet(privateKey, chainInfo.addressPrefix);
      const [account] = await wallet.getAccounts();
      if (account) {
        addresses[chainInfo.key] = account.address;

        pubKeys[chainInfo.key] = compressPubicKey(account.pubkey);
      }
    }

    const allWallets = await KeyChain.getAllWallets();
    const walletsData = Object.values(allWallets ?? {});
    const lastIndex = walletsData.length;

    if (KeyChain.isWalletAlreadyPresent(Object.values(addresses)[0] ?? '', walletsData)) {
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
      },
    };

    KeyChain.updateKeyChain(wallet);
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

    const keyStore = storage.get(KEYCHAIN) as unknown as Keystore<T>;
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
    password: string,
    addressPrefix: string,
    coinType: string,
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
      if (coinType === '60') {
        const hdPath = getHDPath(coinType, walletData.addressIndex.toString());
        return EthWallet.generateWalletFromPvtKey(secret, { paths: [hdPath], addressPrefix });
      }
      return PvtKeyWallet.generateWallet(secret, addressPrefix);
    } else {
      const hdPath = getHDPath(coinType, walletData.addressIndex.toString());
      return generateWalletFromMnemonic(secret, hdPath, addressPrefix);
    }
  }

  private static async getAddresses(
    mnemonic: string,
    addressIndex: number,
    chainInfos: { coinType: string; addressPrefix: string; key: string }[],
  ) {
    try {
      const chainsData = chainInfos;
      const addresses: Record<string, string> = {};
      const pubKeys: Record<string, string> = {};
      for (const chainInfo of chainsData) {
        const wallet = await generateWalletFromMnemonic(
          mnemonic,
          getHDPath(chainInfo.coinType, addressIndex.toString()),
          chainInfo.addressPrefix,
        );

        const [account] = await wallet.getAccounts();
        if (account?.address && account?.pubkey) {
          addresses[chainInfo.key] = account.address;
          pubKeys[chainInfo.key] = compressPubicKey(account.pubkey);
        }
      }
      return { addresses, pubKeys };
    } catch (e) {
      throw new Error((e as Error).message);
    }
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

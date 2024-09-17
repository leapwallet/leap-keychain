export enum WALLETTYPE {
  SEED_PHRASE,
  PRIVATE_KEY,
  SEED_PHRASE_IMPORTED,
  LEDGER,
}

export type Key<T extends string> = {
  addressIndex: number;
  name: string;
  cipher: string;
  addresses: Record<T, string>;
  pubKeys?: Record<T, string>;
  walletType: WALLETTYPE;
  id: string;
  colorIndex: number;
};

export type Keystore<T extends string> = Record<string, Key<T>>;

export type CreateWalletParams = {
  name: string;
  mnemonic: string;
  password: string | Uint8Array;
  addressIndex: number;
  colorIndex: number;
  chainInfos: ChainInfo[];
  type: 'create' | 'import';
};

export type ChainInfo = {
  key: string;
  addressPrefix: string;
  coinType: string;
};

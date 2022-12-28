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

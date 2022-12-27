export type AminoMsg = {
  type: string;
  value: any;
};

export type Coin = {
  denom: string;
  amount: string;
};

export type StdFee = {
  readonly amount: readonly Coin[];
  readonly gas: string;
  readonly granter?: string;
};

export type StdSignDoc = {
  readonly chain_id: string;
  readonly account_number: string;
  readonly sequence: string;
  readonly fee: StdFee;
  readonly msgs: readonly AminoMsg[];
  readonly memo: string;
};

export type SignDoc = {
  bodyBytes: Uint8Array;
  authInfoBytes: Uint8Array;
  chainId: string;
  accountNumber: string;
};

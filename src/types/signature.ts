export type Pubkey = {
  readonly type: string;
  readonly value: any;
};

export type StdSignature = {
  readonly pub_key: Pubkey;
  readonly signature: string;
};

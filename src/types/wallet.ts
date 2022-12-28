import { EthWallet } from '../key/eth-wallet';
import { PvtKeyWallet, Wallet } from '../key/wallet';

export type WalletOptions = {
  paths: string[];
  addressPrefix: string;
};

export type LeapSigner = EthWallet | Wallet | PvtKeyWallet;

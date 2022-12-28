import Container, { Token } from 'typedi';

export type ChainInfo = {
  key: string;
  addressPrefix: string;
  coinType: string;
};

export const chainInfoToken = new Token<ChainInfo[]>('storage');

export function initChainInfo(chainInfo: ChainInfo[]) {
  Container.set(chainInfoToken, chainInfo);
}

import { Wallet } from '../src/wallet';
import { addresses, chainInfos, mnemonic } from './mockdata';

describe('generateMnemonic', () => {
  test('generates a mnemonic', () => {
    const chainData = Object.entries(chainInfos);
    for (const [key, chainInfo] of chainData) {
      const path = `m/44'/${chainInfo.coinType}'/0'/0/0`;
      const wallet = Wallet.generateWallet(mnemonic, {
        addressPrefix: chainInfo.addressPrefix,
        paths: [path],
      });
      // @ts-ignore
      expect(wallet.address).toBe(addresses[key]);
    }
  });
});

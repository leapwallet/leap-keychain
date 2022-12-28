import { Wallet } from '../src/key/wallet';
import { chainInfos, mnemonic, referenceWallets } from './mockdata';

describe('generateMnemonic', () => {
  test('generates a mnemonic', () => {
    const chainData = Object.entries(chainInfos).filter(([, chainInfo]) => chainInfo.coinType !== 60);

    for (const [key, chainInfo] of chainData) {
      const path = `m/44'/${chainInfo.coinType}'/0'/0/0`;
      const wallet = Wallet.generateWallet(mnemonic, {
        addressPrefix: chainInfo.addressPrefix,
        paths: [path],
      });
      const accounts = wallet.getAccounts();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(accounts[0]?.address).toBe(referenceWallets.ref1.addresses[key]);
    }
  });
});

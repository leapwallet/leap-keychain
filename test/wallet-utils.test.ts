import { mnemonic, chainInfos, referenceWallets, privateKey, altEvmAddresses } from './mockdata';
import { generateWalletFromMnemonic, generateWalletFromPrivateKey } from '../src/key/wallet-utils';
import { EthWallet, getFullHDPath } from '../src';
import { NETWORK } from '@scure/btc-signer';
import expect from 'expect.js';

function getWalletOptions(addressIndex: number): Record<
  string,
  {
    hdPath: string;
    addressPrefix: string;
    btcNetwork?: typeof NETWORK;
    ethWallet: boolean;
    pubKeyBech32Address?: boolean;
  }
> {
  return Object.entries(chainInfos).reduce((acc, [key, value]) => {
    const purpose = value.useBip84 ? '84' : '44';
    return {
      ...acc,
      [key]: {
        hdPath: getFullHDPath(purpose, value.coinType.toString(), addressIndex.toString()),
        addressPrefix: value.addressPrefix,
        btcNetwork: value.btcNetwork,
        ethWallet: !!value.ethWallet,
        pubKeyBech32Address: !!value.pubKeyBech32Address,
      },
    };
  }, {});
}

describe('wallet utils', () => {
  it('Generates correct wallets from mnemonic', () => {
    const addressIndex = 0;
    const walletOptions = getWalletOptions(addressIndex);
    const accounts = Object.entries(walletOptions)
      .filter(([key]) => key !== 'ethereum')
      .map(([key, walletOption]) => {
        const wallet = generateWalletFromMnemonic(mnemonic, walletOption);
        const [account] = wallet.getAccounts();
        if (!account) throw new Error();
        return {
          address: account.address,
          pubkey: account.pubkey,
          chain: key,
        };
      });

    accounts.sort((a, b) => (a.chain > b.chain ? 1 : -1));
    const addresses = accounts.reduce((acc, account) => {
      return { ...acc, [account.chain]: account.address };
    }, {});

    const { ref1 } = referenceWallets;
    expect(addresses).to.eql(ref1.addresses);
  });
  it('Generates correct wallets from private key', () => {
    const addressIndex = 0;
    const walletOptions = getWalletOptions(addressIndex);

    const accounts = Object.entries(walletOptions)
      .filter(([key]) => chainInfos[key]?.coinType === 118)
      .map(([key, walletOption]) => {
        const { hdPath, addressPrefix, btcNetwork, ethWallet, pubKeyBech32Address } = walletOption;

        const wallet = generateWalletFromPrivateKey(
          privateKey,
          hdPath,
          addressPrefix,
          btcNetwork,
          ethWallet,
          pubKeyBech32Address,
        );
        const [account] = wallet.getAccounts();
        if (!account) throw new Error();
        return {
          address: account.address,
          pubkey: account.pubkey,
          chain: key,
        };
      });

    accounts.sort((a, b) => (a.chain > b.chain ? 1 : -1));
    const addresses = accounts.reduce((acc, account) => {
      return { ...acc, [account.chain]: account.address };
    }, {});

    const { ref1 } = referenceWallets;
    for (let [key, value] of Object.entries(addresses)) {
      //@ts-expect-error: index error
      expect(value).to.eql(ref1.addresses[key]);
    }
  });
  it('Generates correct alternate addresses from mnemonic', () => {
    const walletOptions = getWalletOptions(0);
    const option = walletOptions.sei;
    if (option === undefined) throw new Error();

    const wallet = generateWalletFromMnemonic(mnemonic, option);
    const [account] = wallet.getAccounts();
    const [hexAddressAccount] = (wallet as EthWallet).getAccountWithHexAddress();

    if (!account || !hexAddressAccount) throw new Error();

    expect(account.address).to.equal(referenceWallets.ref1.addresses.sei);
    expect(hexAddressAccount.address).to.equal(altEvmAddresses.sei[0].address);
  });
  it('Generates correct alternate addresses from private key', () => {
    const walletOptions = getWalletOptions(0);
    const option = walletOptions.sei;
    if (!option) throw new Error();
    const { hdPath, addressPrefix, ethWallet, pubKeyBech32Address } = option;
    const wallet = generateWalletFromPrivateKey(
      privateKey,
      hdPath,
      addressPrefix,
      undefined,
      ethWallet,
      pubKeyBech32Address,
    );
    const [account] = wallet.getAccounts();
    const [hexAddressAccount] = (wallet as EthWallet).getAccountWithHexAddress();
    if (!account || !hexAddressAccount) throw new Error();
    expect(account.address).to.equal(referenceWallets.ref1.addresses.sei);
    expect(hexAddressAccount.address).to.equal(altEvmAddresses.sei[0].address);
  });
});

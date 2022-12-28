import { KeyChain, WALLETTYPE } from '../src';
import { mnemonic, chainInfos, privateKey, referenceWallets } from './mockdata';
import { chainInfoToken } from '../src/keychain/chainInfos';
import Container from 'typedi';
import { initStorage } from '../src/storage/storagelayer';

const { ref1, ref2 } = referenceWallets


let storageObj: any = {}
const _chainInfos = Object.entries(chainInfos).map(([key, chainInfo]) => {
  return {
    key,
    ...chainInfo
  }
})
Container.set(chainInfoToken, _chainInfos)
function setStorage(){
  initStorage({
    set: (key, value) => {
      storageObj[key] = value
      return Promise.resolve()
    },
    get: (key) => {
      return Promise.resolve(storageObj[key])
    },
    remove: (key) => {
      storageObj[key] = undefined
      return Promise.resolve()
    }
  })
}

function clearStorage() {
  storageObj = {}
}

beforeEach(() => {
  setStorage()
}, 0)


afterEach(() => {
  clearStorage()
}, 0)


describe('keychain', () => {

  test('createWalletFromMnemonic', async () => {
    const _key = await KeyChain.createWalletUsingMnemonic({
      name: 'testwallet',
      mnemonic: mnemonic,
      password: 'password',
      addressIndex: 0,
      colorIndex: 0,
    });

    const key = storageObj['keystore'][_key.id]

    expect(key.addresses).toEqual(ref1.addresses)
    expect(key.pubKeys).toEqual(ref1.pubKeys)
    expect(key.name).toEqual(ref1.name)
    expect(key.addressIndex).toEqual(ref1.addressIndex)
    expect(key.colorIndex).toEqual(ref1.colorIndex)
    expect(key.walletType).toEqual(ref1.walletType)
  });

  test('createWalletFromPrivateKey', async () => {
    const _key = await KeyChain.importNewWallet(privateKey, 'password', 0, 'privatekeywallet')
    const key = storageObj['keystore'][_key.id]

    expect(key.addresses['cosmos']).toEqual(ref1.addresses.cosmos)
    expect(key.pubKeys['cosmos']).toEqual(ref1.pubKeys.cosmos)
    expect(key.walletType).toEqual(WALLETTYPE.PRIVATE_KEY)
  })

  test('createWalletFromExistingMnemonic', async () => {
    await KeyChain.createWalletUsingMnemonic({
      name: 'testwallet',
      mnemonic: mnemonic,
      password: 'password',
      addressIndex: 0,
      colorIndex: 0,
    });

    const _key = await KeyChain.createNewWalletAccount('testwallet', 'password', 1, )

    const key = storageObj['keystore'][_key.id]
    expect(key.addresses).toEqual(ref2.addresses)
    expect(key.addressIndex).toEqual(1)
    expect(key.pubKeys).toEqual(ref2.pubKeys)
  })
});

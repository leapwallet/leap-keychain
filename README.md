# Leap Keychain

leap-keychain library includes modules for key management, account creation, and transaction signing for cosmos blockchains.

- Platforms: Browsers supporting ES6 or higher
- Module systems: ECMAScript Modules
- Programming languages: ES6 (JavaScript, TypeScript, etc. which target ES6 or higher)
- Static types: TypeScript definitions bundled


## Installation

Use one of the following methods:

- npm:
  ```shell
  npm i @leapwallet/leap-keychain
  ```
- Yarn:
  ```shell
  yarn add @leapwallet/leap-keychain
  ```

## Usage

Initialize storage and crypto modules in the top level file index.js or app.js

```javascript
import { initStorage, initCrypto } from '@leapwallet/leap-keychain';
// create a storage object
initStorage({
  set: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  get: (key) => {
    const value = localStorage.getItem(key);
    return Promise.resolve(storageObj[key]);
  },
  remove: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
});

// initialize crypto modules
initCrypto();
```

To use the keychain

```javascript

  import { KeyChain } from '@leapwallet/leap-keychain'

  // create wallet using mnemonic

  KeyChain.createWalletUsingMnemonic({
    mnemonic: "12/24 word mnemonic",
    name: "wallet name";
    password: "encryption password";
    addressIndex: "address index";
    colorIndex: "0";
    chainInfos: {
      //The 'chain infos' object includes the address prefix and coin type for the chains for which wallet creation is required.
      cosmos: {
        addressPrefix: 'cosmos',
        coinType: '118',
        key: 'cosmos'
      }
    };
  })


```

## [Security](SECURITY.md)

## [Contributing](CONTRIBUTING.md)

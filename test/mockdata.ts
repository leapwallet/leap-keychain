export const mnemonic = 'talk chat police leisure hill remember extra struggle treat utility before wine';
export const privateKey = '0x8e754bd2427d31124df0f0717eb0d4289b87ca1f789d27e41b12523879aeecf1';
export const addresses = {
  secret: 'secret18qya73yjlt28hhc3yefu3j97kgpyjj9rfd46d6',
  cosmos: 'cosmos1uput06d0xac525sdmtf4h5d8dy9d8x3u07smz9',
  osmosis: 'osmo1uput06d0xac525sdmtf4h5d8dy9d8x3u89rt5h',
  juno: 'juno1uput06d0xac525sdmtf4h5d8dy9d8x3uevnq9e',
  evmos: 'evmos1reqqp5jum0lgyjh33nyvus8dlyzspk9aw50w3r',
  injective: 'inj1reqqp5jum0lgyjh33nyvus8dlyzspk9axufyen',
};

export const referenceWallets = {
  ref1: {
    addressIndex: 0,
    addresses: {
      cosmos: 'cosmos1nqcal4r4qgfj9hhazrfpu72fx0ccdv35w698a3',
      evmos: 'evmos142nmc3rtuu40ehtdvpqlmgphhrx6ndyndrtjky',
      injective: 'inj142nmc3rtuu40ehtdvpqlmgphhrx6ndyn9tdc75',
      juno: 'juno1nqcal4r4qgfj9hhazrfpu72fx0ccdv35cgxu6d',
      osmosis: 'osmo1nqcal4r4qgfj9hhazrfpu72fx0ccdv35xpkhtr',
      secret: 'secret1gcf3qag3zf0k9sd759ttuuq287p00g4kewjdwc',
    },
    colorIndex: 0,
    name: 'testwallet',
    pubKeys: {
      cosmos: 'AwxYytPNgUq91tLoRiGBP6MGEcsghnVTeMcLKcoPSfjW',
      evmos: 'A71glojh4VpiwcFufLabwSTfkLB6lnJ3i6EAp7oOac0h',
      injective: 'A71glojh4VpiwcFufLabwSTfkLB6lnJ3i6EAp7oOac0h',
      juno: 'AwxYytPNgUq91tLoRiGBP6MGEcsghnVTeMcLKcoPSfjW',
      osmosis: 'AwxYytPNgUq91tLoRiGBP6MGEcsghnVTeMcLKcoPSfjW',
      secret: 'AnQhTZmbQZXa9MY3KhYdEE1OabdLBtEAbG/wgj0SzBEV',
    },
    walletType: 0,
  },
  ref2: {
    addressIndex: 1,
    addresses: {
      cosmos: 'cosmos1rjtukzmqtlh2u20atc9pjefk55y0h6j2y7atrj',
      evmos: 'evmos1wdlne45wt60w68pu08u2w9cyzamxglz79npune',
      injective: 'inj1wdlne45wt60w68pu08u2w9cyzamxglz7dm8kmf',
      juno: 'juno1rjtukzmqtlh2u20atc9pjefk55y0h6j2jv7syw',
      osmosis: 'osmo1rjtukzmqtlh2u20atc9pjefk55y0h6j2v9wm4q',
      secret: 'secret1v7pzm2xdytc75dxx893fnd4te80qh6nw2k9czh',
    },
    colorIndex: 1,
    name: 'Wallet 2',
    pubKeys: {
      cosmos: 'AqYABZ4+Zqqbx7zZfctmtRQs882J15WfRz3Go9QggsIA',
      evmos: 'AiuOnXAg+hvUimpEDchQfP9NmiKxgw1WaXpnQL/dvDMS',
      injective: 'AiuOnXAg+hvUimpEDchQfP9NmiKxgw1WaXpnQL/dvDMS',
      juno: 'AqYABZ4+Zqqbx7zZfctmtRQs882J15WfRz3Go9QggsIA',
      osmosis: 'AqYABZ4+Zqqbx7zZfctmtRQs882J15WfRz3Go9QggsIA',
      secret: 'AlvxQlaPKJI+25bX8I6TD6EaGbZl1f6Ngu/E9nO4KZCn',
    },
    walletType: 0,
  },
};

export const addressPrefixes = {
  cosmos: 'cosmos',
  secret: 'secret',
  osmosis: 'osmo',
  juno: 'juno',
  evmos: 'evmos',
  injective: 'inj',
};

export const coinTypes = {
  cosmos: 118,
  juno: 118,
  osmosis: 118,
  secret: 529,
  evmos: 60,
  injective: 60,
};

export const chainInfos = {
  cosmos: {
    addressPrefix: addressPrefixes.cosmos,
    coinType: coinTypes.cosmos,
  },
  evmos: {
    addressPrefix: addressPrefixes.evmos,
    coinType: coinTypes.evmos,
  },
  injective: {
    addressPrefix: addressPrefixes.injective,
    coinType: coinTypes.injective,
  },
  juno: {
    addressPrefix: addressPrefixes.juno,
    coinType: coinTypes.juno,
  },
  secret: {
    addressPrefix: addressPrefixes.secret,
    coinType: coinTypes.secret,
  },
  osmosis: {
    addressPrefix: addressPrefixes.osmosis,
    coinType: coinTypes.osmosis,
  },
};


export const testData = [
  {
    inputs: {
      accountNumber: 1,
      sequence: 0,
      bodyBytes:
        "0a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d120731323334353637",
      authInfoBytes:
        "0a4e0a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a02080112130a0d0a0575636f736d12043230303010c09a0c",
    },
    outputs: {
      signBytes:
        "0a93010a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d12073132333435363712650a4e0a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a02080112130a0d0a0575636f736d12043230303010c09a0c1a0c73696d642d74657374696e672001",
      signature:
        "c9dd20e07464d3a688ff4b710b1fbc027e495e797cfa0b4804da2ed117959227772de059808f765aa29b8f92edf30f4c2c5a438e30d3fe6897daa7141e3ce6f9",
      signedTxBytes:
        "0a93010a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d12073132333435363712650a4e0a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a02080112130a0d0a0575636f736d12043230303010c09a0c1a40c9dd20e07464d3a688ff4b710b1fbc027e495e797cfa0b4804da2ed117959227772de059808f765aa29b8f92edf30f4c2c5a438e30d3fe6897daa7141e3ce6f9",
    },
  },
  {
    inputs: {
      accountNumber: 1,
      sequence: 1,
      bodyBytes:
        "0a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d120731323334353637",
      authInfoBytes:
        "0a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a020801180112130a0d0a0575636f736d12043230303010c09a0c",
    },
    outputs: {
      signBytes:
        "0a93010a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d12073132333435363712670a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a020801180112130a0d0a0575636f736d12043230303010c09a0c1a0c73696d642d74657374696e672001",
      signature:
        "525adc7e61565a509c60497b798c549fbf217bb5cd31b24cc9b419d098cc95330c99ecc4bc72448f85c365a4e3f91299a3d40412fb3751bab82f1940a83a0a4c",
      signedTxBytes:
        "0a93010a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d12073132333435363712670a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a020801180112130a0d0a0575636f736d12043230303010c09a0c1a40525adc7e61565a509c60497b798c549fbf217bb5cd31b24cc9b419d098cc95330c99ecc4bc72448f85c365a4e3f91299a3d40412fb3751bab82f1940a83a0a4c",
    },
  },
  {
    inputs: {
      accountNumber: 1,
      sequence: 2,
      bodyBytes:
        "0a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d120731323334353637",
      authInfoBytes:
        "0a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a020801180212130a0d0a0575636f736d12043230303010c09a0c",
    },
    outputs: {
      signBytes:
        "0a93010a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d12073132333435363712670a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a020801180212130a0d0a0575636f736d12043230303010c09a0c1a0c73696d642d74657374696e672001",
      signature:
        "f3f2ca73806f2abbf6e0fe85f9b8af66f0e9f7f79051fdb8abe5bb8633b17da132e82d577b9d5f7a6dae57a144efc9ccc6eef15167b44b3b22a57240109762af",
      signedTxBytes:
        "0a93010a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d12073132333435363712670a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a020801180212130a0d0a0575636f736d12043230303010c09a0c1a40f3f2ca73806f2abbf6e0fe85f9b8af66f0e9f7f79051fdb8abe5bb8633b17da132e82d577b9d5f7a6dae57a144efc9ccc6eef15167b44b3b22a57240109762af",
    },
  },
];
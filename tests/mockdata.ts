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

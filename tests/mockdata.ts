export const mnemonic = 'humble patch void reunion inside size sun crack grab key arrest wolf';
export const addresses = {
  secret: 'secret18qya73yjlt28hhc3yefu3j97kgpyjj9rfd46d6',
  cosmos: 'cosmos1uput06d0xac525sdmtf4h5d8dy9d8x3u07smz9',
  osmosis: 'osmo1uput06d0xac525sdmtf4h5d8dy9d8x3u89rt5h',
  juno: 'juno1uput06d0xac525sdmtf4h5d8dy9d8x3uevnq9e',
  evmos: 'evmos1reqqp5jum0lgyjh33nyvus8dlyzspk9aw50w3r',
  injective: 'inj1reqqp5jum0lgyjh33nyvus8dlyzspk9axufyen',

};

export const addressPrefixes = {
  cosmos: 'cosmos',
  secret: 'secret',
  osmosis: 'osmo',
  juno: 'juno',
  evmos: 'evmos',
  injective: 'inj'
}

export const coinTypes = {
  cosmos: 118,
  juno: 118,
  osmosis: 118,
  secret: 529,
  evmos: 60,
  injective: 60
}

export const chainInfos = {
  cosmos: {
    addressPrefix: addressPrefixes.cosmos,
    coinType: coinTypes.cosmos,
  },
  evmos: {
    addressPrefix: addressPrefixes.evmos,
    coinType: coinTypes.evmos
  },
  injective: {
    addressPrefix: addressPrefixes.injective,
    coinType: coinTypes.injective
  },
  juno: {
    addressPrefix: addressPrefixes.juno,
    coinType: coinTypes.juno
  },
  secret: {
    addressPrefix: addressPrefixes.secret,
    coinType: coinTypes.secret
  }
}
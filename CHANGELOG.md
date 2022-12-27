# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.11.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.11.0) - 2022-12-20

### Changed

- Added `Carbon` and `Cudos` to `enum CosmosBlockchain`.

## [0.10.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.10.0) - 2022-12-20

### Changed

- Added `Carbon` and `Cudos` to `enum Platform`.

## [0.9.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.9.0) - 2022-12-10

### Changed

- Added `Canto` to `enum Platform`.

## [0.8.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.8.0) - 2022-11-08

### Changed

- Added the `Passage` key to `enum CosmosBlockchain`.
- Added the `SecretTokenTransaction` key to `enum CosmosTxType`.

## [0.7.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.7.0) - 2022-11-04

### Fixed

- The value of the `BitSong` key in `enum Platform`.

## [0.6.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.6.0) - 2022-10-22

### Changed

- Added the `GovVote` and `GovDeposit` keys to `enum TerraTxType`.
- Added the `Teritori` and `Stride` keys to `enum Platform`.

## [0.5.1](https://github.com/leapwallet/leap-api-js/releases/tag/v0.5.1) - 2022-10-18

### Changed

- Added `C2X`, `Regen`, `MediBloc`, and `Crescent` to `enum Platform`.
- Added the following to `enum CosmosBlockchain`:
  - `Jackal`
  - `DeFund`
  - `QuickSilver`
  - `Mars`
  - `Canto`
  - `OmniFlix`
  - `C2X`
  - `Regen`
  - `MediBloc`
  - `Gnoland`
  - `Crescent`
  - `Neutron`
  - `Teritori`
  - `Chronic`
  - `Ethos`
  - `Galaxy`

## [0.5.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.5.0) - 2022-10-11

### Removed

- `type LegacyAvalancheTxRequest`
- `enum LegacyCosmosNetwork`
- `type LegacyCosmosTxRequest`
- `type AvalancheTxRequest`
- Removed the following methods from `class LeapApi`:
  - `operateAvalancheLegacyTx`
  - `operateAvalancheTx`
  - `operateCosmosLegacyTx`

## [0.4.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.4.0) - 2022-10-11

### Changed

- `enum CosmosTxType`:
  - Renamed `TransferNative` to `Send`.
  - Renamed `TransferIbc` to `IbcSend`.
  - Renamed `Governance` to `GovVote`.
  - Renamed `Stake` to `StakeDelegate`.
  - Renamed `Unstake` to `StakeUndelegate`.
  - Renamed `Redelegate` to `StakeRedelegate`.
  - Added `StakeClaim`.
  - Added `Dapp`.

## [0.3.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.3.0) - 2022-09-24

### Added

- `enum TerraBlockchain`

### Changed

- Removed the `tokenDenomination` field in `type CosmosTxRequest`.
- Updated `type TerraTxRequest`:
  - Removed the `subtype` and `network` fields.
  - Renamed the `info` field to `metadata`.
  - Added the `blockchain` and `isMainnet` fields.
- Updated the key-value pairs in `enum TerraTxType`.

### Removed

- `enum TerraNetwork`

## [0.2.6](https://github.com/leapwallet/leap-api-js/releases/tag/v0.2.6) - 2022-09-23

### Fixed

- The `LikeCoin` key's value was incorrectly specified in `enum Platform`.

## [0.2.5](https://github.com/leapwallet/leap-api-js/releases/tag/v0.2.5) - 2022-09-12

### Changed

- Added the `Near` and `Aurora` keys to `enum Platform`.

## [0.2.4](https://github.com/leapwallet/leap-api-js/releases/tag/v0.2.4) - 2022-09-06

### Added

- `enum App`

### Changed

- Added the following optional fields to `type AvalancheTxRequest`: `fee`, `app`.
- Added the following optional fields to `type CosmosTxRequest`: `feeDenomination`, `feeQuantity`, `app`.
- Added the following optional fields to `type TerraTxRequest`: `feeDenomination`, `feeQuantity`, `app`.
- Added the following optional fields to `type EvmTxRequest`: `feeDenomination`, `feeQuantity`, `app`.
- Added the `Stride` key to `enum CosmosBlockchain`.

## [0.2.3](https://github.com/leapwallet/leap-api-js/releases/tag/v0.2.3) - 2022-08-22

### Added

- `enum Evm`
- `enum EvmTxType`
- `type EvmTxRequest`
- `class LeapApi`:
  - `operateEvmTx`

### Deprecated

- `class LeapApi`:
  - `operateAvalancheTx`: Deprecated in favor of `operateEvmTx`.

## [0.2.2](https://github.com/leapwallet/leap-api-js/releases/tag/v0.2.2) - 2022-08-21

### Changed

- Specifying native tokens now require passing the lowercase CoinGecko symbol rather than the contract address. For example, use `avax` instead of `FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z` in the `"tokens"` field of `type MarketPricesRequest`.
- Added the `BinanceSmartChain`, `Fantom`, and `Ethereum` keys to `enum Platform`.

## [0.2.1](https://github.com/leapwallet/leap-api-js/releases/tag/v0.2.1) - 2022-08-20

### Changed

- `enum CosmosTxType`: Added the `Unstake`, `Redelgate`, and `Governance` keys.
- `enum Platform`: Added the `Polygon` key.

## [0.2.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.2.0) - 2022-08-03

### Changed

- `enum Platform`:
  - Renamed the value of the `IrisNet` key from `'IRIS_NET'` to `'IRISNET'`.
  - Added `Tgrade`, `AssetMantle`, `Kujira`, and `EMoney`.
- `enum CosmosBlockchain`:
  - Renamed the `Iris = 'IRIS'` key-value pair to `IrisNet = 'IRISNET'`.
  - Renamed the `Assetmantle = 'ASSETMANTLE'` key-value pair to `AssetMantle = 'ASSET_MANTLE'`.
  - Added `Lum`, `Microtick`, `Oraichain`, `Provenance`, `Rizon`, `Sentinel`, `Shentu`, `Vidulum`, `Chihuahua`, `Decentr`, `Terra`, `GravityBridge`, `BitSong`, `Bostrom`, `Cerberus`, `Cheqd`, `ThorChain`, `Ki`, `LikeCoin`, `Desmos`, `FetchHub`, `FirmaChain`, `Band`, `Bitcanna`, and `Dig`.

## [0.1.0](https://github.com/leapwallet/leap-api-js/releases/tag/v0.1.0) - 2022-08-02

### Changed

- Added values to `enum CosmosBlockchain`.

## [0.0.15](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.15) - 2022-07-20

### Fixed

- Previously, the library had to be imported as `'@leapwallet/leap-api-js/dist/src'`. Now, it can be imported as `'@leapwallet/leap-api-js'`.

## [0.0.14](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.14) - 2022-07-19

### Added

- `class LeapApi`:
  - `operateCosmosTx`
  - `operateAvalancheTx`
- `type CosmosTxRequest`
- `enum CosmosBlockchain`
- `enum CosmosTxType`
- `type AvalancheTxRequest`
- `enum AvalancheTxType`

### Changed

- `class LeapApi`:
  - Renamed `operateCosmosTx` to `operateCosmosLegacyTx`.
  - Renamed `operateAvalancheTx` to `operateAvalancheLegacyTx`.
- Renamed `type CosmosTxRequest` to `type LegacyCosmosTxRequest`.
- Renamed `enum CosmosNetwork` to `enum LegacyCosmosNetwork`.
- Renamed `type AvalancheTxRequest` to `type LegacyAvalancheTxRequest`.

### Deprecated

- `class LeapApi`:
  - `operateCosmosLegacyTx`
  - `operateAvalancheLegacyTx`
- `type LegacyCosmosTxRequest`
- `enum LegacyCosmosNetwork`
- `type LegacyAvalancheTxRequest`

## [0.0.13](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.13) - 2022-07-17

### Changed

- `type MarketSwapValidityRequest`: The `fromQuantity` and `toQuantity` fields now accept `number`s in addition to `string`s.

## [0.0.12](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.12) - 2022-07-04

### Fixed

- `enum Currency`

## [0.0.11](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.11) - 2022-07-04

### Added

- `type LeapApiBaseUrls`
- `const productionLeapApiBaseUrls`
- `const stagingLeapApiBaseUrls`

### Changed

- `type FigmentStatusResponse`

### Removed

- `const LeapApiBaseUrls`: Removed in favor of `const productionLeapApiBaseUrls` and `const stagingLeapApiBaseUrls`.
- Updated the docs to indicate the following:
  - HTTP GET /figment/cosmos-hub: Removed in favor of HTTP GET /figment/cosmos-hub/lcd and HTTP GET /figment/cosmos-hub/rpc.
  - HTTP POST /figment/cosmos-hub: Removed in favor of HTTP POST /figment/cosmos-hub/lcd and HTTP POST /figment/cosmos-hub/rpc.
  - HTTP GET /figment/osmosis: Removed in favor of HTTP GET /figment/osmosis/lcd and HTTP GET /figment/osmosis/rpc.
  - HTTP POST /figment/osmosis: Removed in favor of HTTP POST /figment/osmosis/lcd and HTTP POST /figment/osmosis/rpc.

## [0.0.10](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.10) - 2022-07-01

### Added

- `enum Currency`

### Changed

- Added a `currency` field to the following:
  - `type MarketCapsRequest`
  - `type MarketChartRequest`
  - `type MarketPricesRequest`
  - `type MarketPercentageChangeRequest`
  - `type MarketPercentageChangesRequest`
- Added more values to `enum Platform`.
- `type FigmentStatusResponse`
- `const LeapApiBaseUrls`

### Removed

- `type FigmentProxyRequest`
- `type FigmentProxyResponse`
- The `postFigmentProxy` function has been removed from the `class LeapApi` in favor of the /figment/<BLOCKCHAIN> APIs.
- `class FigmentProxyDisabledError`

## [0.0.9](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.9) - 2022-06-29

### Added

- Added the following functions to `class LeapApi`:
  - `getMarketCaps`
- `type MarketCapsRequest`
- `type MarketCapsResponse`

### Changed

- `type MarketChartPrice`: Added a `smoothedPrice` field.

## [0.0.8](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.8) - 2022-06-24

### Added

- Added the following functions to `class LeapApi`:
  - `operateCosmosTx`
  - `operateAvalancheTx`
  - `getFigmentStatus`
  - `postFigmentProxy`
- `type AvalancheTxRequest`
- `type FigmentProxyRequest`
- `enum HttpMethod`
- `type FigmentProxyResponse`
- `class FigmentProxyDisabledError`

### Removed

- Removed the following functions from `class LeapApi`:
  - `postCosmosTx`: Use `operateCosmosTx` instead.

## [0.0.7](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.7) - 2022-06-22

### Added

- `type CosmosTxRequest`
- `enum CosmosNetwork`
- Added the following functions to `class LeapApi`:
  - `postCosmosTx`
  - `getBanner`
  - `getMarketDescription`
  - `getMarketChart`
  - `getMarketPercentageChange`
  - `getMarketPercentageChanges`
  - `getMarketSwapValidity`
  - `getMarketPrices`
  - `getTerraFeatureFlags`
  - `getTerraRewards`
  - `getTerraReferralCodeValidity`
  - `getTerraReferralCode`
  - `postTerraReferralStatus`
  - `postTerraReferralNew`

### Changed

- `type BannerRequest`
- `enum Platform`

### Removed

- `class InvalidArgumentError`: This was actually never used.
- Removed the following functions from `class LeapApi`:
  - `operateBanner`: Use `getBanner` instead.
  - `operateMarketDescription`: Use `getMarketDescription` instead.
  - `operateMarketChart`: Use `getMarketChart` instead.
  - `operateMarketPercentageChange`: Use `getMarketPercentageChange` instead.
  - `operateMarketPercentageChanges`: Use `getMarketPercentageChanges` instead.
  - `operateMarketSwapValidity`: Use `getMarketSwapValidity` instead.
  - `operateMarketPrices`: Use `getMarketPrices` instead.
  - `operateTerraFeatureFlags`: Use `getTerraFeatureFlags` instead.
  - `operateTerraRewards`: Use `getTerraRewards` instead.
  - `operateTerraReferralCodeValidity`: Use `getTerraReferralCodeValidity` instead.
  - `operateTerraReferralCode`: Use `getTerraReferralCode` instead.
  - `operateTerraReferralStatus`: Use `postTerraReferralStatus` instead.
  - `operateTerraReferralNew`: Use `postTerraReferralNew` instead.

## [0.0.6](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.6) - 2022-06-15

### Changed

- `type MarketChartPrice`:
  - The `date` field is now a `string` instead of a `Date`.
- `type TerraRewardsHistoryEntry`
  - The `date` field is now a `string` instead of a `Date`.

## [0.0.5](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.5) - 2022-06-14

### Fixed

- Renamed the field `walletAddress` to `wallet` in `type TerraReferralNewRequest`.

## [0.0.4](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.4) - 2022-06-14

### Fixed

- `operateBanner`
- `operateMarketDescription`
- `operateMarketChart`
- `operateMarketPercentageChange`
- `operateMarketPercentageChanges`
- `operateMarketSwapValidity`
- `operateMarketPrices`
- `operateTerraFeatureFlags`
- `operateTerraRewards`
- `operateTerraReferralCodeValidity`
- `operateTerraReferralCode`
- `operateTerraReferralStatus`
- `operateTerraReferralNew`
- `operateTerraTx`

## [0.0.3](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.3) - 2022-06-13

### Added

- Added the following functions to `class LeapApi`:
  - `operateMarketSwapValidity`
  - `operateMarketPrices`
  - `operateTerraFeatureFlags`
  - `operateTerraRewards`
  - `operateTerraReferralCodeValidity`
  - `operateTerraReferralCode`
  - `operateTerraReferralStatus`
  - `operateTerraReferralNew`
  - `operateTerraTx`
- Added the following `type`s:
  - `MarketSwapValidityRequest`
  - `MarketPricesRequest`
  - `MarketPricesResponse`
  - `TerraFeatureFlagsResponse`
  - `TerraRewardsRequest`
  - `TerraRewardsResponse`
  - `TerraRewardsHistoryEntry`
  - `TerraReferralCodeValidityRequest`
  - `TerraReferralCodeRequest`
  - `TerraReferralStatusRequest`
  - `TerraReferralNewRequest`
  - `TerraTxRequest`
- Added the following `enum`s:
  - `SwapValidity`
  - `TerraRewardsProgram`
  - `TerraReferralStatus`
  - `TerraNetwork`
  - `TerraTxType`
  - `TerraTxSubtype`
- Added the following errors:
  - `class NonexistingReferralCodeError`

## [0.0.2](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.2) - 2022-06-11

### Added

- `class LeapApi`:
  - `operateMarketDescription`
  - `operateMarketChart`

## [0.0.1](https://github.com/leapwallet/leap-api-js/releases/tag/v0.0.1) - 2022-06-09

### Added

- First version.

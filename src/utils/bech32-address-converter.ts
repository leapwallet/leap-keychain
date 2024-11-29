import { bech32 } from 'bech32';

export function convertAddress(address: string, prefix: string) {
  const { words } = bech32.decode(address);
  return bech32.encode(prefix, words);
}

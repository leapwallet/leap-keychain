export default function getHDPath(coinType = '118', index = '0', account = '0', chain = '0') {
  return `m/44'/${coinType}'/${account}'/${chain}/${index}`;
}

export function getFullHDPath(purpose = '44', coinType = '0', index = '0', account = '0', chain = '0') {
  return `m/${purpose}'/${coinType}'/${account}'/${chain}/${index}`;
}

export function isBtcCoinType(coinType: string) {
  return coinType === '1' || coinType === '0';
}

export function getHardenedPath(path: string) {
  const segments = path.split('/');
  const hardenedSegments = segments.map((segment) => {
    if (segment === 'm' || segment === '') return segment;
    if (segment.endsWith("'")) return segment;
    return segment + "'";
  });
  return hardenedSegments.join('/');
}

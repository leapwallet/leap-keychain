export function fromHex(hexstring: string): Uint8Array {
  if (!hexstring.match(/^[0-9a-f]{2}(?:[0-9a-f]{2})*$/i)) {
    throw new Error('hex string contains invalid characters or is not a multiple of 2');
  }

  const out = new Uint8Array(hexstring.length / 2);
  for (let i = 0; i < out.length; i++) {
    const hexByteAsString = hexstring.slice(2 * i, 2 * (i + 1));
    out[i] = parseInt(hexByteAsString, 16);
  }
  return out;
}

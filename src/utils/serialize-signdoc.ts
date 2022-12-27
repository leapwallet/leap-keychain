import { StdSignDoc } from '../types/tx';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export function sortObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, any> = {};

  for (const key of sortedKeys) {
    result[key] = sortObject(obj[key]);
  }

  return result;
}

export function serializeStdSignDoc(signDoc: StdSignDoc) {
  const json = JSON.stringify(sortObject(signDoc));
  return new TextEncoder().encode(json);
}

export function serializeSignDoc(signDoc: SignDoc) {
  console.log('logging account number and chain id', signDoc.accountNumber, signDoc.chainId);
  return SignDoc.encode(
    SignDoc.fromPartial({
      accountNumber: signDoc.accountNumber,
      authInfoBytes: signDoc.authInfoBytes,
      bodyBytes: signDoc.bodyBytes,
      chainId: signDoc.chainId,
    }),
  ).finish();
}

import { serializeSignDoc, sortObject } from '../src/utils/serialize-signdoc';
import expect from 'expect.js';
import Long from 'long';
import { testData } from './mockdata';
import { hex } from '@scure/base';

describe('serializeSignDoc', () => {
  it('should serialize sign doc', () => {
    testData.map(({ inputs, outputs }) => {
      const signBytes = serializeSignDoc({
        bodyBytes: hex.decode(inputs.bodyBytes),
        authInfoBytes: hex.decode(inputs.authInfoBytes),
        chainId: 'simd-testing',
        accountNumber: new Long(inputs.accountNumber),
      });
      expect(hex.encode(signBytes)).to.eql(outputs.signBytes);
    });
  });
  it('should sort object keys', () => {
    const object = {
      b: 1,
      a: 2,
    };

    expect(sortObject(object)).to.eql({ a: 2, b: 1 });
  });
});

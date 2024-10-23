import { encodeSecp256k1Pubkey, encodeSecp256k1Signature } from '../src';
import * as base64js from 'base64-js';
import expect from 'expect.js';

describe('encoding', function () {
  describe('public key encoding', () => {
    it('returns correct encoding type', function () {
      const pubkey = new Uint8Array([
        0x02, 0x75, 0x9f, 0x18, 0x2b, 0x3e, 0x3d, 0x29, 0x5c, 0x5d, 0x3b, 0x0d, 0x80, 0x5e, 0x8b, 0x1a, 0x4f, 0x13,
        0x75, 0x4a, 0x1d, 0x6a, 0x56, 0x37, 0x9c, 0xc8, 0x0d, 0x91, 0x1d, 0x6d, 0x51, 0x0c, 0x37,
      ]);
      const pubkey_encoded = encodeSecp256k1Pubkey(pubkey);
      expect(pubkey_encoded.type).to.equal('tendermint/PubKeySecp256k1');
    });

    it('throws error if public key of incorrect size is passed', function () {
      const pubkey = new Uint8Array([
        0x02, 0x75, 0x9f, 0x18, 0x2b, 0x3e, 0x3d, 0x29, 0x5c, 0x5d, 0x3b, 0x0d, 0x80, 0x5e, 0x8b, 0x1a, 0x4f, 0x13,
        0x75, 0x4a, 0x1d, 0x6a, 0x56, 0x37, 0x9c, 0xc8, 0x0d, 0x91, 0x1d, 0x6d, 0x51, 0x0c,
      ]);

      const t = () => {
        encodeSecp256k1Pubkey(pubkey);
      };

      expect(t).throwError();
    });

    it('throws error if public key of with incorrect starting bytes is passed', function () {
      const pubkey = new Uint8Array([
        0x80, 0x75, 0x9f, 0x18, 0x2b, 0x3e, 0x3d, 0x29, 0x5c, 0x5d, 0x3b, 0x0d, 0x80, 0x5e, 0x8b, 0x1a, 0x4f, 0x13,
        0x75, 0x4a, 0x1d, 0x6a, 0x56, 0x37, 0x9c, 0xc8, 0x0d, 0x91, 0x1d, 0x6d, 0x51, 0x0c, 0x37,
      ]);

      const t = () => {
        encodeSecp256k1Pubkey(pubkey);
      };

      expect(t).throwError();
    });
  });

  describe('signature encoding', () => {
    it('encodeSecp256k1Signature', function () {
      const pubkey = new Uint8Array(33);
      pubkey[0] = 3;
      for (let i = 1; i < 33; i++) {
        pubkey[i] = i;
      }
      const signature = new Uint8Array(64);
      for (let i = 0; i < 64; i++) {
        signature[i] = i;
      }
      const result = encodeSecp256k1Signature(pubkey, signature);
      const expected = {
        pub_key: encodeSecp256k1Pubkey(pubkey),
        signature: base64js.fromByteArray(signature),
      };
      expect(result).to.eql(expected);
    });
  });
});

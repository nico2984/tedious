import { assert } from 'chai';

import Debug from '../../../src/debug';
import { Parser } from '../../../src/token/token-stream-parser';
import { TYPE } from '../../../src/token/token';
import WritableTrackingBuffer from '../../../src/tracking-buffer/writable-tracking-buffer';
import { InternalConnectionOptions } from '../../../src/connection-options';

const debug = new Debug({ token: true });

function createDbChangeBuffer() {
  const oldDb = 'old';
  const newDb = 'new';
  const buffer = new WritableTrackingBuffer(50, 'ucs2');

  buffer.writeUInt8(TYPE.ENVCHANGE);
  buffer.writeUInt16LE(0); // Length written later
  buffer.writeUInt8(0x01); // Database
  buffer.writeUInt8(newDb.length);
  buffer.writeString(newDb);
  buffer.writeUInt8(oldDb.length);
  buffer.writeString(oldDb);

  buffer.data.writeUInt16LE(buffer.data.length - (1 + 2), 1);
  // console.log(buffer)

  return buffer.data;
}

describe('Token Stream Parser', () => {
  it('should envChange', (done) => {
    const buffer = createDbChangeBuffer();

    const parser = new Parser(debug, new InternalConnectionOptions());
    parser.on('databaseChange', function(event) {
      assert.isOk(event);
    });

    parser.addBuffer(buffer);

    assert.isOk(parser.isEnd());

    done();
  });

  it('should split token across buffers', (done) => {
    const buffer = createDbChangeBuffer();

    const parser = new Parser(debug, new InternalConnectionOptions());
    parser.on('databaseChange', function(event) {
      assert.isOk(event);
    });

    parser.addBuffer(buffer.slice(0, 6));
    parser.addBuffer(buffer.slice(6));

    assert.isOk(parser.isEnd());

    done();
  });
});
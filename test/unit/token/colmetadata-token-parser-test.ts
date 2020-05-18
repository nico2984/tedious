import { typeByName as dataTypeByName } from '../../../src/data-type';
import WritableTrackingBuffer from '../../../src/tracking-buffer/writable-tracking-buffer';
import TokenStreamParser from '../../../src/token/stream-parser';
import { assert } from 'chai';
import Debug from '../../../src/debug';
import { InternalConnectionOptions } from '../../../src/connection-options';

describe('Colmetadata Token Parser', () => {
  it('should int', () => {
    const numberOfColumns = 1;
    const userType = 2;
    const flags = 3;
    const columnName = 'name';

    const buffer = new WritableTrackingBuffer(50, 'ucs2');

    buffer.writeUInt8(0x81);
    buffer.writeUInt16LE(numberOfColumns);
    buffer.writeUInt32LE(userType);
    buffer.writeUInt16LE(flags);
    buffer.writeUInt8(dataTypeByName.Int.id);
    buffer.writeBVarchar(columnName);
    // console.log(buffer.data)

    const parser = new TokenStreamParser(new Debug(), new InternalConnectionOptions());
    parser.write(buffer.data);
    const token = parser.read();
    // console.log(token)

    assert.isOk(!token.error);
    assert.strictEqual(token.columns.length, 1);
    assert.strictEqual(token.columns[0].userType, 2);
    assert.strictEqual(token.columns[0].flags, 3);
    assert.strictEqual(token.columns[0].type.name, 'Int');
    assert.strictEqual(token.columns[0].colName, 'name');
  });

  it('should varchar', () => {
    const numberOfColumns = 1;
    const userType = 2;
    const flags = 3;
    const length = 3;
    const collation = Buffer.from([0x09, 0x04, 0x50, 0x78, 0x9a]);
    const columnName = 'name';

    const buffer = new WritableTrackingBuffer(50, 'ucs2');

    buffer.writeUInt8(0x81);
    buffer.writeUInt16LE(numberOfColumns);
    buffer.writeUInt32LE(userType);
    buffer.writeUInt16LE(flags);
    buffer.writeUInt8(dataTypeByName.VarChar.id);
    buffer.writeUInt16LE(length);
    buffer.writeBuffer(collation);
    buffer.writeBVarchar(columnName);
    // console.log(buffer)

    const parser = new TokenStreamParser(new Debug(), new InternalConnectionOptions());
    parser.write(buffer.data);
    const token = parser.read();
    // console.log(token)

    assert.isOk(!token.error);
    assert.strictEqual(token.columns.length, 1);
    assert.strictEqual(token.columns[0].userType, 2);
    assert.strictEqual(token.columns[0].flags, 3);
    assert.strictEqual(token.columns[0].type.name, 'VarChar');
    assert.strictEqual(token.columns[0].collation.lcid, 0x0409);
    assert.strictEqual(token.columns[0].collation.codepage, 'CP1257');
    assert.strictEqual(token.columns[0].collation.flags, 0x57);
    assert.strictEqual(token.columns[0].collation.version, 0x8);
    assert.strictEqual(token.columns[0].collation.sortId, 0x9a);
    assert.strictEqual(token.columns[0].colName, 'name');
    assert.strictEqual(token.columns[0].dataLength, length);
  });
});
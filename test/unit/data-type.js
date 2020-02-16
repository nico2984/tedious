const TYPES = require('../../src/data-type').typeByName;

const WritableTrackingBuffer = require('../../src/tracking-buffer/writable-tracking-buffer');
const { assert } = require('chai');

describe('BigInt', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values', function(done) {
      const value = 123456789;
      const expected = Buffer.from('0815cd5b0700000000', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length: 4 };
      TYPES.BigInt.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);

        done();
      });
    });

    it('correctly converts `string` values', function(done) {
      const value = '123456789';
      const expected = Buffer.from('0815cd5b0700000000', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length: 4 };
      TYPES.BigInt.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);

        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from([0x00]);

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length: 4 };

      TYPES.BigInt.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);

        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const expected = Buffer.from([0x26, 8]);

      const result = TYPES.BigInt.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('Binary', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `Buffer` values', function(done) {
      const value = Buffer.from([0x12, 0x34, 0x00, 0x00]);
      const expected = Buffer.from('040012340000', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length: 4 };

      TYPES.Binary.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);

        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('ffff', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length: 4 };

      TYPES.Binary.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);

        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Binary;
      const parameter = { length: 1 };

      const expected = Buffer.from([0xAD, 1, 0]);

      const result = type.generateTypeInfo(parameter);
      assert.deepEqual(result, expected);
    });
  });
});

describe('Bit', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values', function(done) {
      const value = 1;
      const expected = Buffer.from('0101', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      TYPES.Bit.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      TYPES.Bit.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `undefined` values', function(done) {
      const value = undefined;
      const expected = Buffer.from('00', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      TYPES.Bit.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const expected = Buffer.from([0x68, 1]);

      const result = TYPES.Bit.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('Char', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `Buffer` values', function(done) {
      const value = Buffer.from([0xff, 0xff, 0xff, 0xff]);
      const expected = Buffer.from('0400ffffffff', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      TYPES.Char.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('ffff', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      TYPES.Char.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const expected = Buffer.from([0xAF, 1, 0, 0x00, 0x00, 0x00, 0x00, 0x00]);

      const result = TYPES.Char.generateTypeInfo({ length: 1 });
      assert.deepEqual(result, expected);
    });
  });
});

describe('Date', function() {
  describe('.writeParameterData', function() {
    it('correctly converts dates during daylight savings period', () => {
      const type = TYPES.Date;
      for (const [value, expectedBuffer] of [
        [new Date(2015, 5, 18, 23, 59, 59), Buffer.from('03163a0b', 'hex')],
        [new Date(2015, 5, 19, 0, 0, 0), Buffer.from('03173a0b', 'hex')],
        [new Date(2015, 5, 19, 23, 59, 59), Buffer.from('03173a0b', 'hex')],
        [new Date(2015, 5, 20, 0, 0, 0), Buffer.from('03183a0b', 'hex')]
      ]) {
        const buffer = new WritableTrackingBuffer(0);
        type.writeParameterData(buffer, { value: value }, { useUTC: false }, () => { });
        assert.deepEqual(buffer.data, expectedBuffer);
      }
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Date;
      const expected = Buffer.from([0x28]);

      const result = type.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('DateTime', function() {
  describe('.writeParameterData', function() {
    it('correctly converts dates during daylight savings period', () => {
      for (const testSet of [
        [new Date(2015, 5, 18, 23, 59, 59), 42171],
        [new Date(2015, 5, 19, 0, 0, 0), 42172],
        [new Date(2015, 5, 19, 23, 59, 59), 42172],
        [new Date(2015, 5, 20, 0, 0, 0), 42173]
      ]) {
        const buffer = new WritableTrackingBuffer(0);
        const parameter = { value: testSet[0] };
        const expectedNoOfDays = testSet[1];
        TYPES.DateTime.writeParameterData(buffer, parameter, { useUTC: false }, () => { });
        assert.strictEqual(buffer.data.readInt32LE(1), expectedNoOfDays);
      }
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.DateTime;
      const expected = Buffer.from([0x6F, 8]);

      const result = type.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('DateTime2', function() {
  describe('.writeParameterData', function() {
    it('correctly converts dates during daylight savings period', () => {
      for (const [value, expectedBuffer] of [
        [new Date(2015, 5, 18, 23, 59, 59), Buffer.from('067f5101163a0b', 'hex')],
        [new Date(2015, 5, 19, 0, 0, 0), Buffer.from('06000000173a0b', 'hex')],
        [new Date(2015, 5, 19, 23, 59, 59), Buffer.from('067f5101173a0b', 'hex')],
        [new Date(2015, 5, 20, 0, 0, 0), Buffer.from('06000000183a0b', 'hex')]
      ]) {
        const buffer = new WritableTrackingBuffer(0);
        TYPES.DateTime2.writeParameterData(buffer, { value: value, scale: 0 }, { useUTC: false }, () => { });
        assert.deepEqual(buffer.data, expectedBuffer);
      }
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const expected = Buffer.from([0x2A, 1]);

      const buffer = TYPES.DateTime2.generateTypeInfo({ scale: 1 });
      assert.deepEqual(buffer, expected);
    });
  });
});

describe('DateTimeOffset', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `Date` values', function(done) {
      const value = new Date(Date.UTC(2014, 1, 14, 17, 59, 59, 999));
      const expected = Buffer.from('0820fd002d380b', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, scale: 0 };

      TYPES.DateTimeOffset.writeParameterData(buffer, parameterValue, { useUTC: true }, () => {
        assert.deepEqual(buffer.data.slice(0, 7), expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, scale: 0 };

      TYPES.DateTimeOffset.writeParameterData(buffer, parameterValue, { useUTC: true }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const expected = Buffer.from([0x2B, 1]);

      const buffer = TYPES.DateTimeOffset.generateTypeInfo({ scale: 1 });
      assert.deepEqual(buffer, expected);
    });
  });
});

describe('Decimal', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values (Precision <= 9)', function(done) {
      const value = 1.23;
      const expected = Buffer.from('050101000000', 'hex');
      const precision = 1;

      const type = TYPES.Decimal;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, precision, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `number` values (Precision <= 19)', function(done) {
      const value = 1.23;
      const expected = Buffer.from('09010100000000000000', 'hex');
      const precision = 15;

      const type = TYPES.Decimal;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, precision, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `number` values (Precision <= 28)', function(done) {
      const value = 1.23;
      const expected = Buffer.from('0d01010000000000000000000000', 'hex');
      const precision = 25;

      const type = TYPES.Decimal;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, precision, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });


    it('correctly converts `number` values (Precision > 28)', function(done) {
      const value = 1.23;
      const expected = Buffer.from('110101000000000000000000000000000000', 'hex');
      const precision = 30;

      const type = TYPES.Decimal;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, precision, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Decimal;

      // Precision <= 9
      const expected1 = Buffer.from([0x6A, 5, 1, 1]);
      const result = type.generateTypeInfo({ precision: 1, scale: 1 });
      assert.deepEqual(result, expected1);

      // Precision <= 19
      const expected2 = Buffer.from([0x6A, 9, 15, 1]);
      const result2 = type.generateTypeInfo({ precision: 15, scale: 1 });
      assert.deepEqual(result2, expected2);


      // Precision <= 28
      const expected3 = Buffer.from([0x6A, 13, 20, 1]);
      const result3 = type.generateTypeInfo({ precision: 20, scale: 1 });
      assert.deepEqual(result3, expected3);

      // Precision > 28
      const expected4 = Buffer.from([0x6A, 17, 30, 1]);
      const result4 = type.generateTypeInfo({ precision: 30, scale: 1 });
      assert.deepEqual(result4, expected4);
    });
  });
});

describe('Float', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values', function(done) {
      const value = 1.2345;
      const expected = Buffer.from('088d976e1283c0f33f', 'hex');

      const type = TYPES.Float;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00', 'hex');

      const type = TYPES.Float;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Float;
      const expected = Buffer.from([0x6D, 8]);

      const result = type.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('Image', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `Buffer` values', function(done) {
      const value = Buffer.from('010101', 'hex');
      const expected = Buffer.from('64000000010101', 'hex');

      const type = TYPES.Image;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length: 100 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('64000000', 'hex');

      const type = TYPES.Image;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length: 100 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Image;
      const expected = Buffer.from([0x22, 1, 0, 0, 0]);

      const result = type.generateTypeInfo({ length: 1 });
      assert.deepEqual(result, expected);
    });
  });
});

describe('Int', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values', function(done) {
      const value = 1234;
      const expected = Buffer.from('04d2040000', 'hex');

      const type = TYPES.Int;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00', 'hex');

      const type = TYPES.Int;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Int;
      const expected = Buffer.from([0x26, 4]);

      const result = type.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('Money', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values', function(done) {
      const value = 1234;
      const expected = Buffer.from('0800000000204bbc00', 'hex');

      const type = TYPES.Money;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00', 'hex');

      const type = TYPES.Money;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Money;
      const expected = Buffer.from([0x6E, 8]);

      const result = type.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('NChar', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `Buffer` values', function(done) {
      const value = Buffer.from([0xff, 0xff, 0xff, 0xff]);
      const expected = Buffer.from('0400ffffffff', 'hex');

      const type = TYPES.NChar;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('ffff', 'hex');

      const type = TYPES.NChar;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.NChar;
      const expected = Buffer.from([0xEF, 2, 0, 0x00, 0x00, 0x00, 0x00, 0x00]);

      const result = type.generateTypeInfo({ length: 1 });
      assert.deepEqual(result, expected);
    });
  });
});

describe('Numeric', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values (Precision <= 9)', function(done) {
      const value = 1.23;
      const expected = Buffer.from('050101000000', 'hex');
      const precision = 1;

      const type = TYPES.Numeric;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, precision, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `number` values (Precision <= 19)', function(done) {
      const value = 1.23;
      const expected = Buffer.from('09010100000000000000', 'hex');
      const precision = 15;

      const type = TYPES.Numeric;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, precision, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `number` values (Precision <= 28)', function(done) {
      const value = 1.23;
      const expected = Buffer.from('0d01010000000000000000000000', 'hex');
      const precision = 25;

      const type = TYPES.Numeric;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, precision, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `number` values (Precision > 28)', function(done) {
      const value = 1.23;
      const expected = Buffer.from('110101000000000000000000000000000000', 'hex');
      const precision = 30;

      const type = TYPES.Numeric;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, precision, scale: 0 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Numeric;

      // Precision <= 9
      const expected1 = Buffer.from([0x6C, 5, 1, 1]);
      const result = type.generateTypeInfo({ precision: 1, scale: 1 });
      assert.deepEqual(result, expected1);

      // Precision <= 19
      const expected2 = Buffer.from([0x6C, 9, 15, 1]);
      const result2 = type.generateTypeInfo({ precision: 15, scale: 1 });
      assert.deepEqual(result2, expected2);

      // Precision <= 28
      const expected3 = Buffer.from([0x6C, 13, 20, 1]);
      const result3 = type.generateTypeInfo({ precision: 20, scale: 1 });
      assert.deepEqual(result3, expected3);

      // Precision > 28
      const expected4 = Buffer.from([0x6C, 17, 30, 1]);
      const result4 = type.generateTypeInfo({ precision: 30, scale: 1 });
      assert.deepEqual(result4, expected4);
    });
  });
});

describe('NVarChar', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `Buffer` values (Length <= Maximum Length)', function(done) {
      const value = Buffer.from([0xff, 0xff]);
      const expected = Buffer.from('0200ffff', 'hex');
      const length = 1;

      const type = TYPES.NVarChar;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `Buffer` values (Length > Maximum Length)', function(done) {
      const value = Buffer.from([0xff, 0xff]);
      const expected = Buffer.from('feffffffffffffff02000000ffff00000000', 'hex');
      const length = 4100;

      const type = TYPES.NVarChar;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values (Length <= Maximum Length)', function(done) {
      const value = null;
      const expected = Buffer.from('ffff', 'hex');
      const length = 1;

      const type = TYPES.NVarChar;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values (Length > Maximum Length)', function(done) {
      const value = null;
      const expected = Buffer.from('ffffffffffffffff', 'hex');
      const length = 5000;

      const type = TYPES.NVarChar;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
    // Length <= Maximum Length
      const type = TYPES.NVarChar;
      const expected = Buffer.from([0xE7, 2, 0, 0x00, 0x00, 0x00, 0x00, 0x00]);

      const result = type.generateTypeInfo({ length: 1 });
      assert.deepEqual(result, expected);

      // Length > Maximum Length
      const expected1 = Buffer.from([0xE7, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00]);

      const result2 = type.generateTypeInfo({ length: 4100 });
      assert.deepEqual(result2, expected1);
    });
  });
});

describe('Real', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values', function(done) {
      const value = 123.123;
      const expected = Buffer.from('04fa3ef642', 'hex');

      const type = TYPES.Real;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00', 'hex');

      const type = TYPES.Real;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Real;
      const expected = Buffer.from([0x6D, 4]);

      const result = type.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('SmallDateTime', function() {
  describe('.writeParameterData', function() {
    it('correctly converts dates during daylight savings period', function() {
      for (const [value, expectedNoOfDays] of [
        [new Date(2015, 5, 18, 23, 59, 59), 42171],
        [new Date(2015, 5, 19, 0, 0, 0), 42172],
        [new Date(2015, 5, 19, 23, 59, 59), 42172],
        [new Date(2015, 5, 20, 0, 0, 0), 42173]
      ]) {
        const buffer = new WritableTrackingBuffer(0);
        TYPES.SmallDateTime.writeParameterData(buffer, { value }, { useUTC: false }, () => {});

        assert.strictEqual(buffer.buffer.readUInt16LE(1), expectedNoOfDays);
      }
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const expected = Buffer.from([0x6F, 0x04]);
      const result = TYPES.SmallDateTime.generateTypeInfo();

      assert.deepEqual(result, expected);
    });
  });
});

describe('SmallInt', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values', function(done) {
      const value = 2;
      const expected = Buffer.from('020200', 'hex');

      const type = TYPES.SmallInt;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00', 'hex');

      const type = TYPES.SmallInt;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.SmallInt;
      const expected = Buffer.from([0x26, 2]);

      const result = type.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('SmallMoney', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values', function(done) {
      const value = 2;
      const expected = Buffer.from('04204e0000', 'hex');

      const type = TYPES.SmallMoney;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00', 'hex');

      const type = TYPES.SmallMoney;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.SmallMoney;
      const expected = Buffer.from([0x6E, 4]);

      const result = type.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('Text', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `Buffer` values', function(done) {
      const value = Buffer.from('Hello World', 'ascii');
      const expected = Buffer.from('00000000000f00000048656c6c6f20576f726c64', 'hex');

      const type = TYPES.Text;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length: 15 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00000000000f000000', 'hex');

      const type = TYPES.Text;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length: 15 };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Text;
      const expected = Buffer.from([0x23, 1, 0, 0, 0]);

      const result = type.generateTypeInfo({ length: 1 });
      assert.deepEqual(result, expected);
    });
  });
});

describe('Time', function() {
  describe('.writeParameterData', function() {
    // Test rounding of nanosecondDelta
    it('correctly converts `Date` values with a `nanosecondDelta` property', () => {
      const type = TYPES.Time;
      for (const [value, nanosecondDelta, scale, expectedBuffer] of [
        [new Date(2017, 6, 29, 17, 20, 3, 503), 0.0006264, 7, Buffer.from('0568fc624b91', 'hex')],
        [new Date(2017, 9, 1, 1, 31, 4, 12), 0.0004612, 7, Buffer.from('05c422ceb80c', 'hex')],
        [new Date(2017, 7, 3, 12, 52, 28, 373), 0.0007118, 7, Buffer.from('051e94c8e96b', 'hex')]
      ]) {
        const parameter = { value: value, scale: scale };
        parameter.value.nanosecondDelta = nanosecondDelta;

        const buffer = new WritableTrackingBuffer(0);
        type.writeParameterData(buffer, parameter, { useUTC: false }, () => { });
        assert.deepEqual(buffer.data, expectedBuffer);
      }
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.Time;
      const expected = Buffer.from([0x29, 1]);

      const reuslt = type.generateTypeInfo({ scale: 1 });
      assert.deepEqual(reuslt, expected);
    });
  });
});

describe('TinyInt', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `number` values', function(done) {
      const value = 1;
      const expected = Buffer.from('0101', 'hex');

      const type = TYPES.TinyInt;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;
      const expected = Buffer.from('00', 'hex');

      const type = TYPES.TinyInt;

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      type.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const type = TYPES.TinyInt;
      const expected = Buffer.from([0x26, 1]);

      const result = type.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('TVP', function() {
  describe('.writeParameterData', function() {
    it('correctly converts TVP table values', function(done) {
      const value = {
        columns: [{ name: 'user_id', type: TYPES.Int }],
        rows: [[ 15 ]]
      };
      const expected = Buffer.from('01000000000000002604000001040f00000000', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      TYPES.TVP.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;

      const expected = Buffer.from('ffff0000', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      TYPES.TVP.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const expected = Buffer.from([0xF3, 0x00, 0x00, 0x00]);

      const result = TYPES.TVP.generateTypeInfo({ value: null });
      assert.deepEqual(result, expected);
    });
  });
});

describe('UniqueIdentifier', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `string` values', function(done) {
      const value = 'e062ae34-6de5-47f3-8ba3-29d25f77e71a';

      const expected = Buffer.from('1034ae62e0e56df3478ba329d25f77e71a', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      TYPES.UniqueIdentifier.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values', function(done) {
      const value = null;

      const expected = Buffer.from('00', 'hex');

      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value };

      TYPES.UniqueIdentifier.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      const expected = Buffer.from([0x24, 0x10]);

      const result = TYPES.UniqueIdentifier.generateTypeInfo();
      assert.deepEqual(result, expected);
    });
  });
});

describe('VarBinary', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `null` values', () => {
      for (const [value, length, expected] of [
        [null, 1, Buffer.from('ffff', 'hex')],
        [null, 9000, Buffer.from('FFFFFFFFFFFFFFFF', 'hex')]
      ]) {
        const buffer = new WritableTrackingBuffer(0);
        const parameterValue = { value, length };
        TYPES.VarBinary.writeParameterData(buffer, parameterValue, { useUTC: false }, () => { });
        assert.isTrue(buffer.data.equals(expected));
      }
    });

    it('correctly converts `number` values', () => {
      for (const [value, length, expected] of [
        [1, 1, Buffer.from('02003100', 'hex')],
      ]) {
        const buffer = new WritableTrackingBuffer(0);
        const parameterValue = { value, length };
        TYPES.VarBinary.writeParameterData(buffer, parameterValue, { useUTC: false }, () => { });
        assert.isTrue(buffer.data.equals(expected));
      }
    });

    it('correctly converts `number` values (Length <= Maximum Length)', function(done) {
      const value = 1;
      const length = 1;
      const expected = Buffer.from('02003100', 'hex');
      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      TYPES.VarBinary.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `number` values (Length > Maximum Length)', function(done) {
      const value = 1;
      const length = 9000;
      const expected = Buffer.from('feffffffffffffff02000000310000000000', 'hex');
      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      TYPES.VarBinary.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values (Length <= Maximum Length)', function(done) {
      const value = null;
      const length = 1;
      const expected = Buffer.from('ffff', 'hex');
      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      TYPES.VarBinary.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values (Length > Maximum Length)', function(done) {
      const value = null;
      const length = 9000;
      const expected = Buffer.from('FFFFFFFFFFFFFFFF', 'hex');
      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      TYPES.VarBinary.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      // Length <= Maximum Length
      const expected = Buffer.from([0xA5, 0x40, 0x1F]);

      const result = TYPES.VarBinary.generateTypeInfo({ length: 1 });
      assert.deepEqual(result, expected);

      // Length > Maximum Length
      const expected1 = Buffer.from([0xA5, 0xFF, 0xFF]);

      const result1 = TYPES.VarBinary.generateTypeInfo({ length: 8500 });
      assert.deepEqual(result1, expected1);
    });
  });
});

describe('VarChar', function() {
  describe('.writeParameterData', function() {
    it('correctly converts `string` values (Length <= Maximum Length)', function(done) {
      const value = 'hello world';
      const length = 1;
      const expected = Buffer.from('0b0068656c6c6f20776f726c64', 'hex');
      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      TYPES.VarChar.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `string` values (Length > Maximum Length)', function(done) {
      const value = 'hello world';
      const length = 9000;
      const expected = Buffer.from('feffffffffffffff0b00000068656c6c6f20776f726c6400000000', 'hex');
      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      TYPES.VarChar.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `null` values (Length <= Maximum Length)', function(done) {
      const value = null;
      const length = 1;
      const expected = Buffer.from('ffff', 'hex');
      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      TYPES.VarChar.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });

    it('correctly converts `string` values (Length > Maximum Length)', function(done) {
      const value = null;
      const length = 9000;
      const expected = Buffer.from('FFFFFFFFFFFFFFFF', 'hex');
      const buffer = new WritableTrackingBuffer(0);
      const parameterValue = { value, length };

      TYPES.VarChar.writeParameterData(buffer, parameterValue, { useUTC: false }, () => {
        assert.deepEqual(buffer.data, expected);
        done();
      });
    });
  });

  describe('.generateTypeInfo', function() {
    it('returns the correct type information', function() {
      // Length <= Maximum Length
      const expected = Buffer.from('a7401f0000000000', 'hex');

      const result = TYPES.VarChar.generateTypeInfo({ length: 1 });
      assert.deepEqual(result, expected);

      // Length > Maximum Length
      const expected1 = Buffer.from('a7ffff0000000000', 'hex');

      const result2 = TYPES.VarChar.generateTypeInfo({ length: 8500 });
      assert.deepEqual(result2, expected1);
    });
  });
});

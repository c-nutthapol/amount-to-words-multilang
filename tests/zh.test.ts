import { amountToWords } from '../src/index';

describe('Chinese (zh) Number Conversion', () => {
  describe('Basic Numbers', () => {
    test('should convert single digits', () => {
      expect(amountToWords(0, 'zh')).toBe('零元');
      expect(amountToWords(1, 'zh')).toBe('一元');
      expect(amountToWords(5, 'zh')).toBe('五元');
      expect(amountToWords(9, 'zh')).toBe('九元');
    });

    test('should convert tens', () => {
      expect(amountToWords(10, 'zh')).toBe('十元');
      expect(amountToWords(11, 'zh')).toBe('十一元');
      expect(amountToWords(20, 'zh')).toBe('二十元');
      expect(amountToWords(25, 'zh')).toBe('二十五元');
      expect(amountToWords(99, 'zh')).toBe('九十九元');
    });

    test('should convert hundreds', () => {
      expect(amountToWords(100, 'zh')).toBe('一百元');
      expect(amountToWords(101, 'zh')).toBe('一百零一元');
      expect(amountToWords(110, 'zh')).toBe('一百十元');
      expect(amountToWords(123, 'zh')).toBe('一百二十三元');
      expect(amountToWords(999, 'zh')).toBe('九百九十九元');
    });

    test('should convert thousands', () => {
      expect(amountToWords(1000, 'zh')).toBe('一千元');
      expect(amountToWords(1001, 'zh')).toBe('一千零一元');
      expect(amountToWords(1010, 'zh')).toBe('一千零十元');
      expect(amountToWords(1100, 'zh')).toBe('一千一百元');
      expect(amountToWords(1234, 'zh')).toBe('一千二百三十四元');
    });
  });

  describe('Ten Thousands (万)', () => {
    test('should convert ten thousands', () => {
      expect(amountToWords(10000, 'zh')).toBe('一万元');
      expect(amountToWords(10001, 'zh')).toBe('一万零一元');
      expect(amountToWords(10010, 'zh')).toBe('一万零十元');
      expect(amountToWords(10100, 'zh')).toBe('一万零一百元');
      expect(amountToWords(11000, 'zh')).toBe('一万一千元');
      expect(amountToWords(12345, 'zh')).toBe('一万二千三百四十五元');
    });

    test('should convert larger numbers with 万', () => {
      expect(amountToWords(100000, 'zh')).toBe('十万元');
      expect(amountToWords(123456, 'zh')).toBe('十二万三千四百五十六元');
      expect(amountToWords(999999, 'zh')).toBe('九十九万九千九百九十九元');
    });
  });

  describe('Hundreds of Millions (億)', () => {
    test('should convert hundreds of millions', () => {
      expect(amountToWords(100000000, 'zh')).toBe('一億元');
      expect(amountToWords(100000001, 'zh')).toBe('一億零一元');
      expect(amountToWords(123456789, 'zh')).toBe('一億二千三百四十五万六千七百八十九元');
    });
  });

  describe('Decimal Places (分)', () => {
    test('should convert amounts with cents', () => {
      expect(amountToWords(1.01, 'zh')).toBe('一元零一分');
      expect(amountToWords(1.10, 'zh')).toBe('一元一十分');
      expect(amountToWords(1.23, 'zh')).toBe('一元二十三分');
      expect(amountToWords(0.05, 'zh')).toBe('五分');
      expect(amountToWords(0.50, 'zh')).toBe('五十分');
      expect(amountToWords(0.99, 'zh')).toBe('九十九分');
    });

    test('should handle complex amounts with decimals', () => {
      expect(amountToWords(1234.56, 'zh')).toBe('一千二百三十四元五十六分');
      expect(amountToWords(10000.01, 'zh')).toBe('一万元零一分');
      expect(amountToWords(12345.67, 'zh')).toBe('一万二千三百四十五元六十七分');
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero in different positions', () => {
      expect(amountToWords(1001, 'zh')).toBe('一千零一元');
      expect(amountToWords(1010, 'zh')).toBe('一千零十元');
      expect(amountToWords(1100, 'zh')).toBe('一千一百元');
      expect(amountToWords(10001, 'zh')).toBe('一万零一元');
      expect(amountToWords(10010, 'zh')).toBe('一万零十元');
      expect(amountToWords(10100, 'zh')).toBe('一万零一百元');
    });

    test('should handle large numbers', () => {
      expect(amountToWords(999999999, 'zh')).toBe('九億九千九百九十九万九千九百九十九元');
      expect(amountToWords(1000000000, 'zh')).toBe('十億元');
    });
  });

  describe('Error handling', () => {
    test('throws error for negative amounts', () => {
      expect(() => amountToWords(-1, 'zh')).toThrow('金额不能是负数');
      expect(() => amountToWords(-123.45, 'zh')).toThrow('金额不能是负数');
    });

    test('throws error for non-finite numbers', () => {
      expect(() => amountToWords(Infinity, 'zh')).toThrow('金额必须是有限的数字');
      expect(() => amountToWords(-Infinity, 'zh')).toThrow('金额必须是有限的数字');
      expect(() => amountToWords(NaN, 'zh')).toThrow('金额必须是有限的数字');
    });
  });

  describe('Rounding', () => {
    test('should properly round cents', () => {
      expect(amountToWords(1.234, 'zh')).toBe('一元二十三分');
      expect(amountToWords(1.235, 'zh')).toBe('一元二十四分');
      expect(amountToWords(1.999, 'zh')).toBe('二元');
    });
  });
});

import { amountToWords, enConverter } from '../src/index';

describe('English Converter', () => {
  describe('Basic functionality', () => {
    test('converts zero correctly', () => {
      expect(amountToWords(0, 'en')).toBe('zero dollars');
    });

    test('converts one dollar correctly', () => {
      expect(amountToWords(1, 'en')).toBe('one dollar');
    });

    test('converts multiple dollars correctly', () => {
      expect(amountToWords(2, 'en')).toBe('two dollars');
      expect(amountToWords(10, 'en')).toBe('ten dollars');
      expect(amountToWords(100, 'en')).toBe('one hundred dollars');
    });

    test('converts cents correctly', () => {
      expect(amountToWords(0.01, 'en')).toBe('zero dollars and one cent');
      expect(amountToWords(0.99, 'en')).toBe('zero dollars and ninety-nine cents');
      expect(amountToWords(1.01, 'en')).toBe('one dollar and one cent');
      expect(amountToWords(1.99, 'en')).toBe('one dollar and ninety-nine cents');
    });
  });

  describe('Complex numbers', () => {
    test('converts teens correctly', () => {
      expect(amountToWords(11, 'en')).toBe('eleven dollars');
      expect(amountToWords(15, 'en')).toBe('fifteen dollars');
      expect(amountToWords(19, 'en')).toBe('nineteen dollars');
    });

    test('converts compound numbers correctly', () => {
      expect(amountToWords(21, 'en')).toBe('twenty-one dollars');
      expect(amountToWords(37, 'en')).toBe('thirty-seven dollars');
      expect(amountToWords(99, 'en')).toBe('ninety-nine dollars');
    });

    test('converts hundreds correctly', () => {
      expect(amountToWords(101, 'en')).toBe('one hundred one dollars');
      expect(amountToWords(321, 'en')).toBe('three hundred twenty-one dollars');
      expect(amountToWords(999, 'en')).toBe('nine hundred ninety-nine dollars');
    });

    test('converts thousands correctly', () => {
      expect(amountToWords(1000, 'en')).toBe('one thousand dollars');
      expect(amountToWords(1234, 'en')).toBe('one thousand two hundred thirty-four dollars');
      expect(amountToWords(12345, 'en')).toBe('twelve thousand three hundred forty-five dollars');
    });

    test('converts large numbers correctly', () => {
      expect(amountToWords(1000000, 'en')).toBe('one million dollars');
      expect(amountToWords(1234567890, 'en')).toBe('one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety dollars');
    });
  });

  describe('Floating point precision', () => {
    test('handles floating point precision issues', () => {
      expect(amountToWords(0.1 + 0.2, 'en')).toBe('zero dollars and thirty cents');
      expect(amountToWords(1.005, 'en')).toBe('one dollar and one cent');
      expect(amountToWords(9.99, 'en')).toBe('nine dollars and ninety-nine cents');
    });
  });

  describe('Error handling', () => {
    test('throws error for negative amounts', () => {
      expect(() => amountToWords(-1, 'en')).toThrow('Amount cannot be negative');
    });

    test('throws error for non-finite numbers', () => {
      expect(() => amountToWords(Infinity, 'en')).toThrow('Amount must be a finite number');
      expect(() => amountToWords(NaN, 'en')).toThrow('Amount must be a finite number');
    });

    test('throws error for very large numbers', () => {
      expect(() => amountToWords(1e15, 'en')).toThrow('Amount too large');
    });

    test('throws error for non-number input', () => {
      expect(() => amountToWords('100' as any, 'en')).toThrow('Amount must be a number');
    });
  });

  describe('Direct converter usage', () => {
    test('can use converter directly', () => {
      expect(enConverter.convert(1234.56)).toBe('one thousand two hundred thirty-four dollars and fifty-six cents');
    });
  });
});

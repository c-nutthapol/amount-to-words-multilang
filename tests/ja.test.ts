import { amountToWords, jaConverter } from '../src/index';

describe('Japanese Converter', () => {
  describe('Basic functionality', () => {
    test('converts zero correctly', () => {
      expect(amountToWords(0, 'ja')).toBe('ぜろえん');
    });

    test('converts one yen correctly', () => {
      expect(amountToWords(1, 'ja')).toBe('いちえん');
    });

    test('converts multiple yen correctly', () => {
      expect(amountToWords(2, 'ja')).toBe('にえん');
      expect(amountToWords(10, 'ja')).toBe('じゅうえん');
      expect(amountToWords(100, 'ja')).toBe('ひゃくえん');
    });

    test('converts sen correctly', () => {
      expect(amountToWords(0.01, 'ja')).toBe('ぜろえんいちせん');
      expect(amountToWords(0.99, 'ja')).toBe('ぜろえんきゅうじゅうきゅうせん');
      expect(amountToWords(1.01, 'ja')).toBe('いちえんいちせん');
    });
  });

  describe('Japanese special readings', () => {
    test('handles special hundred readings', () => {
      expect(amountToWords(300, 'ja')).toBe('さんびゃくえん');
      expect(amountToWords(600, 'ja')).toBe('ろっぴゃくえん');
      expect(amountToWords(800, 'ja')).toBe('はっぴゃくえん');
    });

    test('handles special thousand readings', () => {
      expect(amountToWords(3000, 'ja')).toBe('さんぜんえん');
      expect(amountToWords(8000, 'ja')).toBe('はっせんえん');
    });

    test('handles regular hundreds and thousands', () => {
      expect(amountToWords(100, 'ja')).toBe('ひゃくえん');
      expect(amountToWords(200, 'ja')).toBe('にひゃくえん');
      expect(amountToWords(400, 'ja')).toBe('よんひゃくえん');
      expect(amountToWords(1000, 'ja')).toBe('せんえん');
      expect(amountToWords(2000, 'ja')).toBe('にせんえん');
    });
  });

  describe('Japanese number system', () => {
    test('handles tens correctly', () => {
      expect(amountToWords(10, 'ja')).toBe('じゅうえん');
      expect(amountToWords(20, 'ja')).toBe('にじゅうえん');
      expect(amountToWords(30, 'ja')).toBe('さんじゅうえん');
      expect(amountToWords(90, 'ja')).toBe('きゅうじゅうえん');
    });

    test('handles man (10,000) correctly', () => {
      expect(amountToWords(10000, 'ja')).toBe('いちまんえん');
      expect(amountToWords(20000, 'ja')).toBe('にまんえん');
      expect(amountToWords(12345, 'ja')).toBe('いちまんにせんさんびゃくよんじゅうごえん');
    });

    test('handles oku (100,000,000) correctly', () => {
      expect(amountToWords(100000000, 'ja')).toBe('いちおくえん');
      expect(amountToWords(200000000, 'ja')).toBe('におくえん');
      expect(amountToWords(123456789, 'ja')).toBe('いちおくにせんさんびゃくよんじゅうごまんろくせんななひゃくはちじゅうきゅうえん');
    });
  });

  describe('Complex numbers', () => {
    test('converts complex amounts correctly', () => {
      expect(amountToWords(1234.56, 'ja')).toBe('せんにひゃくさんじゅうよんえんごじゅうろくせん');
      expect(amountToWords(12345.67, 'ja')).toBe('いちまんにせんさんびゃくよんじゅうごえんろくじゅうななせん');
    });

    test('handles compound numbers correctly', () => {
      expect(amountToWords(11, 'ja')).toBe('じゅういちえん');
      expect(amountToWords(21, 'ja')).toBe('にじゅういちえん');
      expect(amountToWords(101, 'ja')).toBe('ひゃくいちえん');
      expect(amountToWords(111, 'ja')).toBe('ひゃくじゅういちえん');
    });
  });

  describe('Error handling', () => {
    test('throws error for negative amounts', () => {
      expect(() => amountToWords(-1, 'ja')).toThrow('金額は負の値にできません');
    });

    test('throws error for non-finite numbers', () => {
      expect(() => amountToWords(Infinity, 'ja')).toThrow('金額は有限数である必要があります');
      expect(() => amountToWords(NaN, 'ja')).toThrow('金額は有限数である必要があります');
    });

    test('throws error for very large numbers', () => {
      expect(() => amountToWords(1e12, 'ja')).toThrow('金額が大きすぎます');
    });
  });

  describe('Direct converter usage', () => {
    test('can use converter directly', () => {
      expect(jaConverter.convert(1234.56)).toBe('せんにひゃくさんじゅうよんえんごじゅうろくせん');
    });
  });
});

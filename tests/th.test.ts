import { amountToWords, thConverter } from '../src/index';

describe('Thai Converter', () => {
  describe('Basic functionality', () => {
    test('converts zero correctly', () => {
      expect(amountToWords(0, 'th')).toBe('ศูนย์บาทถ้วน');
    });

    test('converts one baht correctly', () => {
      expect(amountToWords(1, 'th')).toBe('หนึ่งบาทถ้วน');
    });

    test('converts multiple baht correctly', () => {
      expect(amountToWords(2, 'th')).toBe('สองบาทถ้วน');
      expect(amountToWords(10, 'th')).toBe('สิบบาทถ้วน');
      expect(amountToWords(100, 'th')).toBe('หนึ่งร้อยบาทถ้วน');
    });

    test('converts satang correctly', () => {
      expect(amountToWords(0.01, 'th')).toBe('ศูนย์บาทหนึ่งสตางค์');
      expect(amountToWords(0.25, 'th')).toBe('ศูนย์บาทยี่สิบห้าสตางค์');
      expect(amountToWords(0.99, 'th')).toBe('ศูนย์บาทเก้าสิบเก้าสตางค์');
    });
  });

  describe('Thai special grammar rules', () => {
    test('handles "เอ็ด" correctly', () => {
      expect(amountToWords(11, 'th')).toBe('สิบเอ็ดบาทถ้วน');
      expect(amountToWords(21, 'th')).toBe('ยี่สิบเอ็ดบาทถ้วน');
      expect(amountToWords(101, 'th')).toBe('หนึ่งร้อยเอ็ดบาทถ้วน');
      expect(amountToWords(1001, 'th')).toBe('หนึ่งพันเอ็ดบาทถ้วน');
    });

    test('handles "ยี่สิบ" correctly', () => {
      expect(amountToWords(20, 'th')).toBe('ยี่สิบบาทถ้วน');
      expect(amountToWords(22, 'th')).toBe('ยี่สิบสองบาทถ้วน');
      expect(amountToWords(29, 'th')).toBe('ยี่สิบเก้าบาทถ้วน');
    });

    test('handles tens correctly', () => {
      expect(amountToWords(10, 'th')).toBe('สิบบาทถ้วน');
      expect(amountToWords(30, 'th')).toBe('สามสิบบาทถ้วน');
      expect(amountToWords(40, 'th')).toBe('สี่สิบบาทถ้วน');
      expect(amountToWords(50, 'th')).toBe('ห้าสิบบาทถ้วน');
    });
  });

  describe('Complex numbers', () => {
    test('converts hundreds correctly', () => {
      expect(amountToWords(200, 'th')).toBe('สองร้อยบาทถ้วน');
      expect(amountToWords(321, 'th')).toBe('สามร้อยยี่สิบเอ็ดบาทถ้วน');
      expect(amountToWords(999, 'th')).toBe('เก้าร้อยเก้าสิบเก้าบาทถ้วน');
    });

    test('converts thousands correctly', () => {
      expect(amountToWords(1000, 'th')).toBe('หนึ่งพันบาทถ้วน');
      expect(amountToWords(1234, 'th')).toBe('หนึ่งพันสองร้อยสามสิบสี่บาทถ้วน');
      expect(amountToWords(12345, 'th')).toBe('หนึ่งหมื่นสองพันสามร้อยสี่สิบห้าบาทถ้วน');
    });

    test('converts large numbers correctly', () => {
      expect(amountToWords(100000, 'th')).toBe('หนึ่งแสนบาทถ้วน');
      expect(amountToWords(1000000, 'th')).toBe('หนึ่งล้านบาทถ้วน');
      expect(amountToWords(1000000000, 'th')).toBe('หนึ่งพันล้านบาทถ้วน');
    });
  });

  describe('Mixed amounts', () => {
    test('converts amounts with both baht and satang', () => {
      expect(amountToWords(1234.56, 'th')).toBe('หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบหกสตางค์');
      expect(amountToWords(11.11, 'th')).toBe('สิบเอ็ดบาทสิบเอ็ดสตางค์');
      expect(amountToWords(21.21, 'th')).toBe('ยี่สิบเอ็ดบาทยี่สิบเอ็ดสตางค์');
    });
  });

  describe('Error handling', () => {
    test('throws error for negative amounts', () => {
      expect(() => amountToWords(-1, 'th')).toThrow('จำนวนเงินไม่สามารถเป็นค่าลบได้');
    });

    test('throws error for non-finite numbers', () => {
      expect(() => amountToWords(Infinity, 'th')).toThrow('จำนวนเงินต้องเป็นตัวเลขที่ถูกต้อง');
      expect(() => amountToWords(NaN, 'th')).toThrow('จำนวนเงินต้องเป็นตัวเลขที่ถูกต้อง');
    });

    test('throws error for very large numbers', () => {
      expect(() => amountToWords(1e12, 'th')).toThrow('จำนวนเงินใหญ่เกินไป');
    });
  });

  describe('Direct converter usage', () => {
    test('can use converter directly', () => {
      expect(thConverter.convert(1234.56)).toBe('หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบหกสตางค์');
    });
  });
});

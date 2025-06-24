import { PersianConverter } from '../src/locales/fa';
import { amountToWords } from '../src/index';

describe('Persian Converter', () => {
  const converter = new PersianConverter();

  describe('Basic functionality', () => {
    it('converts zero correctly', () => {
      expect(converter.convert(0)).toBe('صفر یورو');
      expect(amountToWords(0, 'fa')).toBe('صفر یورو');
    });

    it('converts one euro correctly', () => {
      expect(converter.convert(1)).toBe('یک یورو');
      expect(amountToWords(1, 'fa')).toBe('یک یورو');
    });

    it('converts multiple euros correctly', () => {
      expect(converter.convert(2)).toBe('دو یورو');
      expect(converter.convert(5)).toBe('پنج یورو');
      expect(amountToWords(10, 'fa')).toBe('ده یورو');
    });

    it('converts سنت correctly', () => {
      expect(converter.convert(0.01)).toBe('صفر یورو یک سنت');
      expect(converter.convert(0.25)).toBe('صفر یورو بیست و پنج سنت');
      expect(amountToWords(0.99, 'fa')).toBe('صفر یورو نود و نه سنت');
    });
  });

  describe('Persian number system', () => {
    it('handles teens correctly', () => {
      expect(converter.convert(11)).toBe('یازده یورو');
      expect(converter.convert(15)).toBe('پانزده یورو');
      expect(converter.convert(19)).toBe('نوزده یورو');
    });

    it('handles tens with "و" correctly', () => {
      expect(converter.convert(21)).toBe('بیست و یک یورو');
      expect(converter.convert(42)).toBe('چهل و دو یورو');
      expect(converter.convert(87)).toBe('هشتاد و هفت یورو');
    });

    it('handles exact tens correctly', () => {
      expect(converter.convert(20)).toBe('بیست یورو');
      expect(converter.convert(30)).toBe('سی یورو');
      expect(converter.convert(50)).toBe('پنجاه یورو');
      expect(converter.convert(90)).toBe('نود یورو');
    });
  });

  describe('Hundreds and thousands', () => {
    it('handles hundreds correctly', () => {
      expect(converter.convert(100)).toBe('یکصد یورو');
      expect(converter.convert(200)).toBe('دویست یورو');
      expect(converter.convert(500)).toBe('پانصد یورو');
      expect(converter.convert(101)).toBe('یکصد و یک یورو');
    });

    it('handles thousands correctly', () => {
      expect(converter.convert(1000)).toBe('هزار یورو');
      expect(converter.convert(2000)).toBe('دو هزار یورو');
      expect(converter.convert(5000)).toBe('پنج هزار یورو');
      expect(converter.convert(1001)).toBe('هزار و یک یورو');
    });

    it('handles millions correctly', () => {
      expect(converter.convert(1000000)).toBe('یک میلیون یورو');
      expect(converter.convert(2000000)).toBe('دو میلیون یورو');
      expect(converter.convert(1000001)).toBe('یک میلیون و یک یورو');
    });

    it('handles billions correctly', () => {
      expect(converter.convert(1000000000)).toBe('یک میلیارد یورو');
      expect(converter.convert(2000000000)).toBe('دو میلیارد یورو');
    });
  });

  describe('Complex numbers', () => {
    it('converts complex amounts correctly', () => {
      expect(converter.convert(1234.56)).toBe('یک هزار و دویست و سی و چهار یورو پنجاه و شش سنت');
      expect(converter.convert(999.99)).toBe('نهصد و نود و نه یورو نود و نه سنت');
    });

    it('handles mixed euros and سنت', () => {
      expect(converter.convert(12.34)).toBe('دوازده یورو سی و چهار سنت');
      expect(converter.convert(100.50)).toBe('یکصد یورو پنجاه سنت');
    });
  });

  describe('Persian specific features', () => {
    it('uses correct Persian hundreds', () => {
      expect(converter.convert(300)).toBe('سیصد یورو');
      expect(converter.convert(600)).toBe('ششصد یورو');
      expect(converter.convert(800)).toBe('هشتصد یورو');
    });

    it('handles compound numbers with "و"', () => {
      expect(converter.convert(123)).toBe('یکصد و بیست و سه یورو');
      expect(converter.convert(456)).toBe('چهارصد و پنجاه و شش یورو');
    });
  });

  describe('Error handling', () => {
    it('throws error for negative amounts', () => {
      expect(() => converter.convert(-1)).toThrow('Amount must be a non-negative finite number');
      expect(() => amountToWords(-5, 'fa')).toThrow();
    });

    it('throws error for non-finite numbers', () => {
      expect(() => converter.convert(Infinity)).toThrow('Amount must be a non-negative finite number');
      expect(() => converter.convert(NaN)).toThrow('Amount must be a non-negative finite number');
    });

    it('throws error for very large numbers', () => {
      expect(() => converter.convert(1000000000000)).toThrow('Amount too large');
    });
  });

  describe('Direct converter usage', () => {
    it('can use converter directly', () => {
      expect(converter.convert(42.50)).toBe('چهل و دو یورو پنجاه سنت');
    });
  });
});

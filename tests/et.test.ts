import { EstonianConverter } from '../src/locales/et';
import { amountToWords } from '../src/index';

describe('Estonian Converter', () => {
  const converter = new EstonianConverter();

  describe('Basic functionality', () => {
    it('converts zero correctly', () => {
      expect(converter.convert(0)).toBe('null eurot');
      expect(amountToWords(0, 'et')).toBe('null eurot');
    });

    it('converts one euro correctly', () => {
      expect(converter.convert(1)).toBe('üks euro');
      expect(amountToWords(1, 'et')).toBe('üks euro');
    });

    it('converts multiple euros correctly', () => {
      expect(converter.convert(2)).toBe('kaks eurot');
      expect(converter.convert(5)).toBe('viis eurot');
      expect(amountToWords(10, 'et')).toBe('kümme eurot');
    });

    it('converts cents correctly', () => {
      expect(converter.convert(0.01)).toBe('null eurot üks sent');
      expect(converter.convert(0.25)).toBe('null eurot kakskümmend viis senti');
      expect(amountToWords(0.99, 'et')).toBe('null eurot üheksakümmend üheksa senti');
    });
  });

  describe('Estonian number system', () => {
    it('handles teens correctly', () => {
      expect(converter.convert(11)).toBe('üksteist eurot');
      expect(converter.convert(15)).toBe('viisteist eurot');
      expect(converter.convert(19)).toBe('üheksateist eurot');
    });

    it('handles tens correctly', () => {
      expect(converter.convert(20)).toBe('kakskümmend eurot');
      expect(converter.convert(30)).toBe('kolmkümmend eurot');
      expect(converter.convert(90)).toBe('üheksakümmend eurot');
    });

    it('handles compound numbers correctly', () => {
      expect(converter.convert(21)).toBe('kakskümmend üks euro');
      expect(converter.convert(42)).toBe('nelikümmend kaks eurot');
      expect(converter.convert(87)).toBe('kaheksakümmend seitse eurot');
    });
  });

  describe('Hundreds and thousands', () => {
    it('handles hundreds correctly', () => {
      expect(converter.convert(100)).toBe('sada eurot');
      expect(converter.convert(200)).toBe('kaks sada eurot');
      expect(converter.convert(500)).toBe('viis sada eurot');
      expect(converter.convert(101)).toBe('sada üks euro');
    });

    it('handles thousands correctly', () => {
      expect(converter.convert(1000)).toBe('tuhat eurot');
      expect(converter.convert(2000)).toBe('kaks tuhat eurot');
      expect(converter.convert(5000)).toBe('viis tuhat eurot');
      expect(converter.convert(1001)).toBe('tuhat üks euro');
    });

    it('handles millions correctly', () => {
      expect(converter.convert(1000000)).toBe('miljon eurot');
      expect(converter.convert(2000000)).toBe('kaks miljonit eurot');
      expect(converter.convert(1000001)).toBe('miljon üks euro');
    });
  });

  describe('Complex numbers', () => {
    it('converts complex amounts correctly', () => {
      expect(converter.convert(1234.56)).toBe('tuhat kaks sada kolmkümmend neli eurot viiskümmend kuus senti');
      expect(converter.convert(999.99)).toBe('üheksa sada üheksakümmend üheksa eurot üheksakümmend üheksa senti');
    });

    it('handles mixed euros and cents', () => {
      expect(converter.convert(12.34)).toBe('kaksteist eurot kolmkümmend neli senti');
      expect(converter.convert(100.50)).toBe('sada eurot viiskümmend senti');
    });
  });

  describe('Error handling', () => {
    it('throws error for negative amounts', () => {
      expect(() => converter.convert(-1)).toThrow('Amount must be a non-negative finite number');
      expect(() => amountToWords(-5, 'et')).toThrow();
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
      expect(converter.convert(42.50)).toBe('nelikümmend kaks eurot viiskümmend senti');
    });
  });
});

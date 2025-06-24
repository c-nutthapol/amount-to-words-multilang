import { SpanishConverter } from '../src/locales/es';
import { amountToWords } from '../src/index';

describe('Spanish Converter', () => {
  const converter = new SpanishConverter();

  describe('Basic functionality', () => {
    it('converts zero correctly', () => {
      expect(converter.convert(0)).toBe('cero euros');
      expect(amountToWords(0, 'es')).toBe('cero euros');
    });

    it('converts one euro correctly', () => {
      expect(converter.convert(1)).toBe('uno euro');
      expect(amountToWords(1, 'es')).toBe('uno euro');
    });

    it('converts multiple euros correctly', () => {
      expect(converter.convert(2)).toBe('dos euros');
      expect(converter.convert(5)).toBe('cinco euros');
      expect(amountToWords(10, 'es')).toBe('diez euros');
    });

    it('converts céntimos correctly', () => {
      expect(converter.convert(0.01)).toBe('cero euros uno céntimo');
      expect(converter.convert(0.25)).toBe('cero euros veinticinco céntimos');
      expect(amountToWords(0.99, 'es')).toBe('cero euros noventa y nueve céntimos');
    });
  });

  describe('Spanish special number rules', () => {
    it('handles twenties correctly', () => {
      expect(converter.convert(21)).toBe('veintiuno euros');
      expect(converter.convert(22)).toBe('veintidós euros');
      expect(converter.convert(25)).toBe('veinticinco euros');
      expect(converter.convert(29)).toBe('veintinueve euros');
    });

    it('handles tens with "y" correctly', () => {
      expect(converter.convert(31)).toBe('treinta y uno euros');
      expect(converter.convert(42)).toBe('cuarenta y dos euros');
      expect(converter.convert(87)).toBe('ochenta y siete euros');
    });

    it('handles exact tens correctly', () => {
      expect(converter.convert(30)).toBe('treinta euros');
      expect(converter.convert(50)).toBe('cincuenta euros');
      expect(converter.convert(90)).toBe('noventa euros');
    });
  });

  describe('Hundreds', () => {
    it('handles "cien" vs "ciento" correctly', () => {
      expect(converter.convert(100)).toBe('cien euros');
      expect(converter.convert(101)).toBe('ciento uno euros');
      expect(converter.convert(150)).toBe('ciento cincuenta euros');
    });

    it('handles other hundreds correctly', () => {
      expect(converter.convert(200)).toBe('doscientos euros');
      expect(converter.convert(300)).toBe('trescientos euros');
      expect(converter.convert(500)).toBe('quinientos euros');
      expect(converter.convert(900)).toBe('novecientos euros');
    });
  });

  describe('Thousands and millions', () => {
    it('handles thousands correctly', () => {
      expect(converter.convert(1000)).toBe('mil euros');
      expect(converter.convert(2000)).toBe('dos mil euros');
      expect(converter.convert(5000)).toBe('cinco mil euros');
      expect(converter.convert(1001)).toBe('mil uno euros');
    });

    it('handles millions correctly', () => {
      expect(converter.convert(1000000)).toBe('un millón euros');
      expect(converter.convert(2000000)).toBe('dos millones euros');
      expect(converter.convert(1000001)).toBe('un millón uno euros');
    });

    it('handles billions correctly', () => {
      expect(converter.convert(1000000000)).toBe('mil millones euros');
      expect(converter.convert(2000000000)).toBe('dos mil millones euros');
    });
  });

  describe('Complex numbers', () => {
    it('converts complex amounts correctly', () => {
      expect(converter.convert(1234.56)).toBe('mil doscientos treinta y cuatro euros cincuenta y seis céntimos');
      expect(converter.convert(999.99)).toBe('novecientos noventa y nueve euros noventa y nueve céntimos');
    });

    it('handles mixed euros and céntimos', () => {
      expect(converter.convert(12.34)).toBe('doce euros treinta y cuatro céntimos');
      expect(converter.convert(100.50)).toBe('cien euros cincuenta céntimos');
    });
  });

  describe('Error handling', () => {
    it('throws error for negative amounts', () => {
      expect(() => converter.convert(-1)).toThrow('Amount must be a non-negative finite number');
      expect(() => amountToWords(-5, 'es')).toThrow();
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
      expect(converter.convert(42.50)).toBe('cuarenta y dos euros cincuenta céntimos');
    });
  });
});

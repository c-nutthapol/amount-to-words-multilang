import { amountToWords, frConverter } from '../src/index';

describe('French Converter', () => {
  describe('Basic functionality', () => {
    test('converts zero correctly', () => {
      expect(amountToWords(0, 'fr')).toBe('zéro euro');
    });

    test('converts one euro correctly', () => {
      expect(amountToWords(1, 'fr')).toBe('un euro');
    });

    test('converts multiple euros correctly', () => {
      expect(amountToWords(2, 'fr')).toBe('deux euros');
      expect(amountToWords(10, 'fr')).toBe('dix euros');
      expect(amountToWords(100, 'fr')).toBe('cent euros');
    });

    test('converts centimes correctly', () => {
      expect(amountToWords(0.01, 'fr')).toBe('zéro euro et un centime');
      expect(amountToWords(0.99, 'fr')).toBe('zéro euro et quatre-vingt-dix-neuf centimes');
      expect(amountToWords(1.01, 'fr')).toBe('un euro et un centime');
      expect(amountToWords(1.99, 'fr')).toBe('un euro et quatre-vingt-dix-neuf centimes');
    });
  });

  describe('French special number rules', () => {
    test('handles seventies correctly', () => {
      expect(amountToWords(70, 'fr')).toBe('soixante-dix euros');
      expect(amountToWords(71, 'fr')).toBe('soixante et onze euros');
      expect(amountToWords(72, 'fr')).toBe('soixante-douze euros');
      expect(amountToWords(79, 'fr')).toBe('soixante-dix-neuf euros');
    });

    test('handles eighties correctly', () => {
      expect(amountToWords(80, 'fr')).toBe('quatre-vingts euros');
      expect(amountToWords(81, 'fr')).toBe('quatre-vingt-un euros');
      expect(amountToWords(89, 'fr')).toBe('quatre-vingt-neuf euros');
    });

    test('handles nineties correctly', () => {
      expect(amountToWords(90, 'fr')).toBe('quatre-vingt-dix euros');
      expect(amountToWords(91, 'fr')).toBe('quatre-vingt-onze euros');
      expect(amountToWords(99, 'fr')).toBe('quatre-vingt-dix-neuf euros');
    });

    test('handles "et" in compound numbers', () => {
      expect(amountToWords(21, 'fr')).toBe('vingt et un euros');
      expect(amountToWords(31, 'fr')).toBe('trente et un euros');
      expect(amountToWords(41, 'fr')).toBe('quarante et un euros');
      expect(amountToWords(51, 'fr')).toBe('cinquante et un euros');
      expect(amountToWords(61, 'fr')).toBe('soixante et un euros');
    });
  });

  describe('Hundreds and plural rules', () => {
    test('handles hundreds correctly', () => {
      expect(amountToWords(100, 'fr')).toBe('cent euros');
      expect(amountToWords(200, 'fr')).toBe('deux cents euros');
      expect(amountToWords(300, 'fr')).toBe('trois cents euros');
      expect(amountToWords(201, 'fr')).toBe('deux cent un euros');
      expect(amountToWords(301, 'fr')).toBe('trois cent un euros');
    });

    test('handles thousands correctly', () => {
      expect(amountToWords(1000, 'fr')).toBe('mille euros');
      expect(amountToWords(2000, 'fr')).toBe('deux mille euros');
      expect(amountToWords(1001, 'fr')).toBe('mille un euros');
      expect(amountToWords(1234, 'fr')).toBe('mille deux cent trente-quatre euros');
    });

    test('handles millions correctly', () => {
      expect(amountToWords(1000000, 'fr')).toBe('un million euros');
      expect(amountToWords(2000000, 'fr')).toBe('deux millions euros');
      expect(amountToWords(1000000000, 'fr')).toBe('un milliard euros');
      expect(amountToWords(2000000000, 'fr')).toBe('deux milliards euros');
    });
  });

  describe('Complex numbers', () => {
    test('converts complex amounts correctly', () => {
      expect(amountToWords(1234.56, 'fr')).toBe('mille deux cent trente-quatre euros et cinquante-six centimes');
      expect(amountToWords(71.81, 'fr')).toBe('soixante et onze euros et quatre-vingt-un centimes');
      expect(amountToWords(999.99, 'fr')).toBe('neuf cent quatre-vingt-dix-neuf euros et quatre-vingt-dix-neuf centimes');
    });
  });

  describe('Error handling', () => {
    test('throws error for negative amounts', () => {
      expect(() => amountToWords(-1, 'fr')).toThrow('Le montant ne peut pas être négatif');
    });

    test('throws error for non-finite numbers', () => {
      expect(() => amountToWords(Infinity, 'fr')).toThrow('Le montant doit être un nombre fini');
      expect(() => amountToWords(NaN, 'fr')).toThrow('Le montant doit être un nombre fini');
    });

    test('throws error for very large numbers', () => {
      expect(() => amountToWords(1e15, 'fr')).toThrow('Montant trop important');
    });
  });

  describe('Direct converter usage', () => {
    test('can use converter directly', () => {
      expect(frConverter.convert(1234.56)).toBe('mille deux cent trente-quatre euros et cinquante-six centimes');
    });
  });
});

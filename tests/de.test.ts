import { amountToWords, deConverter } from '../src/index';

describe('German Converter', () => {
  describe('Basic functionality', () => {
    test('converts zero correctly', () => {
      expect(amountToWords(0, 'de')).toBe('null Euro');
    });

    test('converts one euro correctly', () => {
      expect(amountToWords(1, 'de')).toBe('ein Euro');
    });

    test('converts multiple euros correctly', () => {
      expect(amountToWords(2, 'de')).toBe('zwei Euro');
      expect(amountToWords(10, 'de')).toBe('zehn Euro');
      expect(amountToWords(100, 'de')).toBe('einhundert Euro');
    });

    test('converts cents correctly', () => {
      expect(amountToWords(0.01, 'de')).toBe('null Euro und ein Cent');
      expect(amountToWords(0.99, 'de')).toBe('null Euro und neunundneunzig Cent');
      expect(amountToWords(1.01, 'de')).toBe('ein Euro und ein Cent');
      expect(amountToWords(1.99, 'de')).toBe('ein Euro und neunundneunzig Cent');
    });
  });

  describe('German compound number rules', () => {
    test('handles compound numbers correctly (ones before tens)', () => {
      expect(amountToWords(21, 'de')).toBe('einundzwanzig Euro');
      expect(amountToWords(25, 'de')).toBe('fünfundzwanzig Euro');
      expect(amountToWords(37, 'de')).toBe('siebenunddreißig Euro');
      expect(amountToWords(42, 'de')).toBe('zweiundvierzig Euro');
      expect(amountToWords(99, 'de')).toBe('neunundneunzig Euro');
    });

    test('handles tens correctly', () => {
      expect(amountToWords(20, 'de')).toBe('zwanzig Euro');
      expect(amountToWords(30, 'de')).toBe('dreißig Euro');
      expect(amountToWords(40, 'de')).toBe('vierzig Euro');
      expect(amountToWords(50, 'de')).toBe('fünfzig Euro');
      expect(amountToWords(60, 'de')).toBe('sechzig Euro');
      expect(amountToWords(70, 'de')).toBe('siebzig Euro');
      expect(amountToWords(80, 'de')).toBe('achtzig Euro');
      expect(amountToWords(90, 'de')).toBe('neunzig Euro');
    });

    test('handles teens correctly', () => {
      expect(amountToWords(11, 'de')).toBe('elf Euro');
      expect(amountToWords(12, 'de')).toBe('zwölf Euro');
      expect(amountToWords(13, 'de')).toBe('dreizehn Euro');
      expect(amountToWords(16, 'de')).toBe('sechzehn Euro');
      expect(amountToWords(17, 'de')).toBe('siebzehn Euro');
    });
  });

  describe('Hundreds and thousands', () => {
    test('handles hundreds correctly', () => {
      expect(amountToWords(100, 'de')).toBe('einhundert Euro');
      expect(amountToWords(200, 'de')).toBe('zweihundert Euro');
      expect(amountToWords(321, 'de')).toBe('dreihunderteinsundzwanzig Euro');
      expect(amountToWords(999, 'de')).toBe('neunhundertneunundneunzig Euro');
    });

    test('handles thousands correctly', () => {
      expect(amountToWords(1000, 'de')).toBe('eintausend Euro');
      expect(amountToWords(2000, 'de')).toBe('zweitausend Euro');
      expect(amountToWords(1001, 'de')).toBe('eintausend eins Euro');
      expect(amountToWords(1234, 'de')).toBe('eintausend zweihundertvierunddreißig Euro');
      expect(amountToWords(12345, 'de')).toBe('zwölftausend dreihundertfünfundvierzig Euro');
    });

    test('handles millions correctly', () => {
      expect(amountToWords(1000000, 'de')).toBe('eine Million Euro');
      expect(amountToWords(2000000, 'de')).toBe('zwei Millionen Euro');
      expect(amountToWords(1000000000, 'de')).toBe('eine Milliarde Euro');
      expect(amountToWords(2000000000, 'de')).toBe('zwei Milliarden Euro');
    });
  });

  describe('Complex numbers', () => {
    test('converts complex amounts correctly', () => {
      expect(amountToWords(1234.56, 'de')).toBe('eintausend zweihundertvierunddreißig Euro und sechsundfünfzig Cent');
      expect(amountToWords(99.99, 'de')).toBe('neunundneunzig Euro und neunundneunzig Cent');
      expect(amountToWords(101.01, 'de')).toBe('einhunderteins Euro und ein Cent');
    });

    test('handles compound words correctly', () => {
      expect(amountToWords(125, 'de')).toBe('einhundertfünfundzwanzig Euro');
      expect(amountToWords(1025, 'de')).toBe('eintausend fünfundzwanzig Euro');
      expect(amountToWords(21025, 'de')).toBe('einundzwanzigtausend fünfundzwanzig Euro');
    });
  });

  describe('Error handling', () => {
    test('throws error for negative amounts', () => {
      expect(() => amountToWords(-1, 'de')).toThrow('Der Betrag kann nicht negativ sein');
    });

    test('throws error for non-finite numbers', () => {
      expect(() => amountToWords(Infinity, 'de')).toThrow('Der Betrag muss eine endliche Zahl sein');
      expect(() => amountToWords(NaN, 'de')).toThrow('Der Betrag muss eine endliche Zahl sein');
    });

    test('throws error for very large numbers', () => {
      expect(() => amountToWords(1e15, 'de')).toThrow('Betrag zu groß');
    });
  });

  describe('Direct converter usage', () => {
    test('can use converter directly', () => {
      expect(deConverter.convert(1234.56)).toBe('eintausend zweihundertvierunddreißig Euro und sechsundfünfzig Cent');
    });
  });
});

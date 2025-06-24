import { amountToWords } from '../src/index';

// Helper function to test error handling across locales
function testErrorAcrossLocales(input: number, expectedError: RegExp) {
  const locales = ['en', 'th', 'fr', 'ja', 'de', 'et', 'es', 'fa'] as const;
  locales.forEach(locale => {
    expect(() => amountToWords(input, locale)).toThrow(expectedError);
  });
}

// Helper function to test valid conversion across locales
function testValidConversionAcrossLocales(amount: number) {
  const locales = ['en', 'th', 'fr', 'ja', 'de', 'et', 'es', 'fa'] as const;
  locales.forEach(locale => {
    const result = amountToWords(amount, locale);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
}

describe('Main System Tests', () => {
  describe('Locale support', () => {
    test('supports all implemented locales', () => {
      const testAmount = 1234.56;

      expect(() => amountToWords(testAmount, 'en')).not.toThrow();
      expect(() => amountToWords(testAmount, 'th')).not.toThrow();
      expect(() => amountToWords(testAmount, 'fr')).not.toThrow();
      expect(() => amountToWords(testAmount, 'ja')).not.toThrow();
      expect(() => amountToWords(testAmount, 'de')).not.toThrow();
      expect(() => amountToWords(testAmount, 'et')).not.toThrow();
      expect(() => amountToWords(testAmount, 'es')).not.toThrow();
      expect(() => amountToWords(testAmount, 'fa')).not.toThrow();
    });

    test('throws error for unsupported locale', () => {
      expect(() => amountToWords(100, 'pt' as any)).toThrow('Unsupported locale: pt');
      expect(() => amountToWords(100, 'xyz' as any)).toThrow('Unsupported locale: xyz');
    });

    test('uses English as default locale', () => {
      expect(amountToWords(100)).toBe('one hundred dollars');
    });
  });

  describe('Cross-language consistency', () => {
    const testCases = [
      { amount: 0, description: 'zero' },
      { amount: 1, description: 'one' },
      { amount: 11, description: 'eleven' },
      { amount: 21, description: 'twenty-one' },
      { amount: 100, description: 'one hundred' },
      { amount: 1000, description: 'one thousand' },
      { amount: 1234.56, description: 'complex amount' }
    ];

    const locales = ['en', 'th', 'fr', 'ja', 'de', 'et', 'es', 'fa'] as const;

    testCases.forEach(({ amount, description }) => {
      test(`all locales handle ${description} (${amount})`, () => {
        testValidConversionAcrossLocales(amount);
      });
    });
  });

  describe('Input validation', () => {
    test('validates number type', () => {
      expect(() => amountToWords('100' as any)).toThrow('Amount must be a number');
      expect(() => amountToWords(null as any)).toThrow('Amount must be a number');
      expect(() => amountToWords(undefined as any)).toThrow('Amount must be a number');
      expect(() => amountToWords({} as any)).toThrow('Amount must be a number');
    });

    test('handles floating point precision across locales', () => {
      testValidConversionAcrossLocales(0.1 + 0.2);
      testValidConversionAcrossLocales(1.005);
    });

    test('handles boundary values across locales', () => {
      testValidConversionAcrossLocales(0);
      testValidConversionAcrossLocales(0.01);
      testValidConversionAcrossLocales(999999.99);
    });
  });

  describe('Error handling consistency', () => {
    test('all locales handle negative numbers consistently', () => {
      testErrorAcrossLocales(-1, /negative|ลบ|négatif|負|negativ/i);
    });

    test('all locales handle infinity consistently', () => {
      testErrorAcrossLocales(Infinity, /finite|ถูกต้อง|fini|有限|endlich/i);
    });

    test('all locales handle NaN consistently', () => {
      testErrorAcrossLocales(NaN, /finite|ถูกต้อง|fini|有限|endlich/i);
    });
  });

  describe('Performance', () => {
    test('handles multiple conversions efficiently', () => {
      const start = Date.now();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        amountToWords(Math.random() * 1000000, 'en');
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000); // Should complete in less than 5 seconds
    });

    test('handles large numbers efficiently', () => {
      const start = Date.now();

      amountToWords(999999999.99, 'en');
      amountToWords(999999999.99, 'th');
      amountToWords(999999999.99, 'fr');
      amountToWords(999999999.99, 'ja');
      amountToWords(999999999.99, 'de');

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });
});

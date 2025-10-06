import { amountToWords } from '../src/index';

describe('Currency support (THB, JPY)', () => {
  test('English with THB units and 2 decimals', () => {
    expect(amountToWords(123.45, { locale: 'en', currency: 'THB' })).toBe(
      'one hundred twenty-three baht and forty-five satang'
    );
  });

  test('Thai with THB defaults (ถ้วน when no satang)', () => {
    expect(amountToWords(123, { locale: 'th', currency: 'THB' })).toBe(
      'หนึ่งร้อยยี่สิบสามบาทถ้วน'
    );
  });

  test('English with JPY (0 decimals)', () => {
    expect(amountToWords(123.45, { locale: 'en', currency: 'JPY' })).toBe(
      'one hundred twenty-three yen'
    );
  });

  test('Japanese with JPY (0 decimals)', () => {
    expect(amountToWords(123.45, { locale: 'ja', currency: 'JPY' })).toBe(
      'ひゃくにじゅうさんえん'
    );
  });
});
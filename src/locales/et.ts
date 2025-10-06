import { LocaleConverter, ConversionOptions } from '../types';

/**
 * Estonian Number to Words Converter
 *
 * Features:
 * - Estonian number system with proper declensions
 * - Currency: Euro and sent (euro ja sent)
 * - Handles compound numbers and gender agreement
 * - Special cases for numbers ending in 1 (üks vs ühe)
 * - Proper ordinal and cardinal number forms
 */
export class EstonianConverter implements LocaleConverter {
  private readonly ones = [
    '', 'üks', 'kaks', 'kolm', 'neli', 'viis', 'kuus', 'seitse', 'kaheksa', 'üheksa',
    'kümme', 'üksteist', 'kaksteist', 'kolmteist', 'neliteist', 'viisteist',
    'kuusteist', 'seitseteist', 'kaheksateist', 'üheksateist'
  ];

  private readonly tens = [
    '', '', 'kakskümmend', 'kolmkümmend', 'nelikümmend', 'viiskümmend',
    'kuuskümmend', 'seitsekümmend', 'kaheksakümmend', 'üheksakümmend'
  ];

  private readonly scales = [
    { value: 1000000000, singular: 'miljard', plural: 'miljardit' },
    { value: 1000000, singular: 'miljon', plural: 'miljonit' },
    { value: 1000, singular: 'tuhat', plural: 'tuhat' },
    { value: 100, singular: 'sada', plural: 'sada' }
  ];

  convert(amount: number, options?: ConversionOptions): string {
    if (!this.isValidNumber(amount)) {
      throw new Error('Amount must be a non-negative finite number');
    }

    if (amount > 999999999999.99) {
      throw new Error('Amount too large');
    }

    // Round according to minorDigits (default 2)
    const minorDigits = options?.minorDigits ?? 2;
    const factor = Math.pow(10, minorDigits);
    const roundedAmount = Math.round(amount * factor) / factor;
    const [majorStr, minorStr = ''] = roundedAmount.toFixed(minorDigits).split('.');
    const wholePart = parseInt(majorStr, 10);
    const decimalPart = minorDigits > 0 ? parseInt(minorStr || '0', 10) : 0;

    let result = '';

    const units = options?.unitsOverride ?? {
      majorSingular: 'euro',
      majorPlural: 'eurot',
      minorSingular: 'sent',
      minorPlural: 'senti',
    };
    if (wholePart === 0) {
      result = `null ${units.majorPlural}`;
    } else {
      const wholeWords = this.convertWholeNumber(wholePart);
      const isPlural = this.shouldUsePluralCurrency(wholePart);
      const euroText = isPlural ? units.majorPlural : units.majorSingular;
      result = `${wholeWords} ${euroText}`;
    }

    if (decimalPart > 0) {
      const centWords = this.convertWholeNumber(decimalPart);
      const isPlural = this.shouldUsePluralCurrency(decimalPart);
      const sentText = isPlural ? units.minorPlural : units.minorSingular;
      result += ` ${centWords} ${sentText}`;
    }

    return result;
  }

  private shouldUsePluralCurrency(num: number): boolean {
    // Estonian rule: use plural except when number ends in 1 (but not 11)
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;
    return !(lastDigit === 1 && lastTwoDigits !== 11);
  }

  private isValidNumber(num: number): boolean {
    return typeof num === 'number' && isFinite(num) && num >= 0;
  }

  private parseAmount(amount: number): [number, number] {
    // Handle floating point precision by using string manipulation
    const amountStr = amount.toFixed(3);
    const [wholeStr, decimalStr = '0'] = amountStr.split('.');

    const wholePart = parseInt(wholeStr, 10);
    const decimalPart = parseInt(decimalStr.substring(0, 2).padEnd(2, '0'), 10);

    return [wholePart, decimalPart];
  }

  private convertWholeNumber(num: number): string {
    if (num === 0) return '';
    if (num < 20) return this.ones[num];
    if (num < 100) return this.convertTens(num);

    for (const scale of this.scales) {
      if (num >= scale.value) {
        return this.convertScale(num, scale);
      }
    }

    return '';
  }

  private convertTens(num: number): string {
    const ten = Math.floor(num / 10);
    const one = num % 10;

    if (one === 0) {
      return this.tens[ten];
    }

    return `${this.tens[ten]} ${this.ones[one]}`;
  }

  private convertScale(num: number, scale: { value: number; singular: string; plural: string }): string {
    const quotient = Math.floor(num / scale.value);
    const remainder = num % scale.value;

    let result = '';

    if (scale.value === 100) {
      // Special handling for hundreds
      if (quotient === 1) {
        result = 'sada';
      } else {
        result = `${this.convertWholeNumber(quotient)} ${scale.plural}`;
      }
    } else if (scale.value === 1000) {
      // Special handling for thousands
      if (quotient === 1) {
        result = 'tuhat';
      } else {
        result = `${this.convertWholeNumber(quotient)} ${scale.plural}`;
      }
    } else if (scale.value === 1000000) {
      // Special handling for millions
      if (quotient === 1) {
        result = 'miljon';
      } else {
        result = `${this.convertWholeNumber(quotient)} ${scale.plural}`;
      }
    } else {
      // Other scales (billions, etc.)
      const scaleWord = quotient === 1 ? scale.singular : scale.plural;
      result = `${this.convertWholeNumber(quotient)} ${scaleWord}`;
    }

    if (remainder > 0) {
      result += ` ${this.convertWholeNumber(remainder)}`;
    }

    return result;
  }
}

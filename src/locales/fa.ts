import { LocaleConverter } from '../types';

/**
 * Persian (Farsi) Number to Words Converter
 *
 * Features:
 * - Persian number system with proper script
 * - Currency: Euro and سنت (euro and sent)
 * - Right-to-left reading support
 * - Persian digits and compound number formation
 * - Handles traditional Persian number naming
 */
export class PersianConverter implements LocaleConverter {
  private readonly ones = [
    '', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه',
    'ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'
  ];

  private readonly tens = [
    '', '', 'بیست', 'سی', 'چهل', 'پنجاه',
    'شصت', 'هفتاد', 'هشتاد', 'نود'
  ];

  private readonly hundreds = [
    '', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد',
    'ششصد', 'هفتصد', 'هشتصد', 'نهصد'
  ];

  private readonly scales = [
    { value: 1000000000, name: 'میلیارد' },
    { value: 1000000, name: 'میلیون' },
    { value: 1000, name: 'هزار' }
  ];

  convert(amount: number): string {
    if (!this.isValidNumber(amount)) {
      throw new Error('Amount must be a non-negative finite number');
    }

    if (amount > 999999999999.99) {
      throw new Error('Amount too large');
    }

    const [wholePart, decimalPart] = this.parseAmount(amount);

    let result = '';

    if (wholePart === 0) {
      result = 'صفر یورو';
    } else {
      const wholeWords = this.convertWholeNumber(wholePart);
      result = `${wholeWords} یورو`;
    }

    if (decimalPart > 0) {
      const centWords = this.convertWholeNumber(decimalPart);
      result += ` ${centWords} سنت`;
    }

    return result;
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
    if (num < 1000) return this.convertHundreds(num);

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

    return `${this.tens[ten]} و ${this.ones[one]}`;
  }

  private convertHundreds(num: number): string {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;

    let result = this.hundreds[hundred];

    if (remainder > 0) {
      if (remainder < 20) {
        result += ` و ${this.ones[remainder]}`;
      } else {
        result += ` و ${this.convertTens(remainder)}`;
      }
    }

    return result;
  }

  private convertScale(num: number, scale: { value: number; name: string }): string {
    const quotient = Math.floor(num / scale.value);
    const remainder = num % scale.value;

    let result = '';

    if (scale.value === 1000) {
      // Special handling for thousands - Persian rule for 1000 vs 1000+
      if (quotient === 1) {
        // For exact 1000 and 1001-1099, use "هزار"
        // For 1100+ (when remainder has hundreds), use "یک هزار"
        if (remainder === 0 || remainder < 100) {
          result = 'هزار';
        } else {
          result = 'یک هزار';
        }
      } else {
        result = `${this.convertWholeNumber(quotient)} هزار`;
      }
    } else {
      // Millions and billions
      result = `${this.convertWholeNumber(quotient)} ${scale.name}`;
    }

    if (remainder > 0) {
      result += ` و ${this.convertWholeNumber(remainder)}`;
    }

    return result;
  }
}

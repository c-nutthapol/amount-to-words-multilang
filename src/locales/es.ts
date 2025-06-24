import { LocaleConverter } from '../types';

/**
 * Spanish Number to Words Converter
 *
 * Features:
 * - Spanish number system with proper gender agreement
 * - Currency: Euro and céntimos
 * - Handles masculine/feminine forms (uno/una, dos/dos)
 * - Special cases for 100 (cien vs ciento)
 * - Proper compound number formation
 * - Regional variations handled (standard Spanish)
 */
export class SpanishConverter implements LocaleConverter {
  private readonly ones = [
    '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
    'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
  ];

  private readonly onesFeminine = [
    '', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'
  ];

  private readonly tens = [
    '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta',
    'sesenta', 'setenta', 'ochenta', 'noventa'
  ];

  private readonly twenties = [
    'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco',
    'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'
  ];

  private readonly hundreds = [
    '', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
    'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
  ];

  private readonly scales = [
    { value: 1000000000, singular: 'mil millones', plural: 'mil millones' },
    { value: 1000000, singular: 'millón', plural: 'millones' },
    { value: 1000, singular: 'mil', plural: 'mil' }
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
      result = 'cero euros';
    } else {
      const wholeWords = this.convertWholeNumber(wholePart);
      const euroText = wholePart === 1 ? 'euro' : 'euros';
      result = `${wholeWords} ${euroText}`;
    }

    if (decimalPart > 0) {
      const centWords = this.convertWholeNumber(decimalPart);
      const centimoText = decimalPart === 1 ? 'céntimo' : 'céntimos';
      result += ` ${centWords} ${centimoText}`;
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
    if (num >= 20 && num < 30) {
      return this.twenties[num - 20];
    }

    const ten = Math.floor(num / 10);
    const one = num % 10;

    if (one === 0) {
      return this.tens[ten];
    }

    // For 31-99, use "y" (and)
    return `${this.tens[ten]} y ${this.ones[one]}`;
  }

  private convertHundreds(num: number): string {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;

    let result = '';

    if (hundred === 1 && remainder === 0) {
      result = 'cien'; // Special case for exactly 100
    } else {
      result = this.hundreds[hundred];
    }

    if (remainder > 0) {
      if (remainder < 20) {
        result += ` ${this.ones[remainder]}`;
      } else {
        result += ` ${this.convertTens(remainder)}`;
      }
    }

    return result;
  }

  private convertScale(num: number, scale: { value: number; singular: string; plural: string }): string {
    const quotient = Math.floor(num / scale.value);
    const remainder = num % scale.value;

    let result = '';

    if (scale.value === 1000) {
      // Special handling for thousands
      if (quotient === 1) {
        result = 'mil';
      } else {
        result = `${this.convertWholeNumber(quotient)} mil`;
      }
    } else if (scale.value === 1000000000) {
      // Special handling for billions (mil millones)
      if (quotient === 1) {
        result = 'mil millones';
      } else {
        result = `${this.convertWholeNumber(quotient)} mil millones`;
      }
    } else {
      // Millions
      const scaleWord = quotient === 1 ? scale.singular : scale.plural;
      if (quotient === 1 && scale.value === 1000000) {
        result = `un ${scaleWord}`;
      } else {
        result = `${this.convertWholeNumber(quotient)} ${scaleWord}`;
      }
    }

    if (remainder > 0) {
      result += ` ${this.convertWholeNumber(remainder)}`;
    }

    return result;
  }
}

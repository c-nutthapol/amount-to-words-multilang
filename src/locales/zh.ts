import { LocaleConverter, ConversionOptions } from '../types';

export class ChineseConverter implements LocaleConverter {
  private readonly numbers = [
    '零', '一', '二', '三', '四', '五', '六', '七', '八', '九'
  ];

  private readonly defaultMajorUnit = '元';
  private readonly defaultMinorUnit = '分';

  convert(amount: number, options?: ConversionOptions): string {
    // Validate input
    if (!isFinite(amount)) {
      throw new Error('金额必须是有限的数字');
    }

    if (amount < 0) {
      throw new Error('金额不能是负数');
    }

    if (amount === 0) {
      return '零元';
    }

    // Round according to minorDigits (default 2)
    const minorDigits = options?.minorDigits ?? 2;
    const factor = Math.pow(10, minorDigits);
    const roundedAmount = Math.round(amount * factor) / factor;
    const [majorStr, minorStr = ''] = roundedAmount.toFixed(minorDigits).split('.');
    let yuan = parseInt(majorStr, 10);
    let fen = minorDigits > 0 ? parseInt(minorStr || '0', 10) : 0;

    let result = '';

    const majorUnit = options?.majorUnit ?? this.defaultMajorUnit;
    const minorUnit = options?.minorUnit ?? this.defaultMinorUnit;

    // Convert yuan part
    if (yuan > 0) {
      result += this.convertInteger(yuan) + majorUnit;
    }

    // Convert fen part
    if (fen > 0) {
      if (yuan > 0) {
        result += (fen < 10 ? '零' : '') + this.convertCents(fen) + minorUnit;
      } else {
        result += this.convertCents(fen) + minorUnit;
      }
    }

    return result || `零${majorUnit}`;
  }

  private convertInteger(num: number): string {
    if (num === 0) return '';
    if (num < 10) return this.numbers[num];

    // Handle special case for 10-19
    if (num >= 10 && num < 20) {
      if (num === 10) return '十';
      return '十' + this.numbers[num % 10];
    }

    // Convert large numbers
    if (num >= 100000000) { // 億 (hundred million)
      const yi = Math.floor(num / 100000000);
      const remainder = num % 100000000;
      let result = this.convertInteger(yi) + '億';

      if (remainder > 0) {
        if (remainder < 10000000) { // Add zero if remainder is less than 千万
          result += '零';
        }
        result += this.convertInteger(remainder);
      }
      return result;
    }

    if (num >= 10000) { // 万 (ten thousand)
      const wan = Math.floor(num / 10000);
      const remainder = num % 10000;
      let result = this.convertInteger(wan) + '万';

      if (remainder > 0) {
        if (remainder < 1000) { // Add zero if remainder is less than 千
          result += '零';
        }
        result += this.convertInteger(remainder);
      }
      return result;
    }

    if (num >= 1000) { // 千
      const qian = Math.floor(num / 1000);
      const remainder = num % 1000;
      let result = this.numbers[qian] + '千';

      if (remainder > 0) {
        if (remainder < 100) { // Add zero if remainder is less than 百
          result += '零';
        }
        result += this.convertInteger(remainder);
      }
      return result;
    }

    if (num >= 100) { // 百
      const bai = Math.floor(num / 100);
      const remainder = num % 100;
      let result = this.numbers[bai] + '百';

      if (remainder > 0) {
        if (remainder < 20 && remainder >= 10) {
          result += '十' + (remainder % 10 > 0 ? this.numbers[remainder % 10] : '');
        } else if (remainder < 10) {
          result += '零' + this.numbers[remainder];
        } else {
          result += this.convertInteger(remainder);
        }
      }
      return result;
    }

    if (num >= 20) { // 20-99
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      let result = this.numbers[tens] + '十';
      if (ones > 0) {
        result += this.numbers[ones];
      }
      return result;
    }

    return this.numbers[num];
  }

  private convertCents(fen: number): string {
    if (fen === 0) return '';

    if (fen < 10) {
      return this.numbers[fen];
    }

    const tens = Math.floor(fen / 10);
    const ones = fen % 10;

    let result = '';

    if (tens === 1) {
      result += '一十';
    } else if (tens > 1) {
      result += this.numbers[tens] + '十';
    }

    if (ones > 0) {
      result += this.numbers[ones];
    }

    return result;
  }
}

export const zhConverter = new ChineseConverter();

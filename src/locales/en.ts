import { LocaleConverter, ConversionOptions } from '../types';

const ones = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
];
const teens = [
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
  'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];
const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

function numberToWordsEN(n: number): string {
  if (n === 0) return 'zero';

  // Handle negative numbers
  if (n < 0) {
    return `negative ${numberToWordsEN(Math.abs(n))}`;
  }

  // Handle numbers beyond trillion
  if (n >= 1000000000000000) {
    throw new Error('Number too large (beyond quadrillion)');
  }

  const chunks: string[] = [];
  let chunkCount = 0;

  while (n > 0 && chunkCount < scales.length) {
    const chunk = n % 1000;
    if (chunk > 0) {
      const chunkWord = convertChunk(chunk);
      if (scales[chunkCount]) {
        chunks.unshift(`${chunkWord} ${scales[chunkCount]}`);
      } else {
        chunks.unshift(chunkWord);
      }
    }
    n = Math.floor(n / 1000);
    chunkCount++;
  }

  return chunks.join(' ').trim();
}

function convertChunk(n: number): string {
  if (n === 0) return '';

  let str = '';

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  if (hundreds > 0) {
    str += `${ones[hundreds]} hundred`;
    if (remainder > 0) str += ' ';
  }

  if (remainder >= 10 && remainder < 20) {
    str += teens[remainder - 10];
  } else if (remainder >= 20) {
    const t = Math.floor(remainder / 10);
    const o = remainder % 10;
    str += tens[t];
    if (o > 0) str += `-${ones[o]}`;
  } else if (remainder > 0) {
    str += ones[remainder];
  }

  return str.trim();
}

export const enConverter: LocaleConverter = {
  convert(amount: number, options?: ConversionOptions): string {
    // Validate input
    if (!isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }

    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    // Handle very large amounts
    if (amount >= 1000000000000000) {
      throw new Error('Amount too large (beyond quadrillion dollars)');
    }
    // Determine minor digits (defaults to 2) with robust rounding
    const minorDigits = options?.minorDigits ?? 2;
    let major = 0;
    let minor = 0;
    if (minorDigits === 0) {
      major = Math.round(amount);
      minor = 0;
    } else {
      // Use one extra decimal place to avoid cases like 1.005 -> 1.00
      const fixed = amount.toFixed(minorDigits + 1);
      const [majorStr, extraMinorStr = ''] = fixed.split('.');
      const extraMinor = parseInt(extraMinorStr.padEnd(minorDigits + 1, '0').slice(0, minorDigits + 1), 10);
      const base = Math.pow(10, minorDigits);
      let roundedMinor = Math.round(extraMinor / 10);
      major = parseInt(majorStr, 10);
      if (roundedMinor === base) {
        major += 1;
        roundedMinor = 0;
      }
      minor = roundedMinor;
    }

    let result = '';

    const units = options?.unitsOverride ?? {
      majorSingular: 'dollar',
      majorPlural: 'dollars',
      minorSingular: 'cent',
      minorPlural: 'cents',
    };

    if (major === 0) {
      result = `zero ${units.majorPlural}`;
    } else if (major === 1) {
      result = `one ${units.majorSingular}`;
    } else {
      result = `${numberToWordsEN(major)} ${units.majorPlural}`;
    }

    if (minor > 0) {
      if (minor === 1) {
        result += ` and one ${units.minorSingular}`;
      } else {
        result += ` and ${numberToWordsEN(minor)} ${units.minorPlural}`;
      }
    }

    return result;
  }
};

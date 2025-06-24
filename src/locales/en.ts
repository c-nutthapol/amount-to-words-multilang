import { LocaleConverter } from '../types';

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
  convert(amount: number): string {
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

    // Handle floating point precision by parsing string representation
    // This ensures proper rounding for cases like 1.005 -> 1.01
    const amountStr = amount.toFixed(3);
    const [majorStr, minorStr = ''] = amountStr.split('.');
    const major = parseInt(majorStr, 10);

    // Parse the decimal part and round to 2 places
    let minor = 0;
    if (minorStr.length > 0) {
      const threeDigits = minorStr.padEnd(3, '0').substring(0, 3);
      const threeDigitNum = parseInt(threeDigits, 10);
      minor = Math.round(threeDigitNum / 10); // Round from 3 digits to 2
    }

    let result = '';

    if (major === 0) {
      result = 'zero dollars';
    } else if (major === 1) {
      result = 'one dollar';
    } else {
      result = `${numberToWordsEN(major)} dollars`;
    }

    if (minor > 0) {
      if (minor === 1) {
        result += ' and one cent';
      } else {
        result += ` and ${numberToWordsEN(minor)} cents`;
      }
    }

    return result;
  }
};

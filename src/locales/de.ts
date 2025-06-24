import { LocaleConverter } from '../types';

const ones = [
  '', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'
];

const onesForTens = [
  '', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'
];

const teens = [
  'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'
];

const tens = [
  '', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'
];

const scales = ['', 'tausend', 'Million', 'Milliarde', 'Billion'];

function numberToWordsDE(n: number): string {
  if (n === 0) return 'null';

  if (n < 0) {
    return `minus ${numberToWordsDE(Math.abs(n))}`;
  }

  if (n >= 1000000000000000) {
    throw new Error('Zahl zu groß (über Billiarde)');
  }

  const chunks: string[] = [];
  let chunkCount = 0;

  while (n > 0 && chunkCount < scales.length) {
    const chunk = n % 1000;
    if (chunk > 0) {
      chunks.unshift(handleGermanScale(chunk, chunkCount));
    }
    n = Math.floor(n / 1000);
    chunkCount++;
  }

  return chunks.join(' ').trim();
}

function handleGermanScale(chunk: number, chunkCount: number): string {
  const chunkWord = convertChunkDE(chunk);

  if (chunkCount === 0) {
    return chunkWord;
  }

  if (chunkCount === 1) {
    // Tausend
    if (chunk === 1) {
      return 'eintausend';
    }
    return `${chunkWord}tausend`;
  }

  // Million, Milliarde, etc.
  const scale = scales[chunkCount];
  if (chunk === 1) {
    return `eine ${scale}`;
  }
  // Handle plurals correctly
  let pluralScale = scale;
  if (chunk > 1) {
    if (scale === 'Million') {
      pluralScale = 'Millionen';
    } else if (scale === 'Milliarde') {
      pluralScale = 'Milliarden';
    } else if (scale === 'Billion') {
      pluralScale = 'Billionen';
    }
  }
  return `${chunkWord} ${pluralScale}`;
}

function convertChunkDE(n: number): string {
  if (n === 0) return '';

  let result = '';

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  // Handle hundreds
  if (hundreds > 0) {
    if (hundreds === 1) {
      result += 'einhundert';
    } else {
      result += `${ones[hundreds]}hundert`;
    }
  }

  // Handle remainder (1-99)
  if (remainder > 0) {
    // When we have hundreds, use different logic for tens/ones
    result += handleTensAndOnesDE(remainder, hundreds > 0);
  }

  return result;
}

function handleTensAndOnesDE(n: number, hasHundreds: boolean = false): string {
  if (n === 0) return '';

  if (n < 10) {
    return onesForTens[n];
  }

  if (n < 20) {
    return teens[n - 10];
  }

  const tensDigit = Math.floor(n / 10);
  const onesDigit = n % 10;

  if (onesDigit === 0) {
    return tens[tensDigit];
  }

  // German reverses tens and ones: "einundzwanzig" = one and twenty
  // Use "eins" when it's part of hundreds (321 -> dreihunderteinsundzwanzig)
  // Use "ein" when it's standalone (21 -> einundzwanzig)
  let onesPart: string;
  if (onesDigit === 1) {
    onesPart = hasHundreds ? 'eins' : 'ein';
  } else {
    onesPart = onesForTens[onesDigit];
  }
  return `${onesPart}und${tens[tensDigit]}`;
}

export const deConverter: LocaleConverter = {
  convert(amount: number): string {
    // Validate input
    if (!isFinite(amount)) {
      throw new Error('Der Betrag muss eine endliche Zahl sein');
    }

    if (amount < 0) {
      throw new Error('Der Betrag kann nicht negativ sein');
    }

    if (amount >= 1000000000000000) {
      throw new Error('Betrag zu groß (über Billiarde Euro)');
    }

    // Handle floating point precision by parsing string representation
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
      result = 'null Euro';
    } else if (major === 1) {
      result = 'ein Euro';
    } else {
      result = `${numberToWordsDE(major)} Euro`;
    }

    if (minor > 0) {
      if (minor === 1) {
        result += ' und ein Cent';
      } else {
        result += ` und ${numberToWordsDE(minor)} Cent`;
      }
    }

    return result;
  }
};

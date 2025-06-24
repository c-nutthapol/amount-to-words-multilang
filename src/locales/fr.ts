import { LocaleConverter } from '../types';

const ones = [
  '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'
];

const teens = [
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'
];

const tens = [
  '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'
];

const scales = ['', 'mille', 'million', 'milliard', 'billion'];

function handleFrenchScale(chunk: number, chunkCount: number): string {
  const chunkWord = convertChunkFR(chunk);

  if (chunkCount === 0) {
    return chunkWord;
  }

  if (chunkCount === 1) {
    // Special rule for "mille"
    return chunk === 1 ? 'mille' : `${chunkWord} ${scales[chunkCount]}`;
  }

  // Million, milliard, etc. - always with 's' if plural
  const scale = chunk > 1 ? `${scales[chunkCount]}s` : scales[chunkCount];
  return `${chunkWord} ${scale}`;
}

function numberToWordsFR(n: number): string {
  if (n === 0) return 'zéro';

  if (n < 0) {
    return `moins ${numberToWordsFR(Math.abs(n))}`;
  }

  if (n >= 1000000000000000) {
    throw new Error('Nombre trop grand (au-delà du billiard)');
  }

  const chunks: string[] = [];
  let chunkCount = 0;

  while (n > 0 && chunkCount < scales.length) {
    const chunk = n % 1000;
    if (chunk > 0) {
      chunks.unshift(handleFrenchScale(chunk, chunkCount));
    }
    n = Math.floor(n / 1000);
    chunkCount++;
  }

  return chunks.join(' ').trim();
}

function handleSeventies(remainder: number): string {
  const o = remainder % 10;
  if (o === 1) {
    return 'soixante et onze';
  }
  if (o === 0) {
    return 'soixante-dix';
  }
  return `soixante-${teens[o]}`;
}

function handleNineties(remainder: number): string {
  const o = remainder % 10;
  if (o === 0) {
    return 'quatre-vingt-dix';
  }
  return `quatre-vingt-${teens[o]}`;
}

function handleRegularTens(t: number, o: number, hundreds: number): string {
  let str = tens[t];

  if (o === 1 && (t >= 2 && t <= 6)) {
    str += ' et un';
  } else if (o > 0) {
    str += `-${ones[o]}`;
  }

  // Special case for quatre-vingts (with 's' when no units)
  if (t === 8 && o === 0 && hundreds === 0) {
    str += 's';
  }

  return str;
}

function handleHundreds(hundreds: number, remainder: number): string {
  let str = '';

  if (hundreds > 0) {
    if (hundreds === 1) {
      str += 'cent';
    } else {
      str += `${ones[hundreds]} cent`;
    }

    // Add 's' to cent if plural and no remainder
    if (hundreds > 1 && remainder === 0) {
      str += 's';
    }

    if (remainder > 0) str += ' ';
  }

  return str;
}

function convertChunkFR(n: number): string {
  if (n === 0) return '';

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  let str = handleHundreds(hundreds, remainder);

  // Handle remainder
  if (remainder >= 10 && remainder < 20) {
    str += teens[remainder - 10];
  } else if (remainder >= 20) {
    const t = Math.floor(remainder / 10);

    if (t === 7) {
      str += handleSeventies(remainder);
    } else if (t === 9) {
      str += handleNineties(remainder);
    } else {
      const o = remainder % 10;
      str += handleRegularTens(t, o, hundreds);
    }
  } else if (remainder > 0) {
    str += ones[remainder];
  }

  return str.trim();
}

export const frConverter: LocaleConverter = {
  convert(amount: number): string {
    // Validate input
    if (!isFinite(amount)) {
      throw new Error('Le montant doit être un nombre fini');
    }

    if (amount < 0) {
      throw new Error('Le montant ne peut pas être négatif');
    }

    if (amount >= 1000000000000000) {
      throw new Error('Montant trop important (au-delà du billiard d\'euros)');
    }

    // Round to 2 decimal places
    const roundedAmount = Math.round(amount * 100) / 100;
    const [majorStr, minorStr] = roundedAmount.toFixed(2).split('.');
    const major = parseInt(majorStr, 10);
    const minor = parseInt(minorStr, 10);

    let result = '';

    if (major === 0) {
      result = 'zéro euro';
    } else if (major === 1) {
      result = 'un euro';
    } else {
      result = `${numberToWordsFR(major)} euros`;
    }

    if (minor > 0) {
      if (minor === 1) {
        result += ' et un centime';
      } else {
        result += ` et ${numberToWordsFR(minor)} centimes`;
      }
    }

    return result;
  }
};

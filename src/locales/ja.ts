import { LocaleConverter } from '../types';

const ones = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const onesReading = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
const tens = ['', '十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
const tensReading = ['', 'じゅう', 'にじゅう', 'さんじゅう', 'よんじゅう', 'ごじゅう', 'ろくじゅう', 'ななじゅう', 'はちじゅう', 'きゅうじゅう'];

function numberToWordsJA(n: number): string {
  if (n === 0) return 'ぜろ';

  if (n < 0) {
    return `マイナス${numberToWordsJA(Math.abs(n))}`;
  }

  if (n >= 1000000000000) {
    throw new Error('数値が大きすぎます（一兆を超えています）');
  }

  let result = '';

  // Handle 億 (hundred millions)
  if (n >= 100000000) {
    const oku = Math.floor(n / 100000000);
    result += convertChunkJA(oku) + 'おく';
    n %= 100000000;
  }

  // Handle 万 (ten thousands)
  if (n >= 10000) {
    const man = Math.floor(n / 10000);
    result += convertChunkJA(man) + 'まん';
    n %= 10000;
  }

  // Handle remaining thousands, hundreds, tens, ones
  if (n > 0) {
    result += convertChunkJA(n);
  }

  return result;
}

function handleThousands(n: number): { result: string; remainder: number } {
  if (n < 1000) return { result: '', remainder: n };

  const thousands = Math.floor(n / 1000);
  let result = '';

  if (thousands === 1) {
    result = 'せん';
  } else if (thousands === 3) {
    result = 'さんぜん';  // Special reading
  } else if (thousands === 8) {
    result = 'はっせん'; // Special reading
  } else {
    result = onesReading[thousands] + 'せん';
  }

  return { result, remainder: n % 1000 };
}

function handleHundreds(n: number): { result: string; remainder: number } {
  if (n < 100) return { result: '', remainder: n };

  const hundreds = Math.floor(n / 100);
  let result = '';

  if (hundreds === 1) {
    result = 'ひゃく';
  } else if (hundreds === 3) {
    result = 'さんびゃく'; // Special reading
  } else if (hundreds === 6) {
    result = 'ろっぴゃく'; // Special reading
  } else if (hundreds === 8) {
    result = 'はっぴゃく'; // Special reading
  } else {
    result = onesReading[hundreds] + 'ひゃく';
  }

  return { result, remainder: n % 100 };
}

function handleTensAndOnes(n: number): string {
  if (n === 0) return '';

  let result = '';

  // Handle tens (10-99)
  if (n >= 10) {
    const tens = Math.floor(n / 10);
    if (tens === 1) {
      result += 'じゅう';
    } else {
      result += onesReading[tens] + 'じゅう';
    }
    n %= 10;
  }

  // Handle ones (1-9)
  if (n > 0) {
    result += onesReading[n];
  }

  return result;
}

function convertChunkJA(n: number): string {
  if (n === 0) return '';

  let result = '';

  // Handle thousands
  const thousandsResult = handleThousands(n);
  result += thousandsResult.result;
  n = thousandsResult.remainder;

  // Handle hundreds
  const hundredsResult = handleHundreds(n);
  result += hundredsResult.result;
  n = hundredsResult.remainder;

  // Handle tens and ones
  result += handleTensAndOnes(n);

  return result;
}

export const jaConverter: LocaleConverter = {
  convert(amount: number): string {
    // Validate input
    if (!isFinite(amount)) {
      throw new Error('金額は有限数である必要があります');
    }

    if (amount < 0) {
      throw new Error('金額は負の値にできません');
    }

    if (amount >= 1000000000000) {
      throw new Error('金額が大きすぎます（一兆円を超えています）');
    }

    // Round to 2 decimal places
    const roundedAmount = Math.round(amount * 100) / 100;
    const [majorStr, minorStr] = roundedAmount.toFixed(2).split('.');
    const major = parseInt(majorStr, 10);
    const minor = parseInt(minorStr, 10);

    let result = '';

    if (major === 0) {
      result = 'ぜろえん';
    } else {
      result = numberToWordsJA(major) + 'えん';
    }

    if (minor > 0) {
      result += numberToWordsJA(minor) + 'せん';
    }

    return result;
  }
};

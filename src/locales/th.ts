import { LocaleConverter } from '../types';

const thNum = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const thPos = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

function handleLargeNumbers(n: number): string {
  if (n >= 1000000000) {
    const billions = Math.floor(n / 1000000000);
    const remainder = n % 1000000000;
    let result = `${numberToWordsTH(billions)}พันล้าน`;
    if (remainder > 0) {
      result += numberToWordsTH(remainder);
    }
    return result;
  }

  if (n >= 1000000) {
    const millions = Math.floor(n / 1000000);
    const remainder = n % 1000000;
    let result = `${numberToWordsTH(millions)}ล้าน`;
    if (remainder > 0) {
      result += numberToWordsTH(remainder);
    }
    return result;
  }

  return '';
}

function getThaiDigitWord(digit: number, position: number, totalLength: number): string {
  // Handle special cases for Thai number system
  if (position === 0 && digit === 1 && totalLength > 1) {
    // ตัวหน่วยที่เป็น 1 และมีหลักอื่น → "เอ็ด"
    return 'เอ็ด';
  }

  if (position === 1 && digit === 2) {
    // หลักสิบที่เป็น 2 → "ยี่"
    return 'ยี่';
  }

  if (position === 1 && digit === 1) {
    // หลักสิบที่เป็น 1 → ไม่ต้องใส่ "หนึ่ง"
    return '';
  }

  return thNum[digit];
}

function numberToWordsTH(n: number): string {
  if (n === 0) return 'ศูนย์';

  // Handle negative numbers (although we don't expect them in currency)
  if (n < 0) {
    return `ลบ${numberToWordsTH(Math.abs(n))}`;
  }

  // Handle large numbers
  const largeNumberResult = handleLargeNumbers(n);
  if (largeNumberResult) {
    return largeNumberResult;
  }

  let result = '';
  const str = n.toString();
  const len = str.length;

  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i]);
    const pos = len - i - 1;

    if (digit === 0) continue;

    result += getThaiDigitWord(digit, pos, len);

    // เพิ่มหลัก
    if (pos > 0) {
      result += thPos[pos];
    }
  }

  return result;
}

export const thConverter: LocaleConverter = {
  convert(amount: number): string {
    // Validate input
    if (!isFinite(amount)) {
      throw new Error('จำนวนเงินต้องเป็นตัวเลขที่ถูกต้อง');
    }

    if (amount < 0) {
      throw new Error('จำนวนเงินไม่สามารถเป็นค่าลบได้');
    }

    // Handle very large amounts
    if (amount >= 1000000000000) {
      throw new Error('จำนวนเงินใหญ่เกินไป (เกินล้านล้านบาท)');
    }

    // Round to 2 decimal places to handle floating point precision
    const roundedAmount = Math.round(amount * 100) / 100;
    const [majorStr, minorStr] = roundedAmount.toFixed(2).split('.');
    const major = parseInt(majorStr, 10);
    const minor = parseInt(minorStr, 10);

    let result = '';

    if (major === 0) {
      result = 'ศูนย์บาท';
    } else {
      result = numberToWordsTH(major) + 'บาท';
    }

    if (minor === 0) {
      result += 'ถ้วน';
    } else {
      result += numberToWordsTH(minor) + 'สตางค์';
    }

    return result;
  }
};
